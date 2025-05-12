import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers'
import { Controller, useFormContext } from 'react-hook-form'
import dayjs, { Dayjs } from 'dayjs'
import { styled, TextFieldProps, Typography } from '@mui/material'
import { useRef } from 'react'

type Props = {
  name: string
  label: string
  required?: boolean
  placeholder?: string
  labelColor?: string
  textFieldProps?: TextFieldProps
} & DatePickerProps<Dayjs>

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      display: 'none'
    },
    backgroundColor: '#FAFAFA',
    borderRadius: '4px',
    transition: 'all 0.2s ease-in-out',
    borderBottom: '1px solid transparent',

    '&:hover': {
      backgroundColor: '#FAFAFA'
    },

    '&.Mui-focused': {
      borderBottom: '3px solid #6E7AB8',
      backgroundColor: '#FAFAFA'
    },

    '&.Mui-error': {
      borderBottom: `3px solid ${theme.palette.error.main}`,
      backgroundColor: '#FAFAFA'
    }
  },

  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginTop: '4px',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 1.5
  }
}))

const FormDatePicker = ({
  name,
  label,
  required,
  placeholder,
  labelColor = '#fff',
  textFieldProps,
  ...props
}: Props) => {
  const { control } = useFormContext()
  const dateRef = useRef<HTMLInputElement>(null)

  const handleLabelClick = () => {
    dateRef.current?.focus()
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error, invalid } }) => (
        <>
          <Typography
            component={'label'}
            onClick={handleLabelClick}
            color={labelColor}
            sx={{ marginBottom: 1, fontSize: 14, fontWeight: 600, display: 'block' }}
          >
            {label}
            <Typography display={required ? 'inline' : 'none' } color={'#FF7700'} sx={{ ml: '8px' }}>*</Typography>
          </Typography>
          <StyledDatePicker
            {...field}
            {...props}
            value={dayjs(field.value || null)}
            onChange={(value) => {
              field.onChange(value?.format('YYYY-MM-DD') || null)
            }}
            inputRef={dateRef}
            format={'YYYY-MM-DD'}
            slotProps={{
              textField: {
                error: invalid,
                helperText: error?.message,
                label: '',
                placeholder: placeholder || 'YYYY-MM-DD',
                fullWidth: true,
                InputLabelProps: {
                  shrink: false
                },
                ...textFieldProps
              }
            }}
          />
        </>
      )}
    />
  )
}

export default FormDatePicker
