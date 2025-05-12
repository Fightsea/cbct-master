import { SvgIcon, type SvgIconProps } from '@mui/material'

const TriangleIcon = ({ ...props }: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg xmlns={'http://www.w3.org/2000/svg'} width={'24'} height={'24'} viewBox={'0 0 24 24'} fill={'none'}>
        <path d={'M5.04801 14.898L10.5287 6.59684C11.331 5.38175 13.1213 5.40376 13.8934 6.63821L19.0857 14.9394C19.9188 16.2715 18.9612 18 17.39 18H6.71705C5.1237 18 4.17011 16.2277 5.04801 14.898Z'} stroke={'#3E3E3E'} strokeWidth={'2'}/>
      </svg>
    </SvgIcon>
  )
}

export default TriangleIcon
