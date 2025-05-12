import { SvgIcon, type SvgIconProps } from '@mui/material'

const CalendarIcon = ({ ...props }: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg xmlns={'http://www.w3.org/2000/svg'} width={'24'} height={'24'} viewBox={'8 8 24 24'} fill={'none'}>
        <g filter={'url(#filter0_d_57141_1583)'}>
          <path fillRule={'evenodd'} clipRule={'evenodd'} d={'M18 12C18 11.4477 17.5523 11 17 11C16.4477 11 16 11.4477 16 12V13H15C13.3431 13 12 14.3431 12 16V25C12 26.6569 13.3431 28 15 28H25C26.6569 28 28 26.6569 28 25V16C28 14.3431 26.6569 13 25 13H24V12C24 11.4477 23.5523 11 23 11C22.4477 11 22 11.4477 22 12V13H18V12ZM22 16V15H18V16C18 16.5523 17.5523 17 17 17C16.4477 17 16 16.5523 16 16V15H15C14.4477 15 14 15.4477 14 16V25C14 25.5523 14.4477 26 15 26H25C25.5523 26 26 25.5523 26 25V16C26 15.4477 25.5523 15 25 15H24V16C24 16.5523 23.5523 17 23 17C22.4477 17 22 16.5523 22 16ZM17 19C16.4477 19 16 19.4477 16 20C16 20.5523 16.4477 21 17 21H23C23.5523 21 24 20.5523 24 20C24 19.4477 23.5523 19 23 19H17Z'} fill={'#3E3E3E'}/>
        </g>
        <defs>
          <filter id={'filter0_d_57141_1583'} x={'-4'} y={'-4'} width={'48'} height={'48'} filterUnits={'userSpaceOnUse'} colorInterpolationFilters={'sRGB'}>
            <feFlood floodOpacity={'0'} result={'BackgroundImageFix'}/>
            <feColorMatrix in={'SourceAlpha'} type={'matrix'} values={'0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'} result={'hardAlpha'}/>
            <feOffset/>
            <feGaussianBlur stdDeviation={'6'}/>
            <feComposite in2={'hardAlpha'} operator={'out'}/>
            <feColorMatrix type={'matrix'} values={'0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'}/>
            <feBlend mode={'overlay'} in2={'BackgroundImageFix'} result={'effect1_dropShadow_57141_1583'}/>
            <feBlend mode={'normal'} in={'SourceGraphic'} in2={'effect1_dropShadow_57141_1583'} result={'shape'}/>
          </filter>
        </defs>
      </svg>

    </SvgIcon>
  )
}

export default CalendarIcon
