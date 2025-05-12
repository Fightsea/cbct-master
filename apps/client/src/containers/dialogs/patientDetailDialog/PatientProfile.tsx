import PatientAvatar from '@/components/images/PatientAvatar'
import { patientPageStore } from '@/stores/patientPageStore'
import { useStore } from 'zustand'
import { Box, MenuItem, Menu, Button, Typography } from '@mui/material'
import patientApi from '@/apis/patientApi'
import { TreatmentStatus } from '@cbct/enum/patient'
import { useContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import { GetByIdResponse, GetOsaRiskResponse } from '@cbct/api/response/patient'
import TagChip from '@/components/chips/TagChip'
import OSARiskChip from '@/components/chips/OSARiskChip'
import MedicalIcon from '@/components/icons/MedicalIcon'
import TriangleIcon from '@/components/icons/TriangleIcon'
import PackageIcon from '@/components/icons/PackageIcon'
import ScrollBar from '@/components/scrollbars/ScrollBar'

const PatientProfile = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { patientId, isOpenPatientDialog } = useStore(patientPageStore)
  const { data: patient, mutate, isLoading } = useSWR<GetByIdResponse | null>(
    patientId ? `patients/${patientId}` : null,
    async () => {
      const response = await patientApi.getById(patientId || '')
      return response && Object.keys(response).length ? response : null
    }
  )
  const { data: osaRisk } = useSWR<GetOsaRiskResponse>(
    patientId ? `patients/${patientId}/osa-risk` : null,
    async () => patientApi.getOSARisk(patientId || '')
  )
  const { openSnackbar } = useContext(SnackbarContext)

  const handleSwitchStatus = async (status: TreatmentStatus) => {
    await patientApi.switchStatus(patientId || '', { treatmentStatus: status })
      .then(() => {
        mutate()
        openSnackbar({
          message: 'Switch success',
          severity: 'success'
        })
      })
      .catch(() => openSnackbar({
        message: 'Switch failed',
        severity: 'error'
      }))
      .finally(() => setAnchorEl(null))
  }

  useEffect(() => {
    mutate()
  }, [isOpenPatientDialog, mutate])

  const TreatmentStatusMap = {
    IN_TREATMENT: {
      label: 'In Treatment',
      icon: <MedicalIcon sx={{ '& path:not(mask path)': { fill: '#3E3E3E' }, mr: '12px' }}/>,
      style: { fill: '#ffffff' }
    },
    ACTION_REQUIRED: {
      label: 'Action Required',
      icon: <TriangleIcon sx={{ '& path:not(mask path)': { stroke: '#3E3E3E' }, mr: '12px' }}/>,
      style: { stroke: '#ffffff' }
    },
    ARCHIVED: {
      label: 'Archived',
      icon: <PackageIcon sx={{ '& path:not(mask path)': { stroke: '#3E3E3E' }, mr: '12px' }}/>,
      style: { stroke: '#ffffff' }
    }
  }

  const fontStyle = {
    color: '#E5E5E5',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      width: 200,
      height: '100%',
      p: 1.25,
      borderRadius: 1,
      background: '#484454',
      overflow: 'hidden'
    }}>
      <PatientAvatar
        patientId={patientId || ''}
        sx={{
          width: 180,
          height: 240,
          flexShrink: 0
        }}
      />
      <Button
        variant={'primary'}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          mt: 1,
          px: '12px',
          justifyContent: 'space-between',
          'svg': {
            transform: anchorEl ? 'rotate(180deg)' : 'rotate(0)',
            transition: '0.3s ease-out'
          }
        }}
      >
        <Typography sx={{ width: '135px', fontSize: '14px', lineHeight: '150%', fontWeight: 600 }}>
          {isLoading ? 'Loading...' : patient?.treatmentStatus ? TreatmentStatusMap[patient?.treatmentStatus].label : 'No Status'}
        </Typography>
        <ArrowDropDownRoundedIcon />
      </Button>
      <Menu
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        sx={{
          '& .MuiMenu-list': { py: 0 },
          '& .MuiMenu-paper': { mt: 1 }
        }}
      >
        {Object.values(TreatmentStatus).map((status) => {
          const isActive = patient?.treatmentStatus === status
          const baseStyle = {
            fontSize: '14px',
            fontWeight: 600,
            color: '#3E3E3E',
            width: '180px',
            height: '48px',
            px: '12px'
          }
          const activeStyle = isActive ? {
            bgcolor: '#9EA5C7',
            color: '#ffffff',
            '& .MuiSvgIcon-root path:not(mask path)': {
              ...TreatmentStatusMap[status].style
            },
            '&:hover': {
              bgcolor: '#9EA5C7',
              color: '#ffffff',
              '& .MuiSvgIcon-root path:not(mask path)': {
                ...TreatmentStatusMap[status].style
              }
            }
          } : {}

          return (
            <MenuItem
              key={status}
              onClick={() => handleSwitchStatus(status)}
              sx={{
                ...baseStyle,
                ...activeStyle
              }}
            >
              {TreatmentStatusMap[status].icon}
              {TreatmentStatusMap[status].label}
            </MenuItem>
          )
        })}
      </Menu>

      <Box sx={{ flex: 1, overflow: 'hidden', marginLeft: '-12px' }}>
        <ScrollBar height={'100%'} fullHeight>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, height: '100%' }}>
            <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 0.5 }}>
              <Typography sx={{ color: '#E5E5E5', fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>
                {patient?.firstName} {patient?.lastName}
              </Typography>
              <Typography sx={fontStyle}>
                {patient?.idNumber}
              </Typography>
              <Typography sx={fontStyle}>
                {patient?.gender}
              </Typography>
              <Typography sx={fontStyle}>
                {patient?.birthday}
              </Typography>
              <Typography sx={fontStyle}>
                {patient?.phone}
              </Typography>
              <Typography sx={fontStyle}>
                {patient?.email}
              </Typography>
              <Typography sx={{ minHeight: 45, ...fontStyle }}>
                {patient?.note}
              </Typography>
            </Box>
          </Box>
        </ScrollBar>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {patient?.tags.map((tag) => (
          <TagChip key={tag.id} id={tag.id} label={tag.name} color={tag.color} />
        ))}
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#504c5c',
        p: 1,
        borderRadius: 2.5,
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
      }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#FFF' }}>
          OSA Risk
        </Typography>
        <OSARiskChip osaRisk={osaRisk !== null} sx={{ p: 0, '& .MuiTypography-root': { fontWeight: 600 } }} />
      </Box>
    </Box>
  )
}

export default PatientProfile
