import { Box } from '@mui/material'
import { DiagnosisAnalysisType } from '@cbct/enum/diagnosisAnalysis'

type Props = {
  diagnosis: DiagnosisAnalysisType
}

const DiagnosisChip = ({ diagnosis }: Props) => {
  return (
    <Box sx={{
      width: 'fit-content',
      px: 1,
      borderRadius: 1,
      backgroundColor: diagnosis === DiagnosisAnalysisType.DIAGNOSIS ? '#6E7AB8' : '#3E3E3E',
      fontSize: 14,
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#fff'
    }}>
      {diagnosis === DiagnosisAnalysisType.DIAGNOSIS ? '醫師診斷' : 'AI分析'}
    </Box>
  )
}

export default DiagnosisChip
