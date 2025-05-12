import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import TrashIcon from '@/components/icons/TrashIcon'
import { ReactNode } from 'react'
import Image from 'next/image'
import { globalStore } from '@/stores/globalStore'
import { useStore } from 'zustand'
import ScrollBar from '@/components/scrollbars/ScrollBar'

export type DateImages = {
  date: string
  images: ImageType[]
}

export type ImageType = {
  id: string
  imageUrl: string
} & Record<string, any>

type Props = {
  images: DateImages[]
  deleteImage: (id: string) => void
  toolbar?: ReactNode,
  viewType: 'grid' | 'list'
}

const ImagePreviewBox = ({ images, deleteImage, toolbar, viewType }: Props) => {
  const { openDeleteDialog, openImagePreview } = useStore(globalStore)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '8px 12px', bgcolor: '#E5E5E5', borderRadius: '8px' }}>
      <Box sx={{ width: '100%', mb: 1 }}>
        {toolbar}
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', marginLeft: '-12px' }}>
        <ScrollBar height={'100%'} width={'100%'}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {images.map((imagesInRecord, index) => imagesInRecord.images.length ? (
              <Accordion
                key={index}
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
                  <Typography>{imagesInRecord.date}</Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    display: viewType === 'grid' ? 'grid' : 'flex',
                    gridTemplateColumns: viewType === 'grid' ? 'repeat(auto-fill, minmax(160px, 1fr))' : 'none',
                    flexDirection: viewType === 'list' ? 'column' : 'row',
                    gap: 1
                  }}
                >
                  {imagesInRecord.images.map((image, index) => (
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
                      onClick={() => openImagePreview(imagesInRecord.images.map(img => img.imageUrl), index)}
                    >
                      { viewType === 'grid' ? (
                        <>
                          <Image
                            src={image.imageUrl}
                            alt={image.imageUrl}
                            fill
                            style={{
                              borderRadius: '8px',
                              objectFit: 'cover',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%'
                            }}
                          />
                          <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0
                          }}>
                            <IconButton
                              className={'image'} onClick={(e) => {
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
                            <Image
                              src={image.imageUrl}
                              alt={image.imageUrl}
                              fill
                              style={{
                                borderRadius: '8px',
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%'
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
                              className={'image'} onClick={(e) => {
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
                  ))}
                </AccordionDetails>
              </Accordion>
            ): null)}
          </Box>
        </ScrollBar>
      </Box>
    </Box>
  )
}

export default ImagePreviewBox
