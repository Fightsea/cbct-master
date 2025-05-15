import { Box, Typography, Button, AvatarGroup } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useStore } from 'zustand'
import { patientPageStore } from '@/stores/patientPageStore'
import patientApi from '@/apis/patientApi'
import cbctAiOutputApi from '@/apis/cbctAiOutputApi'
import useSWR from 'swr'
import { useMemo, useRef, useState } from 'react'
import CreateDiagnosisDialog from '../CreateDiagnosisDialog'
import AiAnalysisDialog from '@/containers/dialogs/AiAnalysisDialog.tsx'
import DiagnosisChip from '@/components/chips/DiagnosisChip'
import { DiagnosisAnalysisType } from '@cbct/enum/diagnosisAnalysis'
import TagChip from '@/components/chips/TagChip'
import ExpandableText from '@/components/typography/ExpandableText'
import Image from 'next/image'
import UploadPatient from '@/public/upload-patient.png'
import ScrollBar, { ScrollBarHandle } from '@/components/scrollbars/ScrollBar'
import FormSearchInput from '@/components/forms/FormSearchInput'
import FilterIcon from '@/components/icons/FilterIcon'
import dynamic from 'next/dynamic'
import { convertToProxyUrl } from '@/utils/proxy'

const DicomViewer = dynamic(() => import('@/components/images/DCMViewer'), { ssr: false })

