import { Box, Typography, Input, FormHelperText } from '@mui/material'
import {  Controller, useFormContext } from 'react-hook-form'
import Image from 'next/image'
import { ChangeEvent, useRef } from 'react'

type Props = {
  name: string
}

const FormImageUpload = ({ name }: Props) => {
  const { control, setValue, getValues } = useFormContext()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBoxClick = () => {
    fileInputRef.current?.click()
  }

  const handleUploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return
    setValue('image', event.target.files[0], {
      shouldValidate: true
    })
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ fieldState: { error } }) => (
        <>
          <Box sx={{
            position: 'relative',
            width: '100%',
            height: 196,
            borderRadius: 2,
            background: '#fff'
          }}>
            <Box
              onClick={handleBoxClick}
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: '#E8E8E8',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {getValues(name) ? (
                <Image
                  src={URL.createObjectURL(getValues(name))}
                  alt={'logo'}
                  fill
                  style={{ objectFit: 'cover'}}
                />
              ): (
                <>
                  <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                    Click to Upload Image
                  </Typography>
                  <Typography sx={{ fontFamily: 'Roboto', fontSize: 12, fontWeight: 400, color: '#656565' }}>
                    Supports: JPEG, JPG, PNG
                  </Typography>
                </>
              )}
              <Input
                inputRef={fileInputRef}
                className={'visually-hidden'}
                type={'file'}
                inputProps={{
                  accept: '.jpeg,.jpg,.png'
                }}
                onChange={handleUploadImage}
              />
            </Box>
          </Box>
          <FormHelperText sx={{ color: '#FF7700' }}>{error?.message}</FormHelperText>
        </>
      )}
    />
  )
}

export default FormImageUpload
