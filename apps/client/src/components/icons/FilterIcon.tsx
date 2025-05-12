import { SvgIcon, type SvgIconProps } from '@mui/material'

const FilterIcon = ({ ...props }: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg width={'23'} height={'24'} viewBox={'8 8 23 24'} fill={'none'} xmlns={'http://www.w3.org/2000/svg'}>
        <g filter={'url(#filter0_d_57141_1591)'}>
          <path d={'M14.4432 13H24.5568C25.3702 13 25.8433 13.9194 25.3705 14.5812L21.6863 19.7392C21.5651 19.9088 21.5 20.112 21.5 20.3205V25.9458C21.5 26.2905 21.3224 26.611 21.03 26.7937L19.03 28.0438C18.364 28.46 17.5 27.9812 17.5 27.1958V20.3205C17.5 20.112 17.4349 19.9088 17.3137 19.7392L13.6295 14.5812C13.1567 13.9194 13.6298 13 14.4432 13Z'} stroke={'#3E3E3E'} strokeWidth={'2'}/>
        </g>
        <defs>
          <filter id={'filter0_d_57141_1591'} x={'-4.5'} y={'-4'} width={'48'} height={'48'} filterUnits={'userSpaceOnUse'} colorInterpolationFilters={'sRGB'}>
            <feFlood floodOpacity={'0'} result={'BackgroundImageFix'}/>
            <feColorMatrix in={'SourceAlpha'} type={'matrix'} values={'0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'} result={'hardAlpha'}/>
            <feOffset/>
            <feGaussianBlur stdDeviation={'6'}/>
            <feComposite in2={'hardAlpha'} operator={'out'}/>
            <feColorMatrix type={'matrix'} values={'0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'}/>
            <feBlend mode={'overlay'} in2={'BackgroundImageFix'} result={'effect1_dropShadow_57141_1591'}/>
            <feBlend mode={'normal'} in={'SourceGraphic'} in2={'effect1_dropShadow_57141_1591'} result={'shape'}/>
          </filter>
        </defs>
      </svg>
    </SvgIcon>
  )
}

export default FilterIcon
