import { styled, FormHelperText, Select, SelectProps, MenuItem, FormControl, Typography, InputAdornment } from '@mui/material'
import { Controller, FieldValues, Path, PathValue, useFormContext } from 'react-hook-form'
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined'
import { useRef } from 'react'

type Props<T extends FieldValues> = {
  name: Path<T>
  label: string
  options: {
    value: PathValue<T, Path<T>>
    label: string
  }[]
  required?: boolean
  labelColor?: string
  placeholder?: string
} & SelectProps

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: '#FAFAFA',
  borderRadius: '4px',
  '& .MuiSelect-select': {
    transition: 'all 0.2s ease-in-out',
    borderBottom: '1px solid transparent',
    padding: '12px 16px'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    display: 'none'
  },
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
  },
  '& .MuiSelect-icon': {
    right: '8px'
  }
}))

const StyledFormHelperText = styled(FormHelperText)(({ }) => ({
  marginLeft: 0,
  marginTop: '4px',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.5
}))

const FormSelect = <T extends FieldValues>({
  name,
  label,
  options,
  required,
  placeholder,
  labelColor = '#fff',
  ...props
}: Props<T>) => {
  const { control } = useFormContext()
  const selectRef = useRef<HTMLSelectElement>(null)

  const handleLabelClick = () => {
    selectRef.current?.focus()
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormControl fullWidth error={invalid}>
          <Typography
            component={'label'}
            onClick={handleLabelClick}
            color={labelColor}
            sx={{ marginBottom: 1, fontSize: 14, fontWeight: 600 }}
          >
            {label}
            <Typography display={required ? 'inline' : 'none' } color={'#FF7700'} sx={{ ml: '8px' }}>*</Typography>
          </Typography>
          <StyledSelect
            {...field}
            {...props}
            placeholder={placeholder}
            inputRef={selectRef}
            displayEmpty
            endAdornment={
              invalid ? (
                <InputAdornment position={'end'} sx={{ mr: 3 }}>
                  <ErrorOutlinedIcon color={'error'} />
                </InputAdornment>
              ) : null
            }
            renderValue={(selected) => {
              if (!selected) {
                return <Typography sx={{ color: '#A1A1A1' }}>{placeholder}</Typography>
              }
              return <Typography sx={{ color: '#333333' }}>
                {options.find(option => option.value === selected)?.label}
              </Typography>
            }}
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </StyledSelect>
          {invalid && (
            <StyledFormHelperText>
              {error?.message}
            </StyledFormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}

export default FormSelect
