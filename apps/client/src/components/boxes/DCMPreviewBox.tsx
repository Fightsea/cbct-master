import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import TrashIcon from '@/components/icons/TrashIcon'
import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import BlackBorderCheckbox from '@/components/checkboxes/BlackBorderCheckbox'
import { useStore } from 'zustand'
import { globalStore } from '@/stores/globalStore'
import ScrollBar from '@/components/scrollbars/ScrollBar'
import { convertToProxyUrl } from '@/utils/proxy'

const DicomViewer = dynamic(() => import('@/components/images/DCMViewer'), { ssr: false })

export type ImageType = {
  id: string
  url: string
  name: string
}

export type ViewType = {
  id: string
  url: string
}

export type DateImages = {
  date: string
  images: ImageType[]
  views: ViewType[]
  id: string
}


type Props = {
  images: DateImages[]
  deleteImage: (id: uuid) => void
  toolbar?: ReactNode
  needSelect?: boolean
  onSelect?: (id: uuid) => void
  selectedId?: uuid
  viewType: 'grid' | 'list'
}

const DCMPreviewBox = ({
  images,
  deleteImage,
  toolbar,
  needSelect,
  onSelect,
  selectedId,
  viewType
}: Props) => {
  const { openDeleteDialog, openDcmPreview } = useStore(globalStore)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '8px 12px', bgcolor: '#E5E5E5', borderRadius: '8px' }}>
      <Box sx={{ width: '100%', mb: 1 }}>
        {toolbar}
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', marginLeft: '-12px' }}>
        <ScrollBar height={'100%'} width={'100%'}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {images.map((imagesInRecord) => (imagesInRecord.images.length || (viewType === 'grid' && imagesInRecord.views.length)) ? (
              <Accordion
                key={imagesInRecord.id}
                sx={{
                  background: '#FAFAFA',
                  boxShadow: 'none',
                  margin: '0 !important',
                  '&::before': {
                    display: 'none'
                  },
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                    '&.Mui-expanded': {
                      margin: '0 !important'
                    }
                  },
                  '& .Mui-expanded': {
                    margin: 0
                  },
                  '& .MuiAccordionSummary-root': {
                    minHeight: '48px',
                    margin: 0,
                    '&.Mui-expanded': {
                      minHeight: '48px'
                    }
                  },
                  '& .MuiIconButton-root': {
                    height: '24px',
                    width: '24px'
                  }
                }}
                defaultExpanded
              >
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    {needSelect && (
                      <BlackBorderCheckbox
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelect?.(imagesInRecord.id)
                        }}
                        checked={selectedId === imagesInRecord.id}
                      />
                    )}
                    <Typography sx={{ height: '100%' }}>{imagesInRecord.date}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    display: viewType === 'grid' ? 'grid' : 'flex',
                    gridTemplateColumns: viewType === 'grid' ? 'repeat(auto-fill, minmax(160px, 1fr))' : 'none',
                    flexDirection: viewType === 'list' ? 'column' : 'row',
                    gap: 1
                  }}
                >
                  {viewType === 'grid' && imagesInRecord.views.length > 0 ? (
                    imagesInRecord.views.map((view, index) => (
                      <Box
                        key={view.id}
                        sx={{
                          position: 'relative',
                          paddingTop: '100%',
                          cursor: 'pointer'
                        }}
                        onClick={() => openDcmPreview(imagesInRecord.views.map(v => convertToProxyUrl(v.url)), index)}
                      >
                        <DicomViewer
                          dicomUrl={convertToProxyUrl(view.url)}
                          sx={{
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            '& canvas': {
                              width: '100%',
                              height: '100%'
                            }
                          }}
                        />
                      </Box>
                    ))
                  ) : (
                    imagesInRecord.images.map((image, index) => (
                      <Box
                        key={image.id}
                        sx={{
                          position: 'relative',
                          paddingTop: viewType === 'grid' ? '100%' : 'auto',
                          cursor: 'pointer',
                          ...(viewType === 'list' && {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px',
                            border: '1px solid #E5E5E5',
                            borderRadius: '8px',
                            backgroundColor: '#FFFFFF'
                          })
                        }}
                        onClick={() => openDcmPreview(imagesInRecord.images.map(img => img.url), index)}
                      >
                        {viewType === 'grid' ? (
                          <>
                            <DicomViewer
                              dicomUrl={image.url}
                              sx={{
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                '& canvas': {
                                  width: '100%',
                                  height: '100%'
                                }
                              }}
                            />
                            <Box sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0
                            }}>
                              <IconButton
                                className={'image'}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDeleteDialog(() => deleteImage(image.id))
                                }}
                              >
                                <TrashIcon />
                              </IconButton>
                            </Box>
                          </>
                        ) : (
                          <>
                            <Box sx={{
                              width: '64px',
                              height: '64px',
                              position: 'relative',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              flexShrink: 0,
                              mr: 2
                            }}>
                              <DicomViewer
                                dicomUrl={image.url}
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  '& canvas': {
                                    width: '100%',
                                    height: '100%'
                                  }
                                }}
                              />
                            </Box>

                            <Box sx={{ flex: 1 }}>
                              <Typography variant={'body2'} sx={{ fontWeight: 500 }}>
                                {image.name}
                              </Typography>
                            </Box>

                            <Box>
                              <IconButton
                                size={'small'}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDeleteDialog(() => deleteImage(image.id))
                                }}
                              >
                                <TrashIcon />
                              </IconButton>
                            </Box>
                          </>
                        )}
                      </Box>
                    ))
                  )}
                </AccordionDetails>
              </Accordion>
            ): null)}
          </Box>
        </ScrollBar>
      </Box>
    </Box>
  )
}

export default DCMPreviewBox
