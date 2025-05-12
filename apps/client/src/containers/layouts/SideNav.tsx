import { IconButton, Stack, Button, Box, Typography, Avatar } from '@mui/material'
import { useState } from 'react'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import DashboardIcon from '@/components/icons/DashboardIcon'
import Image from 'next/image'
import logo from '@/public/logo.png'
import logoIcon from '@/public/logo-icon.png'
import ClinicIcon from '@/components/icons/ClinicIcon'
import { authStore } from '@/stores/authStore'
import { useStore } from 'zustand'
import PersonIcon from '@mui/icons-material/Person'
import DarkBackgroundBox from '@/components/boxes/DarkBackgroundBox'
import router from 'next/router'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'

const routes = [{
  label: 'Patients',
  icon: <PersonRoundedIcon />
}, {
  label: 'Dashboard',
  icon: <DashboardIcon />
}]

const SideNav = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const { user } = useStore(authStore)

  return (
    <DarkBackgroundBox
      sx={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        width: isExpanded ? 200 : 100,
        minHeight: '100vh',
        height: 'auto',
        boxShadow: '0px 50px 50px -24px rgba(0, 7, 41, 0.50)',
        transition: 'width 0.3s ease-out'
      }}
    >
      <IconButton
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          position: 'absolute',
          right: -9,
          top: 63,
          width: 18,
          height: 18,
          background: '#262626',
          color: 'rgba(232, 236, 255, 0.5)',
          transform: isExpanded ? 'rotate(0deg)' : 'rotate(-180deg)',
          transition: 'transform 0.3s ease-out',
          ':hover': {
            background: '#262626',
            color: 'rgba(232, 236, 255, 0.5)'
          }
        }}
      >
        <KeyboardArrowLeftRoundedIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        {isExpanded ? (
          <Box
            component={Image}
            src={logo}
            alt={'logo'}
            width={128}
            height={40}
          />
        ) : (
          <Box
            component={Image}
            src={logoIcon}
            alt={'logo icon'}
            width={40}
            height={40}
          />
        )}
      </Box>

      <Box
        sx={{
          width: '100%',
          p: 2,
          ml: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: isExpanded ? 'start' : 'center'
        }}
      >
        <Typography sx={{
          pl: isExpanded ? 2 : 0,
          color: 'rgba(255, 255, 255, 0.32)',
          fontFamily: 'Inter',
          fontSize: 8,
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: '18px',
          letterSpacing: '0.2px',
          textTransform: 'uppercase'
        }}>
          Main
        </Typography>
        <Stack spacing={1}>
          {routes.map((route) => (
            <Button
              variant={'list'}
              sx={{
                width: '100%',
                justifyContent: isExpanded ? 'start' : 'center',
                gap: 1.5,
                position: 'relative',
                transition: 'transform 0.3s ease-out'
              }}
              key={route.label}
            >
              {route.icon}
              <Box sx={{
                opacity: isExpanded ? 1 : 0,
                position: isExpanded ? 'relative' : 'absolute',
                visibility: isExpanded ? 'visible' : 'hidden',
                fontWeight: 600
              }}>
                {route.label}
              </Box>
            </Button>
          ))}
        </Stack>
      </Box>

      <Box sx={{
        width: '100%',
        p: 2,
        ml: 0,
        display: 'flex',
        flexDirection: 'column',
        mt: 'auto'  // Add this line to push the box to the bottom
      }}>
        <Box sx={{
          width: '100%',
          px: 1.5,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 2,
          border: '0.5px solid rgba(232, 236, 255, 0.12)',
          background: 'rgba(110, 122, 184, 0.10)',
          boxShadow: '0px 50px 50px var(--sds-size-depth-negative-800) rgba(110, 122, 184, 0.50)'
        }}>
          <Box sx={{ width: '100%', gap: 1, display: 'flex', alignItems: 'center' }}>
            <Avatar>
              <PersonIcon />
            </Avatar>
            <Box sx={{
              opacity: isExpanded ? 1 : 0,
              position: isExpanded ? 'relative' : 'absolute',
              visibility: isExpanded ? 'visible' : 'hidden'
            }}>
              <Typography sx={{
                color: 'rgba(255, 255, 255, 0.30)',
                fontFamily: 'Roboto',
                fontSize: 10,
                fontStyle: 'normal',
                lineHeight: '150%',
                textTransform: 'uppercase'
              }}>
                {user?.position}
              </Typography>
              <Typography sx={{
                color: '#fff',
                fontSize: 14,
                fontStyle: 'normal',
                lineHeight: '150%'
              }}>
                {user?.name}
              </Typography>
            </Box>
          </Box>

          <Button
            variant={'primary'}
            sx={{
              justifyContent: 'center',
              px: isExpanded ? 1.5 : 0,
              width: '100%',
              fontSize: 14,
              gap: 1
            }}
            onClick={() => {
              router.push('/')
            }}
          >
            <ClinicIcon sx={{ width: 18, height: 18 }} />
            <Box sx={{
              opacity: isExpanded ? 1 : 0,
              position: isExpanded ? 'relative' : 'absolute',
              visibility: isExpanded ? 'visible' : 'hidden'
            }}>
              Clinic List
            </Box>
          </Button>
        </Box>
      </Box>
    </DarkBackgroundBox>
  )
}

export default SideNav
