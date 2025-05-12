import React, { useEffect, useRef } from 'react'
import * as cornerstone from 'cornerstone-core'
import dicomParser from 'dicom-parser'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import { Box, SxProps } from '@mui/material'

cornerstoneWADOImageLoader.external.cornerstone = cornerstone
cornerstoneWADOImageLoader.external.dicomParser = dicomParser

const DicomViewer = ({ dicomUrl, sx }: { dicomUrl: string, sx?: SxProps }) => {
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = viewerRef.current
    if (!element) return

    cornerstone.enable(element)

    const loadImage = async () => {
      try {
        const imageId = 'wadouri:' + dicomUrl
        const image = await cornerstone.loadImage(imageId)
        cornerstone.displayImage(element, image)
      } catch {
        console.error('Error loading DICOM image')
      }
    }

    loadImage()

    return () => {
      cornerstone.disable(element)
    }
  }, [dicomUrl])

  return (
    <Box
      ref={viewerRef}
      sx={{
        overflow: 'hidden',
        ...sx
      }}
    />
  )
}

export default DicomViewer
