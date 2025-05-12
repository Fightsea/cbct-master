import { SvgIcon, type SvgIconProps } from '@mui/material'

const AlertCircleIcon = ({ ...props }: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg width={'23'} height={'23'} viewBox={'0 0 23 23'} fill={'none'} xmlns={'http://www.w3.org/2000/svg'}>
        <path d={'M11.6695 20.6689C16.7316 20.6689 20.8352 16.5653 20.8352 11.5033C20.8352 6.44127 16.7316 2.33768 11.6695 2.33768C6.6075 2.33768 2.50391 6.44127 2.50391 11.5033C2.50391 16.5653 6.6075 20.6689 11.6695 20.6689Z'} stroke={'#3E3E3E'} strokeWidth={'1.83313'} strokeLinecap={'round'} strokeLinejoin={'round'} />
        <path d={'M11.6699 7.83705V11.5033'} stroke={'#3E3E3E'} strokeWidth={'1.83313'} strokeLinecap={'round'} strokeLinejoin={'round'} />
        <path d={'M11.6699 15.1696H11.6799'} stroke={'#3E3E3E'} strokeWidth={'1.83313'} strokeLinecap={'round'} strokeLinejoin={'round'} />
      </svg>
    </SvgIcon>
  )
}

export default AlertCircleIcon
