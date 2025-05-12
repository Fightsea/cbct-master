import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  Typography
} from '@mui/material'
import { useStore } from 'zustand'
import { patientPageStore } from '@/stores/patientPageStore'
import CloseIcon from '@mui/icons-material/Close'
import PatientProfile from './PatientProfile'
import { useState, useEffect } from 'react'
import History from './History'
import PatientPhoto from './PatientPhoto'
import CBCTPhotos from './CBCTPhotos'
import XRayPhotos from './XRayPhotos'
import OralScanFiles from './OralScanFiles'

const tabs = [{
  label: 'History',
  content: <History />
}, {
  label: 'Photos',
  content: <PatientPhoto />
}, {
  label: 'CBCT',
  content: <CBCTPhotos showViewToggle={true} showActions={true} />
}, {
  label: 'X-Ray',
  content: <XRayPhotos showViewToggle={true} showActions={true} />
}, {
  label: 'Oral Scan',
  content: <OralScanFiles showActions={true} />
}]

const TabPanel = ({ value, index, children }: { value: number, index: number, children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (value === index) {
      setMounted(true)
    }
  }, [value, index])

  if (!mounted) return null

  return (
    <Box
      role={'tabpanel'}
      hidden={value !== index}
      id={`tabpanel-${index}`}
      sx={{
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {children}
    </Box>
  )
}

const PatientDetailDialog = () => {
  const [tabValue, setTabValue] = useState(0)
  const { isOpenPatientDetailDialog, closePatientDetailDialog } = useStore(patientPageStore)

  return (
    <Dialog
      open={isOpenPatientDetailDialog}
      PaperProps={{
        sx: {
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: 'calc(100% - 64px)',
          borderRadius: '10px',
          margin: '32px'
        }
      }}
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return
        }
        closePatientDetailDialog()
      }}
    >
      <DialogTitle component={'div'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant={'h3'} sx={{ fontWeight: 700 }}>Patient Profile</Typography>
        <IconButton
          aria-label={'close'}
          onClick={closePatientDetailDialog}
          sx={(theme) => ({ color: theme.palette.grey[500] })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', p: 3, gap: 2 }}>
        <Box sx={{ height: '100%', flexShrink: 0 }}>
          <PatientProfile />
        </Box>
        <Box sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} sx={{ color: '#656565', fontSize: '14px', fontWeight: 600 }} />
            ))}
          </Tabs>
          {tabs.map((tab, index) => (
            <TabPanel key={index} value={tabValue} index={index}>
              {tab.content}
            </TabPanel>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default PatientDetailDialog
