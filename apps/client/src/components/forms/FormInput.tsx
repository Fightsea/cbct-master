import { Controller,
  FieldValues,
  Path,
  useFormContext
} from 'react-hook-form'
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  styled,
  TextField,
  Typography,
  type TextFieldProps
} from '@mui/material'
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined'

type Props<T extends FieldValues> = {
  name: Path<T>
  label: string
  labelColor?: string
  placeholder?: string
  min?: number
  max?: number
} & TextFieldProps

const StyledTextField = styled(TextField)(({ theme }) => ({
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

  '& .MuiFormHelperText-root.Mui-error': {
    marginLeft: 0,
    marginTop: '4px'
  },

  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'transparent'
  },

  '& .MuiInputBase-input': {
    fontSize: '16px',
    lineHeight: '150%',
    padding: '12px 16px'
  }
}))

const StyledFormHelperText = styled(FormHelperText)(({ }) => ({
  marginLeft: '16px',
  marginTop: '4px',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '16px'
}))


const FormInput = <T extends FieldValues>({
  name,
  label,
  required,
  placeholder,
  labelColor = '#fff',
  ...props
}: Props<T>) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error, invalid } }) => (
        <FormControl fullWidth>
          <Typography
            component={'label'}
            htmlFor={name}
            color={labelColor}
            sx={{ marginBottom: 1, fontSize: 14, fontWeight: 600 }}
          >
            {label}
            <Typography display={required ? 'inline' : 'none' } color={'#FF7700'} sx={{ ml: '8px' }}>*</Typography>
          </Typography>
          <StyledTextField
            id={name}
            placeholder={placeholder}
            error={invalid}
            slotProps={{
              htmlInput: {
                min: props.min,
                max: props.max
              },
              input: {
                endAdornment: invalid && (
                  <InputAdornment position={'end'}>
                    <ErrorOutlinedIcon color={'error'} />
                  </InputAdornment>
                )
              }
            }}
            {...field}
            {...props}
          />
          {invalid && (
            <StyledFormHelperText error={invalid}>
              {error?.message}
            </StyledFormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}

export default FormInput
