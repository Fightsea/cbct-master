import { Chip, SvgIcon, SxProps } from '@mui/material'
import { TreatmentStatus } from '@cbct/enum/patient'

type PatientStatusChipProps = {
  sx?: SxProps
  status: TreatmentStatus
}

const PatientStatusChip = ({ sx, status }: PatientStatusChipProps) => {
  const style = (() => {
    switch (status) {
    case TreatmentStatus.IN_TREATMENT:
      return {
        border: '0.5px solid #6E7AB8',
        background: 'rgba(110, 122, 184, 0.20)',
        color: '#6E7AB8'
      }
    case TreatmentStatus.ACTION_REQUIRED:
      return {
        border: '0.5px solid #FFC700',
        background: 'rgba(255, 198, 0, 0.15)',
        color: '#ECB800'
      }
    case TreatmentStatus.ARCHIVED:
      return {
        border: '0.5px solid #656565',
        background: 'rgba(101, 101, 101, 0.20)',
        color: '#656565'
      }
    }
  })()

  const Icon = (() => {
    const sx = {
      width: 12,
      height: 12
    }

    switch (status) {
    case TreatmentStatus.IN_TREATMENT:
      return <SvgIcon sx={sx}>
        <svg xmlns={'http://www.w3.org/2000/svg'} width={'12'} height={'12'} viewBox={'0 0 12 12'} fill={'none'}>
          <path fillRule={'evenodd'} clipRule={'evenodd'} d={'M5.5 2C4.94772 2 4.5 2.44772 4.5 3V4.5H3C2.44772 4.5 2 4.94772 2 5.5V6.5C2 7.05228 2.44772 7.5 3 7.5H4.5V9C4.5 9.55228 4.94772 10 5.5 10H6.5C7.05228 10 7.5 9.55228 7.5 9V7.5H9C9.55228 7.5 10 7.05228 10 6.5V5.5C10 4.94772 9.55228 4.5 9 4.5H7.5V3C7.5 2.44772 7.05228 2 6.5 2H5.5Z'} fill={'#6E7AB8'}/>
        </svg>
      </SvgIcon>
    case TreatmentStatus.ACTION_REQUIRED:
      return <SvgIcon sx={sx}>
        <svg xmlns={'http://www.w3.org/2000/svg'} width={'12'} height={'12'} viewBox={'0 0 12 12'} fill={'none'}>
          <path d={'M5.152 2.8568C5.54367 2.23013 6.45633 2.23013 6.848 2.8568L10.0438 7.97C10.46 8.63605 9.98119 9.5 9.19575 9.5H2.80425C2.01881 9.5 1.53997 8.63605 1.95625 7.97L5.152 2.8568Z'} fill={'#ECB800'}/>
        </svg>
      </SvgIcon>
    case TreatmentStatus.ARCHIVED:
      return <SvgIcon sx={sx}>
        <svg xmlns={'http://www.w3.org/2000/svg'} width={'12'} height={'12'} viewBox={'0 0 12 12'} fill={'none'}>
          <path d={'M5.50974 1.77577C5.81415 1.60454 6.18585 1.60454 6.49026 1.77577L9.49026 3.46327C9.80514 3.64039 10 3.97357 10 4.33485V7.66515C10 8.02643 9.80514 8.35961 9.49026 8.53673L6.49026 10.2242C6.18585 10.3955 5.81415 10.3955 5.50974 10.2242L2.50974 8.53673C2.19486 8.35961 2 8.02643 2 7.66515V4.33485C2 3.97357 2.19486 3.64039 2.50974 3.46327L5.50974 1.77577Z'} fill={'#656565'}/>
        </svg>
      </SvgIcon>
    }
  })()

  const label = (() => {
    switch (status) {
    case TreatmentStatus.IN_TREATMENT:
      return 'In Treatment'
    case TreatmentStatus.ACTION_REQUIRED:
      return 'Action Required'
    case TreatmentStatus.ARCHIVED:
      return 'Archived'
    }
  })()

  return <Chip
    sx={{
      fontFamily: 'Roboto',
      fontSize: 10,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 'normal',
      textAlign: 'center',
      width: 'fit-content',
      height: 20,
      ...style,
      ...sx
    }}
    icon={Icon}
    label={label}
  />
}

export default PatientStatusChip
