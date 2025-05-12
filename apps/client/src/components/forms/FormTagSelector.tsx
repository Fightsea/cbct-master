import tagApi from '@/apis/tagApi'
import { Tag } from '@cbct/api/response/tag'
import {
  FormControl,
  Autocomplete,
  AutocompleteProps,
  Button,
  Dialog,
  DialogActions,
  TextField,
  DialogContent,
  DialogTitle,
  createFilterOptions,
  Grid2,
  Typography
} from '@mui/material'
import {
  Controller,
  FieldValues,
  FormProvider,
  Path,
  useForm,
  useFormContext
} from 'react-hook-form'
import useSWR from 'swr'
import TagChip from '@/components/chips/TagChip'
import { useContext, useState } from 'react'
import FilledFormInput from './FilledFormInput'
import FormColorPicker from './FormColorPicker'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateRequest, createRequestBodySchema } from '@cbct/api/request/tag'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import { useRef } from 'react'

type Props<T extends FieldValues> = {
  name: Path<T>
  label: string
  required?: boolean
  labelColor?: string
} & Omit<
  AutocompleteProps<Tag, true, undefined, undefined>,
  'renderInput' | 'options' | 'multiple'
>

type ExtendedTag = Tag

const FormTagSelector = <T extends { [key: string]: any }>({
  name,
  label,
  required,
  labelColor = '#fff',
  ...props
}: Props<T>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: tags, mutate } = useSWR('/tags', tagApi.getByClinic)
  const { control, getValues, setValue } = useFormContext<T>()
  const { openSnackbar } = useContext(SnackbarContext)
  const selectRef = useRef<HTMLSelectElement>(null)
  const form = useForm<CreateRequest>({
    resolver: zodResolver(createRequestBodySchema)
  })

  const filter = createFilterOptions<ExtendedTag>()

  const onSubmit = async (data: CreateRequest) => {
    try {
      const response = await tagApi.create(data)
      await mutate()

      const currentValues = getValues(name) as string[]
      setValue(name, [...currentValues, response.id] as any, {
        shouldValidate: true
      })

      setIsDialogOpen(false)
      openSnackbar({
        message: 'Create tag success',
        severity: 'success'
      })

      form.reset()
    } catch {
      openSnackbar({
        message: 'Create failed',
        severity: 'error'
      })
    }
  }

  const handleLabelClick = () => {
    selectRef.current?.focus()
  }

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <>
            <FormControl fullWidth>
              <Typography
                component={'label'}
                onClick={handleLabelClick}
                color={labelColor}
                sx={{ marginBottom: 1, fontSize: 14, fontWeight: 600 }}
              >
                {label}
                <Typography display={required ? 'inline' : 'none' } color={'#FF7700'} sx={{ ml: '8px' }}>*</Typography>
              </Typography>
              <Autocomplete
                multiple
                id={'name'}
                disablePortal
                value={Array.isArray(field.value)
                  ? tags?.filter(tag => field.value.includes(tag.id)) || []
                  : []}
                onChange={(_, newValue) => {
                  const filteredTag = newValue.find(tag => tag.id === 'filtered')
                  if (filteredTag) {
                    setTimeout(() => {
                      setIsDialogOpen(true)
                      form.setValue('name', filteredTag.name.replace(/^Add "(.+)"$/, '$1'))
                    })
                  } else {
                    field.onChange(newValue.map(tag => tag.id))
                  }
                }}
                filterOptions={(options: ExtendedTag[], params) => {
                  const filtered = filter(options, params)

                  if (params.inputValue !== '') {
                    filtered.push({
                      name: `Add "${params.inputValue}"`,
                      id: 'filtered',
                      color: ''
                    })
                  }

                  return filtered
                }}
                options={tags || []}
                getOptionLabel={(option) => option.name}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => {
                    const { key, onDelete } = getTagProps({ index })
                    return (
                      <TagChip
                        id={option.id}
                        key={key}
                        label={option.name}
                        color={option.color}
                        onRemove={onDelete}
                        mutateTags={mutate}
                        sx={{
                          fontWeight: 600,
                          fontSize: 14,
                          py: 0.5,
                          px: 1,
                          borderRadius: 8,
                          margin: 0.5
                        }}
                      />
                    )
                  })
                }
                renderOption={(props, option) => (
                  <li {...props}>
                    <TagChip
                      id={option.id}
                      label={option.name}
                      color={option.color}
                      sx={{
                        fontWeight: 600,
                        fontSize: 14,
                        py: 0.5,
                        px: 1,
                        borderRadius: 8,
                        margin: 0.5
                      }}
                    />
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputRef={selectRef}
                    label={''}
                    variant={'filled'}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
                sx={{
                  '.MuiInputBase-root': {
                    padding: '6px 16px',
                    borderRadius: '4px',
                    backgroundColor: '#FAFAFA',
                    '&.Mui-focused': {
                      backgroundColor: '#FAFAFA',
                      borderBottom: '3px solid #6E7AB8'
                    },
                    '&::before, &::after': {
                      display: 'none'
                    }
                  }
                }}
                {...props}
              />
            </FormControl>
          </>
        )}
      />

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogTitle>Create a new tag</DialogTitle>
            <DialogContent>
              <Grid2 container spacing={2}>
                <Grid2 size={12}>
                  <FilledFormInput
                    name={'name'}
                    label={'Name'}
                    required
                    fullWidth
                  />
                </Grid2>
                <Grid2 size={12}>
                  <FormColorPicker
                    name={'color'}
                    label={'Color'}
                    value={form.getValues('color')}
                    required
                    fullWidth
                  />
                </Grid2>
              </Grid2>
            </DialogContent>
            <DialogActions>
              <Button variant={'secondary'} onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button variant={'primary'} onClick={() => form.handleSubmit(onSubmit)()}>Add</Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </>
  )
}

export default FormTagSelector
