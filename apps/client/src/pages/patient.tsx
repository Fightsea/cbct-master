import { useRef, useState, useEffect } from 'react'
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material'
import MedicalIcon from '@/components/icons/MedicalIcon'
import PackageIcon from '@/components/icons/PackageIcon'
import TriangleIcon from '@/components/icons/TriangleIcon'
import CalendarIcon from '@/components/icons/CalendarIcon'
import FilterIcon from '@/components/icons/FilterIcon'
import PatientTable, { PatientTableHandle } from '@/containers/tables/patientTable'
import { TreatmentStatus } from '@cbct/enum/patient'
import CreatePatientDialog from '@/containers/dialogs/createPatientDialog'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useStore } from 'zustand'
import { patientPageStore } from '@/stores/patientPageStore'
import PatientDetailDialog from '@/containers/dialogs/patientDetailDialog'
import FormSearchInput from '@/components/forms/FormSearchInput'

type TabPanelProps = {
  children?: React.ReactNode
  index: number
  value: number
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props
  const { openPatientDialog } = useStore(patientPageStore)

  return (
    <Box
      role={'tabpanel'}
      id={`tabpanel-${index}`}
      sx={{
        height: '100%',
        width: '100%',
        display: value === index ? 'flex' : 'none',
        opacity: value === index ? 1 : 0,
        borderRadius: '8px',
        boxShadow: '0px 10px 18px 0px rgba(0, 0, 0, 0.25)',
        flexDirection: 'column',
        poisition: 'relative'
      }}
      {...other}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
        <Typography sx={{
          color: '#656565',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 600,
          lineHeight: '150%'
        }}>
          病人列表
        </Typography>
        <Stack direction={'row'} gap={1}>
          <Button variant={'secondary'} startIcon={<CalendarIcon />} sx={{ fontWeight: 600 }}>Date</Button>
          <Button variant={'secondary'} startIcon={<FilterIcon sx={{ '& path:not(mask path)': { fill: 'none !important' } }} />} sx={{ fontWeight: 600 }}>Filter</Button>
          <Button variant={'primary'} onClick={openPatientDialog}><AddRoundedIcon sx={{ fontSize: 24 }} />NEW</Button>
        </Stack>
      </Box>
      {children}
    </Box>
  )
}

const tabLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  '& .MuiTypography-root': {
    textAlign: 'center',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '150%',
    textTransform: 'none'
  }
}

const tabLabels = (value: number) => [
  <Box key={0} sx={tabLabelStyle}>
    <MedicalIcon sx={{ '& path:not(mask path)': { fill: value === 0 ? '#6E7AB8' : '#656565' } }} />
    <Typography>In Treatment</Typography>
  </Box>,
  <Box key={1} sx={tabLabelStyle}>
    <TriangleIcon sx={{ '& path:not(mask path)': { stroke: value === 1 ? '#6E7AB8' : '#656565' } }} />
    <Typography>Action Required</Typography>
  </Box>,
  <Box key={2} sx={tabLabelStyle}>
    <PackageIcon sx={{ '& path:not(mask path)': { stroke: value === 2 ? '#6E7AB8' : '#656565' } }} />
    <Typography>Archived</Typography>
  </Box>
]

const PatientPage = () => {
  const [tabValue, setTabValue] = useState(0)
  const inTreatmentTableRef = useRef<PatientTableHandle>(null)
  const actionRequiredTableRef = useRef<PatientTableHandle>(null)
  const archivedTableRef = useRef<PatientTableHandle>(null)
  const { setHandleMutateAllTables } = useStore(patientPageStore)
  const [searchValue, setSearchValue] = useState<string>('')

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleMutateAllTables = () => {
    inTreatmentTableRef.current?.mutate()
    actionRequiredTableRef.current?.mutate()
    archivedTableRef.current?.mutate()
  }

  useEffect(() => {
    setHandleMutateAllTables(handleMutateAllTables)
  }, [])

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%', px: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'start', height: '48px'  }}>
        <Tabs value={tabValue} onChange={handleChange}>
          {tabLabels(tabValue).map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
        <FormSearchInput
          value={searchValue}
          onChange={setSearchValue}
        />
      </Box>
      <Box sx={{ width: '100%', height: 'calc(100% - 48px - 60px)', px: 3, pb: 1.5 }}>
        <CustomTabPanel value={tabValue} index={0}>
          <PatientTable status={TreatmentStatus.IN_TREATMENT} ref={inTreatmentTableRef} />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <PatientTable status={TreatmentStatus.ACTION_REQUIRED} ref={actionRequiredTableRef} />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          <PatientTable status={TreatmentStatus.ARCHIVED} ref={archivedTableRef} />
        </CustomTabPanel>
      </Box>

      <CreatePatientDialog mutatePatient={handleMutateAllTables} />
      <PatientDetailDialog />
    </Box>
  )
}

export default PatientPage
PatientPage.title = 'Patient'
