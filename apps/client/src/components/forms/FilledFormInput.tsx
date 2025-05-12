import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext
} from 'react-hook-form'
import {
  TextField,
  type TextFieldProps
} from '@mui/material'

type Props<T extends FieldValues> = {
  name: Path<T>
  label: string
  required?: boolean
} & TextFieldProps

const FilledFormInput = <T extends FieldValues>({
  name,
  label,
  required,
  ...props
}: Props<T>) => {
  const { control } = useFormContext()


  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <>
          <TextField
            variant={'filled'}
            color={'primary'}
            label={label + (required ? '*' : '')}
            error={!!error}
            helperText={error?.message}
            {...field}
            {...props}
            onChange={(e) => {
              if (required) {
                const value = e.target.value
                field.onChange(value === '' ? undefined : value)
              } else {
                field.onChange(e.target.value)
              }
            }}
            slotProps={(props.defaultValue || field.value) && { inputLabel: { shrink: true } }}
          />
        </>
      )}
    />
  )
}

export default FilledFormInput
