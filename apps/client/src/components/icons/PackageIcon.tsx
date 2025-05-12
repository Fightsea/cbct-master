import { SvgIcon, type SvgIconProps } from '@mui/material'

const PackageIcon = ({ ...props }: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg xmlns={'http://www.w3.org/2000/svg'} width={'24'} height={'24'} viewBox={'0 0 24 24'} fill={'none'}>
        <path d={'M16 10L9 6'} stroke={'#3E3E3E'} strokeWidth={'2'} strokeLinejoin={'round'}/>
        <path d={'M19 15.2007V8.79934C18.9997 8.51871 18.9277 8.24308 18.7912 8.00011C18.6547 7.75714 18.4585 7.55538 18.2222 7.41506L12.7778 4.2144C12.5413 4.07395 12.2731 4 12 4C11.7269 4 11.4587 4.07395 11.2222 4.2144L5.77778 7.41506C5.54154 7.55538 5.34532 7.75714 5.2088 8.00011C5.07229 8.24308 5.00028 8.51871 5 8.79934V15.2007C5.00028 15.4813 5.07229 15.7569 5.2088 15.9999C5.34532 16.2429 5.54154 16.4446 5.77778 16.5849L11.2222 19.7856C11.4587 19.9261 11.7269 20 12 20C12.2731 20 12.5413 19.9261 12.7778 19.7856L18.2222 16.5849C18.4585 16.4446 18.6547 16.2429 18.7912 15.9999C18.9277 15.7569 18.9997 15.4813 19 15.2007Z'} stroke={'#3E3E3E'} strokeWidth={'2'} strokeLinecap={'round'} strokeLinejoin={'round'}/>
        <path d={'M5 8L12 12L19 8'} stroke={'#3E3E3E'} strokeWidth={'2'} strokeLinejoin={'round'}/>
        <path d={'M12 20V12'} stroke={'#3E3E3E'} strokeWidth={'2'} strokeLinecap={'round'} strokeLinejoin={'round'}/>
      </svg>
    </SvgIcon>
  )
}

export default PackageIcon
