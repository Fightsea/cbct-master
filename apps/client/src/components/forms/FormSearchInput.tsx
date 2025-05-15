import { IconButton, InputAdornment, SxProps, TextField, styled } from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

type Props = {
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
  sx?: SxProps
  onSubmit?: (event: React.ChangeEvent<{}>) => void
}

const StyledTextField = styled(TextField)({
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

const StyledIconButton = styled(IconButton)({
  color: '#656565',
  '&:hover': {
    backgroundColor: 'transparent'
  }
})

const FormSearchInput = ({ value, onChange, placeholder = 'Search', sx, onSubmit }: Props) => {
  return (
    <StyledTextField
      size='small'
      autoComplete='off'
      value={value}
      placeholder={placeholder}
      sx={sx}
      onChange={e => onChange(e.target.value)}
      slotProps={{
        input: {
          sx: { padding: '0px' },
          endAdornment: (
            <InputAdornment position={'end'}>
              <StyledIconButton size={'small'} onClick={onSubmit}>
                <SearchRoundedIcon />
              </StyledIconButton>
            </InputAdornment>
          )
        }
      }}
    />
  )
}

export default FormSearchInput
