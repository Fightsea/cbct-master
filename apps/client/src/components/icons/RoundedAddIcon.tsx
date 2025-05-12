import { SvgIcon, type SvgIconProps } from '@mui/material'

const RoundedAddIcon = ({ ...props }: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg width={'16'} height={'16'} viewBox={'0 0 16 16'} fill={'none'} xmlns={'http://www.w3.org/2000/svg'}>
        <path fillRule={'evenodd'} clipRule={'evenodd'} d={'M7.33366 2.66797C6.59728 2.66797 6.00033 3.26492 6.00033 4.0013V6.0013H4.00033C3.26395 6.0013 2.66699 6.59826 2.66699 7.33464V8.66797C2.66699 9.40435 3.26395 10.0013 4.00033 10.0013H6.00033V12.0013C6.00033 12.7377 6.59728 13.3346 7.33366 13.3346H8.66699C9.40337 13.3346 10.0003 12.7377 10.0003 12.0013V10.0013H12.0003C12.7367 10.0013 13.3337 9.40435 13.3337 8.66797V7.33464C13.3337 6.59826 12.7367 6.0013 12.0003 6.0013H10.0003V4.0013C10.0003 3.26492 9.40337 2.66797 8.66699 2.66797H7.33366Z'} fill={'white'}/>
      </svg>
    </SvgIcon>
  )
}

export default RoundedAddIcon
