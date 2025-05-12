import {
  Checkbox,
  type CheckboxProps,
  styled,
  SvgIcon
} from '@mui/material'

const WhiteBackgroundCheckBoxStyles = {
  zIndex: 1,
  '&.Mui-checked::before': {
    borderRadius: 4,
    position: 'absolute',
    zIndex: -1,
    content: '""',
    height: '18px',
    width: '18px',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff'
  }
}

const WhiteBackgroundCheckBox = styled(Checkbox)(WhiteBackgroundCheckBoxStyles)

const CheckBoxBlankIcon = () => (
  <SvgIcon>
    <svg focusable={'false'} aria-hidden={'true'} data-testid={'CheckBoxBlankIcon'}>
      <path
        d={'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5'}
        fill={'white'}
      ></path>
    </svg>
  </SvgIcon>
)

const WhiteCheckBox = ({ ...props }: CheckboxProps) => {
  return (
    <WhiteBackgroundCheckBox icon={<CheckBoxBlankIcon />} {...props} />
  )
}

export default WhiteCheckBox
