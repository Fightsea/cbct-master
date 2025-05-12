import { matchIsValidColor, MuiColorInput, type MuiColorInputProps } from 'mui-color-input'
import { Controller, useFormContext } from 'react-hook-form'

type Props = {
  name: string
  label: string
  required?: boolean
} & MuiColorInputProps

const FormColorPicker = ({ name, label, required, ...props }: Props) => {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      rules={{ validate: matchIsValidColor }}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <MuiColorInput
          variant={'filled'}
          label={label + (required ? '*' : '')}
          format={'hex'}
          error={!!error}
          helperText={error?.message}
          {...props}
          {...field}
        />
      )}
    />
  )
}

export default FormColorPicker