const History = () => {
  const scrollBarRef = useRef<ScrollBarHandle>(null)
  const { patientId, openCreateDiagnosisDialog, openAiAnalysisDialog } = useStore(patientPageStore)

  const [searchValue, setSearchValue] = useState<string>('')
  const [searchSubmit, setSearchSubmit] = useState<string>('')

  const { data: histories, mutate } = useSWR(
    patientId ? `/patients/${patientId}/history/?search=${searchSubmit}` : null,
    async () => await patientApi.getHistory(patientId ?? '', {search : searchSubmit})
  )

  const { data: historyImages } = useSWR(
    histories && histories.length > 0 && histories.some(history => history.type === 'ANALYSIS')
      ? ['/cbct/ai-outputs/images', histories]
      : null,
    async () => {
      if (!histories) return []

      const imagePromises = histories
        .filter(history => history.type === 'ANALYSIS')
        .map(history => cbctAiOutputApi.getImages(history.id))

      return await Promise.all(imagePromises)
    }
  )

  const historyRecords = useMemo(() => {
    if (!histories) return []

    return histories.map(history => {
      if (history.type !== 'ANALYSIS') {
        return {
          ...history,
          images: [],
          imagesCount: 0
        }
      }

      const analysisIndex = histories
        .filter(h => h.type === 'ANALYSIS')
        .findIndex(h => h.id === history.id)

      return {
        ...history,
        images: historyImages?.[analysisIndex]?.urls || [],
        imagesCount: historyImages?.[analysisIndex]?.count || 0
      }
    })
  }, [histories, historyImages])

  const handlerUpdate = () => {
    setTimeout(() => {
      if (scrollBarRef.current) {
        scrollBarRef.current.recalculate()
      }
    }, 1000)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '100%' }}>
      <Box sx={{ width: '100%', height: 'fit-content', display: 'flex', gap: 1 }}>
        <Button
          variant={'primary'}
          startIcon={<AddIcon />}
          onClick={() => openCreateDiagnosisDialog()}
        >
          醫師診斷
        </Button>
        <Button
          variant={'primary'}
          startIcon={<AddIcon />}
          onClick={() => openAiAnalysisDialog(patientId ?? '')}
        >
          AI分析
        </Button>
        <Button
          variant={'secondary'}
          startIcon={<FilterIcon sx={{ '& path:not(mask path)': { fill: 'none !important' } }} />}
          onClick={() => {}}
          sx={{ ml: 'auto', fontWeight: 600 }}
        >
          Filter
        </Button>
        <FormSearchInput
          value={searchValue}
          onChange={value => setSearchValue(value)}
          onSubmit={() => setSearchSubmit(searchValue)}
        />
      </Box>
      <Box sx={{ overflow: 'hidden', height: '100%', flex: 1, marginLeft: '-12px' }}>
        <ScrollBar ref={scrollBarRef} height={'100%'} width={'100%'} fullHeight>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, height: '100%' }}>
            { historyRecords && historyRecords.length > 0 ? (historyRecords.map(history => (
              <Box
                key={history.id}
                sx={{
                  p: 1.5,
                  backgroundColor: history.type === DiagnosisAnalysisType.DIAGNOSIS ? '#FFFFFF' : '#E9EBF4',
                  borderRadius: 2,
                  border: `1px solid ${history.type === DiagnosisAnalysisType.DIAGNOSIS ? '#E5E5E5' : '#C6CAE2'}`
                }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <DiagnosisChip diagnosis={history.type} />
                  <Typography sx={{
                    ml: 1.25,
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: 400
                  }}>
                    {history.subject} {history.type === DiagnosisAnalysisType.DIAGNOSIS && ' 醫師'}
                  </Typography>
                  <Typography sx={{
                    ml: 'auto',
                    fontSize: 12,
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 400
                  }}>
                    {history.date}
                  </Typography>
                </Box>
                <Box sx={{ marginTop: 1.5, display: 'flex', alignItems: 'start', gap: 1.5}}>
                  <ExpandableText text={history.description} onClick={handlerUpdate} />
                  {
                    history.images && history.images.length > 0 && (
                      <AvatarGroup
                        total={history.imagesCount}
                        max={4}
                        variant={'rounded'}
                        sx={{ marginLeft: 'auto', width: '100%', maxWidth: '280px', gap: 2, '& .MuiAvatar-root': { border: 'none', width: '64px', height: '64px' } }}
                        renderSurplus={(remainingCBCTCount) => {
                          const imageUrl = history.images[3]
                          const isDicom = /\.dcm$/i.test(imageUrl)

                          return (
                            <Typography sx={{ position: 'relative' }}>
                              {
                                isDicom
                                  ? <DicomViewer dicomUrl={convertToProxyUrl(imageUrl)} />
                                  : <Image src={imageUrl} alt={'image'} width={64} height={64} style={{ objectFit: 'cover' }} />
                              }
                              <Typography sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '100%',
                                height: '100%',
                                display: remainingCBCTCount === 1 ? 'none': 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                fontFamily: 'Roboto',
                                fontWeight: 700
                              }}>{`+${remainingCBCTCount < 99 ? remainingCBCTCount : 99}`}</Typography>
                            </Typography>
                          )
                        }}
                      >
                        {
                          history.images.map((imageUrl, index) => {
                            const isDicom = /\.dcm$/i.test(imageUrl)

                            return isDicom
                              ? (
                                <DicomViewer
                                  key={index}
                                  dicomUrl={convertToProxyUrl(imageUrl)}
                                  sx={{ width: '64px', height: '64px', borderRadius: '4px' }}
                                />
                              ) : (
                                <Image
                                  key={index}
                                  src={imageUrl}
                                  alt={'image'}
                                  width={64}
                                  height={64}
                                  style={{ borderRadius: '4px', objectFit: 'cover' }}
                                />
                              )
                          })
                        }
                      </AvatarGroup>
                    )
                  }
                </Box>
                <Box sx={{
                  display: history.tags.length > 0 ? 'flex' : 'none',
                  flexWrap: 'wrap',
                  gap: 1,
                  pt: 1
                }}>
                  {history.tags.map((tag, index) => (
                    <TagChip key={index} label={tag.name} color={tag.color} />
                  ))}
                </Box>
              </Box>
            ))) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Image src={UploadPatient} alt={'upload'} width={240} height={240} />
                  <Typography sx={{ fontSize: 16, fontStyle: 'normal', fontWeight: 600 }}>開始記錄「+醫生診斷」或「AI分析」</Typography>
                </Box>
              </Box>
            )}
          </Box>
        </ScrollBar>
      </Box>

      <CreateDiagnosisDialog mutateHistory={mutate} />
      <AiAnalysisDialog mutateHistory={mutate} />
    </Box>
  )
}

export default History
