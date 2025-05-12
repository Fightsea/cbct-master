import { Autocomplete, IconButton, InputAdornment, SxProps, TextField, styled } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

type Props = {
  options: string[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  sx?: SxProps
}

const StyledAutocomplete = styled(Autocomplete)<{
  freeSolo?: boolean;
  options: string[];
  value: string | null;
}>({
  width: '100%',
  maxWidth: '360px',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F5F5F5',
    borderRadius: '50px',
    paddingRight: '8px',
    paddingY: '0px',
    '& fieldset': {
      border: 'none'
    }
  }
})

const StyledTextField = styled(TextField)({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#F5F5F5',
    padding: '0px 16px'
  }
})

const StyledIconButton = styled(IconButton)({
  color: '#656565',
  '&:hover': {
    backgroundColor: 'transparent'
  }
})

const FormSearchInput = ({ options, value, onChange, placeholder = 'Search...', sx }: Props) => {
  return (
    <StyledAutocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue as string | null)}
      options={options}
      freeSolo
      disableClearable
      sx={sx}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          placeholder={placeholder}
          slotProps={{
            input: {
              sx: { padding: '0px' },
              ...params,
              endAdornment: (
                <InputAdornment position={'end'}>
                  <StyledIconButton size={'small'}>
                    <SearchRoundedIcon />
                  </StyledIconButton>
                  {params.InputProps.endAdornment}
                </InputAdornment>
              )
            }
          }}
        />
      )}
    />
  )
}

export default FormSearchInput
