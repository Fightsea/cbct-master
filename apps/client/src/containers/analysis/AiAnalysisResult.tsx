import { useEffect, useState, useContext } from 'react'
import { GetAiOutputResponse } from '@cbct/api/response/cbctRecord'
import { Box, CircularProgress, Typography } from '@mui/material'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import ScrollBar from '@/components/scrollbars/ScrollBar'
import RoundedAddIcon from '@/components/icons/RoundedAddIcon'
import Image from 'next/image'
import Muscular from '@/public/muscular.png'
import { CbctAiModel, CbctAiOutputStatus } from '@cbct/enum/cbct'
import cbctAiOutputApi from '@/apis/cbctAiOutputApi'
import dynamic from 'next/dynamic'
import { SnackbarContext } from '@/contexts/SnackbarContext'

const VolumeViewer = dynamic(
  () => import('@/components/viewers/VolumeViewer'),
  { ssr: false }
)

type AiStatus = 'IDLE' | 'INFERING' | 'COMPLETED' | 'FAILED'

type Data = GetAiOutputResponse

type FormattedSection = {
  text: string;
  isBold?: boolean;
}

const AiAnalysisResult = ({ recordId, mutateHistory }: { recordId: string, mutateHistory: () => void }) => {
  const [analysisData, setAnalysisData] = useState<Data>({
    id: '',
    date: '',
    model: CbctAiModel.CBCT_OSA_RISK,
    status: CbctAiOutputStatus.INFERING,
    risk: null,
    phenotype: null,
    phenotypeImageUrl: null,
    prescription: null,
    treatmentDescription: null,
    treatmentImageUrl: null,
    fileUrl: null
  })
  const [aiAnalysisState, setAiAnalysisState] = useState<AiStatus | null>(null)
  const [pollCount, setPollCount] = useState(0)
  const POLL_INTERVAL = 10000
  const MAX_POLL_COUNT = 90
  const { openSnackbar } = useContext(SnackbarContext)

  useEffect(() => {
    fetchAiOutput()

    return () => {
      setAiAnalysisState(null)
      setPollCount(0)
    }
  }, [])


  const fetchAiOutput = async () => {
    const response = await cbctAiOutputApi.getAiOutput(recordId || '')

    setAnalysisData(response)
    setAiAnalysisState(response?.status as AiStatus  || 'IDLE')
    setPollCount(prev => prev + 1)
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const poll = () => {
      if (aiAnalysisState === 'COMPLETED') {
        mutateHistory()
        openSnackbar({
          severity: 'success',
          message: 'Analysis completed successfully'
        })
      } else if (aiAnalysisState === 'FAILED' || pollCount >= MAX_POLL_COUNT) {
        setAiAnalysisState('FAILED')
        openSnackbar({
          severity: 'error',
          message: pollCount >= MAX_POLL_COUNT
            ? 'Analysis timeout. Please try again.'
            : 'Analysis failed. Please try again.'
        })
      } else {
        timeoutId = setTimeout(() => {
          fetchAiOutput()
        }, POLL_INTERVAL)
      }
    }
    poll()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [aiAnalysisState, pollCount])

  const formatText = (text: string | null): FormattedSection[] => {
    if (!text) return []

    const cleanedText = text
      .replace(/\n\n+/g, '<DOUBLE_BREAK>')
      .replace(/^\n\s+/, '')
      .replace(/\n\s+/g, '\n')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+$/gm, '')
      .replace(/<DOUBLE_BREAK>/g, '\n\n')
      .trim()

    const sections = cleanedText
      .split('\n')
      .map(line => {
        return {
          text: `${line.trim()}\n`,
          isBold: /^\d+\./.test(line.trim())
        }
      })
    return sections
  }

  const defaultDisplay = {
    image: Muscular.src,
    title: 'Therapeutic Interventions',
    description: 'Encourage weight reduction if the patient\'s BMI is greater than 26.'
  }

  return (
    <>
      { aiAnalysisState !== 'COMPLETED' ? (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            { aiAnalysisState === 'FAILED' ? (
              <>
                <Typography color={'#3E3E3E'} sx={{ fontSize: 18, fontWeight: 600 }}>
                  <Typography component={'span'} color={'error'} sx={{ fontSize: 18, fontWeight: 600 }}>{ pollCount >= MAX_POLL_COUNT ? '分析逾時' : '分析失敗'}</Typography>，請重新上傳
                </Typography>
              </>
            ) : (
              <>
                <Typography align={'center'} color={'#3E3E3E'} sx={{ fontSize: 18, fontWeight: 600 }}>Phenotype 正在分析中</Typography>
                <CircularProgress />
                <Typography color={'#707070'}>請不要關閉視窗</Typography>
              </>
            )}
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', height: '100%' }}>
            <Typography variant={'h3'} sx={{ fontWeight: 'bold' }} align={'center'}>
              Upper Airway CBCT Analysis
            </Typography>
            <Box sx={{
              display: 'flex',
              gap: 1.5,
              flex: 1,
              minHeight: 0
            }}>
              <Box sx={{
                width: '240px',
                flexShrink: 0,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #C6CAE2',
                borderRadius: '8px'
              }}>
                <Box sx={{
                  position: 'relative',
                  width: '100%',
                  height: '200px',
                  borderTopLeftRadius: '7px',
                  borderTopRightRadius: '7px',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={analysisData?.treatmentImageUrl || defaultDisplay.image}
                    alt={'cbct-osa'}
                    fill
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: '#FFC800', bgcolor: '#2E3248', p: '9.5px 16px', borderBottomRightRadius: '8px' }}>
                    <StarRoundedIcon/>
                    <Typography>Recommendations</Typography>
                  </Box>
                </Box>
                <Box sx={{
                  py: 2.5,
                  px: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  gap: 1
                }}>
                  <Typography sx={{ fontSize: 14 }} align={'center'}>
                    {analysisData?.treatmentDescription || defaultDisplay.description}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                minHeight: 0
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  {
                    analysisData?.phenotypeImageUrl
                      ? <Image src={analysisData?.phenotypeImageUrl} alt={'cbct-osa'} width={234} height={200} style={{ width: '100%', height: '100%' }} />
                      : <VolumeViewer width={'234px'} height={'200px'} fileUrl={analysisData?.fileUrl} />
                  }
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #C6CAE2', borderRadius: '8px' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, bgcolor: '#6E7AB8', p: '9.5px 24px', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <RoundedAddIcon /> Phenotype
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#FF7700', textAlign: 'center', flex: 1 }}>
                    {analysisData?.phenotype}
                  </Typography>
                </Box>

                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  border: '0.5px solid #C6CAE2',
                  borderRadius: '8px',
                  flex: 1,
                  minHeight: 0,
                  overflow: 'hidden'
                }}>
                  <Typography sx={{
                    fontWeight: 700,
                    color: '#333333',
                    p: '8px 12px 4px 12px',
                    borderBottom: '1px solid transparent',
                    backgroundImage: 'linear-gradient(to right, transparent, #6E7AB8, transparent)',
                    backgroundPosition: 'bottom',
                    backgroundSize: '100% 1px',
                    backgroundRepeat: 'no-repeat'
                  }}>
                            Result
                  </Typography>
                  <Box sx={{
                    flex: 1,
                    p: 1.5,
                    minHeight: 0,
                    marginLeft: '-12px'
                  }}>
                    <ScrollBar>
                      {formatText(analysisData?.prescription || null).map((section, index) => (
                        <Typography
                          key={index}
                          component={'span'}
                          sx={{
                            fontSize: 14,
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'inherit',
                            ...(section.isBold && {
                              fontWeight: 700
                            })
                          }}
                        >
                          {section.text}
                        </Typography>
                      ))}
                    </ScrollBar>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}

export default AiAnalysisResult
