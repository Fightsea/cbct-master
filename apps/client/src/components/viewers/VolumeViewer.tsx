// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useRef, useEffect, useState, useContext } from 'react'
import '@kitware/vtk.js/Rendering/Profiles/Volume'
import vtkColorTransferFunction from '@kitware/vtk.js/Rendering/Core/ColorTransferFunction'
import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow'
import vtkPiecewiseFunction from '@kitware/vtk.js/Common/DataModel/PiecewiseFunction'
import vtkVolume from '@kitware/vtk.js/Rendering/Core/Volume'
import vtkVolumeMapper from '@kitware/vtk.js/Rendering/Core/VolumeMapper'
import vtkITKHelper from '@kitware/vtk.js/Common/DataModel/ITKHelper'
import vtkHttpDataAccessHelper from '@kitware/vtk.js/IO/Core/DataAccessHelper/HttpDataAccessHelper'
import { SnackbarContext } from '@/contexts/SnackbarContext'


type Props = {
  width: string;
  height: string;
  fileUrl?: string | null;
}

type VtkContext = {
  fullScreenRenderer: any;
  renderWindow: any;
  renderer: any;
  actor: any;
  mapper: any;
}

const VolumeViewer = ({ width, height, fileUrl }: Props) => {
  const vtkContainerRef = useRef(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const [isFileSelectable, setIsFileSelectable] = useState(false)
  const [proxyUrl, setProxyUrl] = useState<string | null>(null)
  const context = useRef<VtkContext | null>(null)
  const { openSnackbar } = useContext(SnackbarContext)

  // Initialize VTK.js rendering context and configure volume rendering properties
  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        // @ts-expect-error - VTK.js expects DOM element but type is not properly defined
        rootContainer: vtkContainerRef.current,
        background: [0, 0, 0],
        containerStyle: {
          width: width,
          height: height,
          borderRadius: '8px',
          overflow: 'hidden'
        }
      })

      const renderer = fullScreenRenderer.getRenderer()
      const renderWindow = fullScreenRenderer.getRenderWindow()
      const actor = vtkVolume.newInstance()
      const mapper = vtkVolumeMapper.newInstance()

      mapper.setSampleDistance(0.7)
      actor.setMapper(mapper)

      // Reset color transfer function, using grayscale
      const ctfun = vtkColorTransferFunction.newInstance()
      // Set grayscale color scale, from black to white
      ctfun.addRGBPoint(0.0, 0.0, 0.0, 0.0)
      ctfun.addRGBPoint(1000.0, 0.5, 0.5, 0.5)
      ctfun.addRGBPoint(2000.0, 1.0, 1.0, 1.0)

      // Adjust opacity transfer function
      const ofun = vtkPiecewiseFunction.newInstance()
      ofun.addPoint(0.0, 0.0)
      ofun.addPoint(500.0, 0.2)
      ofun.addPoint(1000.0, 0.4)
      ofun.addPoint(2000.0, 0.8)

      // Configure volume properties
      actor.getProperty().setRGBTransferFunction(0, ctfun)
      actor.getProperty().setScalarOpacity(0, ofun)
      actor.getProperty().setScalarOpacityUnitDistance(0, 3.0)
      actor.getProperty().setInterpolationTypeToLinear()

      // Adjust lighting effects for softer appearance
      actor.getProperty().setShade(true)
      actor.getProperty().setAmbient(0.3)
      actor.getProperty().setDiffuse(0.6)
      actor.getProperty().setSpecular(0.2)
      actor.getProperty().setSpecularPower(10.0)

      // Adjust gradient opacity to enhance edge effects
      actor.getProperty().setUseGradientOpacity(0, true)
      actor.getProperty().setGradientOpacityMinimumValue(0, 10)
      actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0)
      actor.getProperty().setGradientOpacityMaximumValue(0, 90)
      actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0)

      context.current = {
        fullScreenRenderer,
        renderWindow,
        renderer,
        actor,
        mapper
      }
    }
  }, [width, height, vtkContainerRef])


  const handleFileChange = async (file: any) => {
    const { image, webWorker} = await getNiftiImage(file)
    const vtkImage = vtkITKHelper.convertItkToVtkImage(image)

    if (!context.current) return

    const { renderer, actor, mapper, renderWindow } = context.current

    // Get the range of volume data values (minimum and maximum)
    const dataRange = vtkImage.getPointData().getScalars().getRange()

    // Set up color transfer function - determines how different values map to colors
    const ctfun = vtkColorTransferFunction.newInstance()
    ctfun.addRGBPoint(dataRange[0], 0.0, 0.0, 0.0)  // Map minimum value to black (R=0, G=0, B=0)
    ctfun.addRGBPoint(dataRange[0] + (dataRange[1] - dataRange[0]) * 0.5, 0.5, 0.5, 0.5)  // Middle value maps to gray
    ctfun.addRGBPoint(dataRange[1], 1.0, 1.0, 1.0)  // Map maximum value to white (R=1, G=1, B=1)

    // Set up opacity transfer function - controls transparency for different values
    const ofun = vtkPiecewiseFunction.newInstance()
    ofun.addPoint(dataRange[0], 0.0)  // Set minimum value to fully transparent (opacity = 0.0)
    ofun.addPoint(dataRange[0] + (dataRange[1] - dataRange[0]) * 0.5, 0.5)   // Set medium opacity (0.5) at 50% position
    ofun.addPoint(dataRange[1], 1.0)  // Set higher opacity (1) for maximum value to make important structures more visible

    // Apply color and opacity functions to the volume renderer
    actor.getProperty().setRGBTransferFunction(0, ctfun)
    actor.getProperty().setScalarOpacity(0, ofun)

    // Set up gradient opacity - enhances edge effects
    actor.getProperty().setUseGradientOpacity(0, true)
    actor.getProperty().setGradientOpacityMinimumValue(0, 0)  // Adjust to smaller value
    actor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0)
    actor.getProperty().setGradientOpacityMaximumValue(0, dataRange[1] * 0.05)  // Use a small portion of data range
    actor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0)

    // Set sampling distance - affects rendering quality and performance
    mapper.setSampleDistance(0.4)  // Smaller value = higher quality but slower; Larger value = faster but lower quality

    // Connect volume data to rendering pipeline
    mapper.setInputData(vtkImage)
    renderer.addVolume(actor)


    renderer.resetCamera()  // Reset and adjust camera view
    renderer.getActiveCamera().zoom(1.5)  // Zoom in by 1.5x
    renderer.getActiveCamera().elevation(70) // Set elevation to 70 degrees for better viewing angle

    renderer.updateLightsGeometryToFollowCamera()  // Update light positions to follow camera
    renderWindow.render() // Trigger re-render

    webWorker.terminate() // Terminate Web Worker to free up resources
    setIsFileSelectable(true)
  }

  const getNiftiImage = async (file) => {
    const { niftiReadImage } = await import(
      /* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/@itk-wasm/image-io@1.1.0/dist/bundle/index-worker-embedded.min.js'
    )
    const { image, webWorker } = await niftiReadImage(file, {})

    return {
      image,
      webWorker
    }
  }

  useEffect(() => {
    if (!fileUrl) return
    const regex = /(?:https?:\/\/[^\/]+)\/(.+)/
    const pathname = fileUrl?.match(regex)[1]
    const newUrl = `/proxy/${pathname}`

    setProxyUrl(newUrl)
  }, [fileUrl])

  useEffect(() => {
    if (!proxyUrl) return
    const fetchData = async () => {
      try {
        const binary =  await vtkHttpDataAccessHelper.fetchBinary(proxyUrl)
        const file = new File([binary], 'volume.nii.gz', {})

        handleFileChange(file)
      } catch (err) {
        const { status, statusText } = err.xhr
        openSnackbar({
          message: `Error fetching data : ${status} ${statusText}`,
          severity: 'error'
        })
      }
    }

    fetchData()
  }, [proxyUrl])


  return (
    <>
      <input type={'file'} ref={fileInput} onChange={() => {
        const file = fileInput.current?.files?.[0]
        if (!file) return
        handleFileChange(file)
      }} hidden />
      <div
        ref={vtkContainerRef}
        onClick={() => {
          if (!isFileSelectable) {
            fileInput.current?.click()
          }
        }}
      >
      </div>
    </>
  )
}

export default VolumeViewer
