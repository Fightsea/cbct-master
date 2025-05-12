import Image from 'next/image'
import { Box, BoxProps } from '@mui/material'
import { useEffect, useState } from 'react'
import patientApi from '@/apis/patientApi'
import { authStore } from '@/stores/authStore'
import empty from '@/public/empty.png'
import patientPhotoApi from '@/apis/patientPhotoApi'
import useSWR from 'swr'

interface PatientAvatarProps extends Omit<BoxProps, 'children'> {
  patientId: string
}

const PatientAvatar = ({ patientId, sx, ...props }: PatientAvatarProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string>()
  const [error, setError] = useState(false)

  const { data: taggedPhotoIds } = useSWR(
    `patient-photos/${patientId}/tagged` || null,
    () => patientPhotoApi.getTagged(patientId || '')
      .then(res => ({
        frontImageId: res.front?.id,
        profileImageId: res.profile?.id
      }))
  )

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const url = await patientApi.getAvatar(patientId)
        setAvatarUrl(url)
        setError(false)
      } catch {
        setError(true)
      }
    }

    if (patientId) {
      fetchAvatar()
    }

    return () => {}
  }, [patientId, taggedPhotoIds])

  if (error || !avatarUrl) {
    return (
      <Box
        {...props}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          ...sx
        }}
      >
        <Image
          src={empty}
          alt={'cbct-empty'}
          fill
          style={{
            objectFit: 'cover'
          }}
        />
      </Box>
    )
  }

  return (
    <Box
      {...props}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...sx
      }}
    >
      <Image
        src={avatarUrl}
        alt={'Patient avatar'}
        fill
        style={{
          objectFit: 'cover'
        }}
        priority
      />
    </Box>
  )
}

PatientAvatar.getInitialProps = async () => {
  if (typeof window !== 'undefined') {
    const clinicId = authStore.getState().clinicId

    if (!clinicId) {
      window.location.href = '/'
      return {}
    }
  }

  return {}
}

export default PatientAvatar
