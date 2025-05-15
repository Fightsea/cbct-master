import ImageUploadBox from '@/components/boxes/ImageUploadBox'
import { Box, Button, ButtonGroup, IconButton, Input, Menu, MenuItem, Typography, Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import FrontFace from '@/public/front-face.png'
import SideFace from '@/public/side-face.png'
import FrontFaceIcon from '@/components/icons/FrontFaceIcon'
import SideFaceIcon from '@/components/icons/SideFaceIcon'
import TrashIcon from '@/components/icons/TrashIcon'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { globalStore } from '@/stores/globalStore'
import { useStore } from 'zustand'
import PhotoUpload from '@/components/boxes/upload/PhotoUpload'
import UploadProgress from '@/components/progress/UploadProgress'
import ScrollBar from '@/components/scrollbars/ScrollBar'
import FormSearchInput from '@/components/forms/FormSearchInput'
import CalendarIcon from '@/components/icons/CalendarIcon'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'

export type DateImage = {
  date: string
  images: Image[]
}

export type Image = {
  id: uuid
  imageUrl: string
} & Record<string, any>

type Props = {
  images: DateImage[]
  frontImageId: Nullable<uuid>
  profileImageId: Nullable<uuid>
  setFrontImage: (id: uuid) => void
  setProfileImage: (id: uuid) => void
  deleteImage: (id: uuid) => void
  handleUploadFiles: (event: ChangeEvent<HTMLInputElement>) => void
  isUploading: boolean
  uploadProgress: number
  showViewToggle?: boolean
  showActions?: boolean
}

const PatientPhotoBox = ({
  images,
  frontImageId,
  profileImageId,
  setFrontImage,
  setProfileImage,
  deleteImage,
  handleUploadFiles,
  isUploading,
  uploadProgress,
  showViewToggle = false,
  showActions = false
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const { openDeleteDialog, openImagePreview } = useStore(globalStore)

  const handleMenuClose = () => {
    setAnchorEl(null)
    setOpenMenuId(null)
  }

  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid')

  const handleViewChange = (view: 'grid' | 'list') => {
    setActiveView(view)
  }

  return (
    <>
      <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', gap: 3, p: 1, background: '#F3F3F3', border: '1px solid #E5E5E5', borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant={'h4'}>Photos</Typography>
            <Typography sx={{ fontSize: 14, color: '#656565' }}>頭像與AI分析使用</Typography>
          </Box>
          {frontImageId ? (
            <Box sx={{
              position: 'relative',
              width: 180,
              height: 180,
              aspectRatio: '1 / 1'
            }}>
              <Image
                src={images.flatMap(imagesInDate => imagesInDate.images).find(img => img.id === frontImageId)?.imageUrl || ''}
                alt={frontImageId}
                fill
                style={{
                  borderRadius: 10,
                  border: '2px solid #9EA5C7',
                  objectFit: 'cover'
                }}
              />
            </Box>
          ) : (
            <ImageUploadBox sx={{ width: 180, height: 180 }}>
              <Box sx={{ width: '100%', height: '100%', border: '1px solid #C6CAE2', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Image src={FrontFace} alt={'upload'} width={100} height={100} />
                <Typography sx={{ fontFamily: 'Roboto', fontSize: 12, fontStyle: 'normal', fontWeight: 700, fontsize: 12, mt: 1 }}>Front View</Typography>
                <Typography sx={{ fontFamily: 'Roboto', fontSize: 12, fontStyle: 'normal', fontWeight: 400, fontsize: 12 }}>Select the photo</Typography>
              </Box>
            </ImageUploadBox>
          )}
          {profileImageId ? (
            <Box sx={{
              position: 'relative',
              width: 180,
              height: 180,
              aspectRatio: '1 / 1'
            }}>
              <Image
                src={images.flatMap(image => image.images).find(img => img.id === profileImageId)?.imageUrl || ''}
                alt={profileImageId}
                fill
                style={{
                  borderRadius: 10,
                  border: '2px solid #9EA5C7',
                  objectFit: 'cover'
                }}
              />
            </Box>
          ) : (
            <ImageUploadBox sx={{ width: 180, height: 180 }}>
              <Box sx={{ width: '100%', height: '100%', border: '1px solid #C6CAE2', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Image src={SideFace} alt={'upload'} width={100} height={100} />
                <Typography sx={{ fontFamily: 'Roboto', fontSize: 14, fontStyle: 'normal', fontWeight: 700, mt: 1 }}>Profile View</Typography>
                <Typography sx={{ fontFamily: 'Roboto', fontSize: 12, fontStyle: 'normal', fontWeight: 400 }}>Select the photo</Typography>
              </Box>
            </ImageUploadBox>
          )}
        </Box>

        <Box sx={{ flex: 1, position: 'relative' }}>
          <Box
            sx={{
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '-12px',
                width: 12,
                height: 32,
                transform: 'translateY(-50%)',
                backgroundColor: '#6E7AB8',
                clipPath: 'polygon(100% 0, 100% 100%, 0 50%)',
                zIndex: 1
              }
            }}
          ></Box>

          { !images[0]?.images.length ? (
            <PhotoUpload
              isUploading={isUploading}
              progress={uploadProgress}
              onUpload={handleUploadFiles}
            />
          ) : (
            isUploading ? (
              <UploadProgress progress={uploadProgress} />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  p: 1.5,
                  borderRadius: 2,
                  border: '1px solid #E5E5E5',
                  background: '#E5E5E5',
                  flex: 1,
                  height: '100%'
                }}
              >
                <Box
                  sx={{
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                  }}
                >
                  {
                    showViewToggle &&
                    <>
                      <ButtonGroup variant={'contained'} aria-label={'Basic button group'}>
                        <Button
                          onClick={() => handleViewChange('grid')}
                          sx={{
                            p: 1,
                            bgcolor: activeView === 'grid' ? '#6E7AB8' : '#FAFAFA',
                            color: activeView === 'grid' ? '#FFFFFF' : 'text.primary',
                            '&:hover': {
                              bgcolor: '#F0F0F0'
                            }
                          }}
                        >
                          <GridViewOutlinedIcon />
                        </Button>
                        <Button
                          onClick={() => handleViewChange('list')}
                          sx={{
                            p: 1,
                            bgcolor: activeView === 'list' ? '#6E7AB8' : '#FAFAFA',
                            color: activeView === 'list' ? '#FFFFFF' : 'text.primary',
                            '&:hover': {
                              bgcolor: '#F0F0F0'
                            }
                          }}
                        >
                          <FormatListBulletedRoundedIcon />
                        </Button>
                      </ButtonGroup>
                      <Box sx={{ width: '1px', height: '100%', backgroundColor: '#A1A1A1' }}></Box>
                    </>
                  }
                  {
                    showActions &&
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <IconButton sx={{ border: '0.5px solid #E9EBF4', borderRadius: '8px', backgroundColor: '#FAFAFA', '&:hover': { backgroundColor: '#E9EBF4', borderColor: '#C6CAE2' } }}>
                        <CalendarIcon />
                      </IconButton>
                      <FormSearchInput
                        value={''}
                        onChange={() => {}}
                      />
                    </Box>
                  }
                  <Button variant={'primary'} component={'label'} sx={{ ml: 'auto', textWrap: 'nowrap' }}>
                    Select More Photos
                    <Input
                      className={'visually-hidden'}
                      type={'file'}
                      inputProps={{
                        multiple: true,
                        accept: '.jpg,.jpeg,.png'
                      }}
                      onChange={handleUploadFiles}
                    />
                  </Button>
                </Box>

                <Box sx={{ overflow: 'hidden', height: '100%', marginLeft: '-12px' }}>
                  <ScrollBar height={'100%'}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                      {images.map((imagesInDate) => (
                        <Accordion
                          key={imagesInDate.date}
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
                            <Typography>{imagesInDate.date}</Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                            gap: 1
                          }}>
                            {imagesInDate.images.map((image, index) => (
                              <Box
                                key={image.id}
                                sx={{
                                  position: 'relative',
                                  paddingTop: '100%',
                                  cursor: 'pointer'
                                }}
                                onClick={() => openImagePreview(imagesInDate.images.map(img => img.imageUrl), index)}
                              >
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
                                    className={'image'}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openDeleteDialog(() => deleteImage(image.id))
                                    }}
                                  >
                                    <TrashIcon />
                                  </IconButton>
                                </Box>
                                <Box sx={{
                                  position: 'absolute',
                                  bottom: 0,
                                  right: 0
                                }}>
                                  <IconButton
                                    className={'image'}
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      setAnchorEl(event.currentTarget)
                                      setOpenMenuId(image.id)
                                    }}
                                  >
                                    <FrontFaceIcon sx={{ ...((frontImageId === image.id || profileImageId === image.id) && { '& path': { fill: '#6E7AB8' } }) }} />
                                  </IconButton>
                                  <Menu
                                    id={`menu-${image.id}`}
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={openMenuId === image.id}
                                    onClose={handleMenuClose}
                                  >
                                    <MenuItem
                                      selected={frontImageId === image.id}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setFrontImage(image.id)
                                        handleMenuClose()
                                      }}
                                    >
                                      <FrontFaceIcon sx={{ mr: 1 }} />
                                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Set Front View</Typography>
                                    </MenuItem>
                                    <MenuItem
                                      selected={profileImageId === image.id}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setProfileImage(image.id)
                                        handleMenuClose()
                                      }}
                                    >
                                      <SideFaceIcon sx={{ mr: 1 }} />
                                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Set Side View</Typography>
                                    </MenuItem>
                                  </Menu>
                                </Box>
                              </Box>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  </ScrollBar>
                </Box>
              </Box>
            )
          )}
        </Box>
      </Box>
    </>
  )
}

export default PatientPhotoBox
