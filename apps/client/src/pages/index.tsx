import AlertCircleIcon from '@/components/icons/AlertCircleIcon'
import BellIcon from '@/components/icons/BellIcon'
import SearchIcon from '@/components/icons/SearchIcon'
import SettingIcon from '@/components/icons/SettingIcon'
import { Avatar, AvatarGroup, Box, Button, Grid2, IconButton, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import clinicImage from '@/public/clinic.png'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import clinicApi from '@/apis/clinicApi'
import useSWR from 'swr'
import { useStore } from 'zustand'
import { authStore } from '@/stores/authStore'
import router from 'next/router'
import { clinicPageStore } from '@/stores/clinicPageStore'
import CreateClinicDialog from '@/containers/dialogs/CreateClinicDialog'
import user1 from '@/public/User-1.jpg'
import ScrollBar from '@/components/scrollbars/ScrollBar'

type ClinicProps = {
  id: string
  name: string
  address: string
  userCount: number
  maxDisplayUser: number
}

const ClinicListItem = ({ id, name, address, userCount, maxDisplayUser }: ClinicProps) => {
  const { setClinicId } = useStore(authStore)
  const { data: clinicPhotoUrl } = useSWR(
    `clinic-photo-${id}`,
    async () => await clinicApi.getPhoto(id)
  )

  return (
    <Stack
      sx={{
        borderRadius: '8px',
        background: '#fff',
        p: 1,
        position: 'relative',
        ':hover': {
          cursor: 'pointer',
          transform: 'scale(1.09)',
          transitionDuration: '0.3s',
          transitionTimingFunction: 'ease-out'
        },
        ':not(:hover)': {
          transform: 'scale(1)',
          transitionDuration: '0.3s',
          transitionTimingFunction: 'ease-out'
        }
      }}
      onClick={() => {
        setClinicId(id)
        router.push('/patient')
      }}
    >
      <Box sx={{ position: 'relative', height: 144, width: '100%' }}>
        <Box
          component={Image}
          src={clinicPhotoUrl ?? clinicImage}
          alt={'clinic'}
          fill
          sx={{ objectFit: 'cover' }}
        />

        <IconButton
          sx={{
            position: 'absolute',
            right: 10,
            bottom: 10,
            backdropFilter: 'blur(60px)',
            width: 28,
            height: 28,
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            transition: '0.3s ease-out',
            '&:hover': {
              right: 8,
              bottom: 8,
              width: 32,
              height: 32,
              bgcolor: 'rgba(255, 255, 255, 0.8)'
            }
          }}
        >
          <AlertCircleIcon />
        </IconButton>
      </Box>

      <Stack>
        <Box sx={{ fontSize: 20, fontWeight: 600, lineHeight: 1.5, height: 40, display: 'flex', alignItems: 'end' }}>{name}</Box>
        <Box sx={{ fontSize: 12, lineHeight: 1.5, height: 20, display: 'flex', alignItems: 'end' }}>{address}</Box>
        <AvatarGroup
          max={maxDisplayUser}
          total={userCount}
          renderSurplus={(remainingUserCount) => {
            return (
              <Typography sx={{ position: 'relative' }}>
                <Image src={user1.src} width={40} height={40} alt={'user'} />
                <Typography sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
                  display: remainingUserCount === 1 ? 'none': 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  fontSize: '14px',
                  fontFamily: 'Roboto'
                }}>{`+${remainingUserCount < 99 ? remainingUserCount : 99}`}</Typography>
              </Typography>
            )
          }}
          sx={{
            justifyContent: 'flex-end',
            pt: 1,
            '& .MuiAvatar-root': {
              position: 'static',
              ml: '-12px'
            }
          }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Avatar key={index} src={user1.src}></Avatar>
          ))}
        </AvatarGroup>
      </Stack>
    </Stack>
  )
}


const HomePage = () => {
  const { data: clinics, mutate } = useSWR('affiliated-clinics', async () => await clinicApi.getAffiliated())
  const { openCreateClinicDialog } = useStore(clinicPageStore)

  return (
    <>
      <Box sx={{
        maxWidth: '100vw',
        filter: 'drop-shadow(0px 50px 50px rgba(0, 7, 41, 0.6))',
        background: 'rgba(9, 10, 15, 0.4)'
      }}>
        <Box sx={{
          maxWidth: '100%',
          minHeight: '100vh',
          background: 'rgba(255 255 255 0.1)',
          backdropFilter: 'blur(60px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start'
        }}>
          <Typography sx={{
            position: 'absolute',
            left: 64,
            top: 48,
            color: '#fff',
            fontSize: 34,
            fontWeight: 600,
            lineHeight: 1.5
          }}>
            Clinic List
          </Typography>

          <Stack
            direction={'row'}
            sx={{
              width: '100%',
              justifyContent: 'end',
              mt: 1,
              mr: 3
            }}
          >
            <IconButton aria-label={'search'} size={'large'} sx={{ width: 48, height: 48 }}>
              <SearchIcon sx={{ fontSize: 24, '& path': { stroke: '#fff' } }} />
            </IconButton>
            <IconButton aria-label={'setting'} size={'large'} sx={{ width: 48, height: 48 }}>
              <SettingIcon sx={{ fontSize: 24, '& path': { stroke: '#fff' } }} />
            </IconButton>
            <IconButton aria-label={'notification'} size={'large'} sx={{ width: 48, height: 48 }}>
              <BellIcon sx={{ fontSize: 24, '& path': { stroke: '#fff' } }} />
            </IconButton>
          </Stack>

          <Stack
            direction={'row'}
            sx={{
              width: '100%',
              px: 8,
              py: 1.5,
              gap: 1,
              justifyContent: 'end'
            }}
          >
            <Button variant={'secondary'}>
              Manage
            </Button>
            <Button variant={'primary'} onClick={openCreateClinicDialog}>
              <AddRoundedIcon sx={{ fontSize: 24 }} />
              CREATE
            </Button>
          </Stack>

          <Box sx={{
            width: '100%',
            mt: 11,
            height: 'calc(100vh - 220px)',
            marginLeft: '-12px'
          }}>
            <ScrollBar height={'100%'} fullHeight>
              <Grid2 container spacing={6} sx={{ width: '100%', px: 11, py: 2 }}>
                {clinics?.map((clinic) => (
                  <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key={clinic.id}>
                    <ClinicListItem
                      id={clinic.id}
                      name={clinic.name}
                      address={clinic.address}
                      userCount={clinic.userCount}
                      maxDisplayUser={4}
                    />
                  </Grid2>
                ))}
              </Grid2>
            </ScrollBar>
          </Box>
        </Box>
      </Box>
      <CreateClinicDialog mutateClinics={mutate} />
    </>
  )
}

export default HomePage
