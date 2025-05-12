import PatientPhotoBox from '@/components/boxes/PatientPhotoBox'
import { patientPageStore } from '@/stores/patientPageStore'
import { useStore } from 'zustand'
import useSWR from 'swr'
import patientPhotoApi from '@/apis/patientPhotoApi'
import { PatientPhotoType } from '@cbct/enum/patientPhoto'
import { ChangeEvent, useContext, useState } from 'react'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import { FileTypes, findInvalidFiles } from '@/utils/fileValidator'
import ImageUploadErrorDialog from '@/containers/dialogs/ImageUploadErrorDialog'

const PatientPhoto = () => {
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const { patientId } = useStore(patientPageStore)
  const { data: patientPhotos, mutate: mutatePatientPhotos } = useSWR(
    patientId ? `patient-photos/${patientId}` : null,
    () => patientPhotoApi.getPhotos(patientId || '')
      .then(res => {
        return Object.entries(res).map(([date, images]) => ({
          date,
          images: images.map((image) => ({
            id: image.id,
            imageUrl: image.url
          }))
        }))
      })
  )
  const { data: taggedPhotoIds, mutate: mutateTaggedPhotoIds } = useSWR(
    `patient-photos/${patientId}/tagged` || null,
    () => patientPhotoApi.getTagged(patientId || '')
      .then(res => ({
        frontImageId: res.front?.id,
        profileImageId: res.profile?.id
      }))
  )

  const snackbar = useContext(SnackbarContext)

  const handleSetFrontImage = (id: uuid) => {
    patientPhotoApi.switchType(id, { type: PatientPhotoType.FRONT })
      .then(() => {
        snackbar.openSnackbar({
          message: 'Set Successfully',
          severity: 'success'
        })
        mutateTaggedPhotoIds()
      })
      .catch(() => {
        snackbar.openSnackbar({
          message: 'Set Failed',
          severity: 'error'
        })
      })
  }

  const handleSetProfileImage = (id: uuid) => {
    patientPhotoApi.switchType(id, { type: PatientPhotoType.PROFILE })
      .then(() => {
        snackbar.openSnackbar({
          message: 'Set Successfully',
          severity: 'success'
        })
        mutateTaggedPhotoIds()
      })
      .catch(() => {
        snackbar.openSnackbar({
          message: 'Set Failed',
          severity: 'error'
        })
      })
  }

  const handleDeleteImage = (id: uuid) => {
    patientPhotoApi.delete(id)
      .then(() => {
        snackbar.openSnackbar({
          message: 'Delete Successfully',
          severity: 'success'
        })
        mutatePatientPhotos()
        mutateTaggedPhotoIds()
      })
      .catch(() => {
        snackbar.openSnackbar({
          message: 'Delete Failed',
          severity: 'error'
        })
      })
  }

  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleUploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const invalidFiles = findInvalidFiles(files, FileTypes.PHOTO)

    if (invalidFiles.length > 0) {
      setIsErrorDialogOpen(true)
      return
    }    // // await photoUpload(Array.from(files))

    if (files && files.length > 0) {
      setIsUploading(true)
      setUploadProgress(0)
      await patientPhotoApi.upload({
        patientId: patientId || '',
        images: Array.from(files)
      }, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          )
          setUploadProgress(percentCompleted)
        }
      })
        .then(() => {
          snackbar.openSnackbar({
            message: 'Upload Successfully',
            severity: 'success'
          })
          mutatePatientPhotos()
          setIsUploading(false)
          setUploadProgress(0)
        })
        .catch(() => {
          snackbar.openSnackbar({
            message: 'Upload Failed',
            severity: 'error'
          })
          setIsUploading(false)
          setUploadProgress(0)
        })
    }

  }

  return (
    <>
      <PatientPhotoBox
        images={patientPhotos || []}
        frontImageId={taggedPhotoIds?.frontImageId || null}
        profileImageId={taggedPhotoIds?.profileImageId || null}
        setFrontImage={handleSetFrontImage}
        setProfileImage={handleSetProfileImage}
        deleteImage={handleDeleteImage}
        handleUploadFiles={handleUploadFiles}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        showActions={true}
      />
      <ImageUploadErrorDialog
        open={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
      />
    </>
  )
}

export default PatientPhoto
