import { zodResolver } from '@hookform/resolvers/zod'
import { CreateRequest, createRequestBodySchema } from '@cbct/api/request/patient'
import { Box, Button, Grid2, Menu, MenuItem, Typography } from '@mui/material'
import { forwardRef, useEffect, useImperativeHandle, useState, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { TreatmentStatus } from '@cbct/enum/patient'
import FormSelect from '@/components/forms/FormSelect'
import { Gender } from '@cbct/enum/user'
import FormDatePicker from '@/components/forms/FormDatePicker'
import FormTagSelector from '@/components/forms/FormTagSelector'
import useSWR from 'swr'
import patientApi from '@/apis/patientApi'
import { patientPageStore } from '@/stores/patientPageStore'
import { useStore } from 'zustand'
import clinicApi from '@/apis/clinicApi'
import { authStore } from '@/stores/authStore'
import { createPatientDialogStore } from '@/stores/createPatientDialogStore'
import { GetByIdResponse } from '@cbct/api/response/patient'
import MedicalIcon from '@/components/icons/MedicalIcon'
import TriangleIcon from '@/components/icons/TriangleIcon'
import PackageIcon from '@/components/icons/PackageIcon'
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded'
import FormInput from '@/components/forms/FormInput'
import { calculateBmi } from '@cbct/utils/math'

type Props = {
  onSubmit: (data: CreateRequest) => void
}

export type PersonalDetailFormHandle = {
  handleSubmit: () => Promise<void>
}

const PersonalDetailForm = forwardRef<PersonalDetailFormHandle, Props>(({ onSubmit }, ref) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const { isOpenPatientDialog } = useStore(patientPageStore)
  const { clinicId } = useStore(authStore)
  const { stepsStates, setStepValid, patientId } = useStore(createPatientDialogStore)
  const { data: patient } = useSWR<GetByIdResponse | null>(
    stepsStates[0].isUploaded ? `patient/${patientId}` : null,
    async () => {
      if (!patientId) return null
      const response = await patientApi.getById(patientId)
      return response && Object.keys(response).length ? response : null
    }
  )
  const form = useForm<CreateRequest>({
    resolver: zodResolver(createRequestBodySchema),
    mode: 'onChange',
    defaultValues: {
      treatmentStatus: TreatmentStatus.IN_TREATMENT,
      tagIds: []
    }
  })

  const formData = form.watch()

  const bmi = useMemo(() => {
    const { height, weight } = formData
    const isValidInput = height > 0 && weight > 0

    return isValidInput ? calculateBmi(height, weight) : 0
  }, [formData])

  const { data: newSerialNumber } = useSWR(
    isOpenPatientDialog ? 'patients/new-sn' : null,
    patientApi.getNewSerialNumber
  )
  const { data: clinics } = useSWR(
    isOpenPatientDialog ? 'clinics/affiliated' : null,
    clinicApi.getAffiliated
  )

  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      await form.handleSubmit(onSubmit)()
    }
  }))

  useEffect(() => {
    if (newSerialNumber) {
      form.setValue('serialNumber', newSerialNumber)
    }
  }, [newSerialNumber])

  useEffect(() => {
    setStepValid(1, form.formState.isValid)
  }, [form.formState.isValid, setStepValid])

  useEffect(() => {
    if (patient) {
      form.setValue('treatmentStatus', patient.treatmentStatus)
      form.setValue('serialNumber', patient.serialNumber)
      form.setValue('firstName', patient.firstName)
      form.setValue('lastName', patient.lastName)
      form.setValue('gender', patient.gender)
      form.setValue('birthday', patient.birthday)
      form.setValue('idNumber', patient.idNumber)
      form.setValue('phone', patient.phone)
      form.setValue('email', patient.email)
      form.setValue('height', patient.height)
      form.setValue('weight', patient.weight)
      form.setValue('tagIds', patient.tags.map((tag: { id: string }) => tag.id))
      form.setValue('note', patient.note || '')
      setStepValid(1, true)
    }
  }, [patient])

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

  return (
    <Box
      sx={{
        maxWidth: '800px',
        mx: 'auto',
        px: '48px'
      }}
    >
      <FormProvider {...form}>
        <Grid2
          component={'form'}
          onSubmit={form.handleSubmit(onSubmit)}
          container
          spacing={3}
        >
          <Grid2 size={12}>
            <Typography sx={{ fontSize: 22, fontStyle: 'normal', fontWeight: 600 }}>Personal Details</Typography>
            <Typography sx={{ fontSize: 22, fontStyle: 'normal', fontWeight: 600 }}>{stepsStates[0].isUploaded}</Typography>
          </Grid2>
          <Grid2 size={12}>
            <Box>
              <Button
                variant={'primary'}
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  px: '12px',
                  justifyContent: 'space-between',
                  width: 180,
                  'svg': {
                    transform: anchorEl ? 'rotate(180deg)' : 'rotate(0)',
                    transition: '0.3s ease-out'
                  }
                }}
              >
                <Typography sx={{ width: '135px', fontSize: '14px', lineHeight: '150%', fontWeight: 600 }}>
                  {TreatmentStatusMap[formData.treatmentStatus].label}
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
                  const isActive = form.watch('treatmentStatus') === status
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
                      onClick={async () => {
                        if (form.getValues('treatmentStatus') === status) {
                          setAnchorEl(null)
                          return
                        }

                        if (stepsStates[0].isUploaded && patientId) {
                          await patientApi.switchStatus(patientId, { treatmentStatus: status })
                          form.setValue('treatmentStatus', status)
                        } else {
                          form.setValue('treatmentStatus', status)
                        }
                        setAnchorEl(null)
                      }}
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
            </Box>
          </Grid2>
          <Grid2 size={12}>
            <FormInput
              name={'serialNumber'}
              label={'Serial Number'}
              labelColor={'#262626'}
              required
              defaultValue={newSerialNumber}
              disabled
            />
          </Grid2>
          <Grid2 size={6}>
            <FormInput
              name={'firstName'}
              label={'First Name'}
              labelColor={'#262626'}
              required
            />
          </Grid2>
          <Grid2 size={6}>
            <FormInput
              name={'lastName'}
              label={'Last Name'}
              labelColor={'#262626'}
              required
            />
          </Grid2>
          <Grid2 size={12}>
            <FormSelect
              name={'gender'}
              label={'Gender'}
              required
              labelColor={'#262626'}
              placeholder={'Please Select'}
              options={[
                { value: Gender.MALE, label: 'Male' },
                { value: Gender.FEMALE, label: 'Female' }
              ]}
            />
          </Grid2>
          <Grid2 size={12}>
            <FormDatePicker
              name={'birthday'}
              label={'Birthday'}
              required
              labelColor={'#262626'}
              placeholder={'YYYY/MM/DD'}
            />
          </Grid2>
          <Grid2 size={12}>
            <FormInput
              name={'idNumber'}
              label={'ID Number'}
              labelColor={'#262626'}
              required
              placeholder={'A123456789'}
            />
          </Grid2>
          <Grid2 size={12}>
            <FormInput
              name={'phone'}
              label={'Phone'}
              labelColor={'#262626'}
              required
            />
          </Grid2>
          <Grid2 size={12}>
            <FormInput
              name={'email'}
              label={'Email'}
              labelColor={'#262626'}
              required
            />
          </Grid2>
          <Box width={'100%'}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#262626', mb: '4px' }}>BMI</Typography>
            <Grid2 container size={12} sx={{ border: '1px solid #E5E5E5', borderRadius: '8px', p: '16px'}} spacing={2}>
              <Grid2 size={6}>
                <FormInput
                  type={'number'}
                  name={'height'}
                  label={'Height (cm)'}
                  labelColor={'#262626'}
                  min={0}
                  max={300}
                  required
                />
              </Grid2>
              <Grid2 size={6}>
                <FormInput
                  type={'number'}
                  name={'weight'}
                  label={'Weight (kg)'}
                  labelColor={'#262626'}
                  min={0}
                  max={300}
                  required
                />
              </Grid2>
              <Grid2 size={12}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#262626', mb: '4px' }}>Your BMI</Typography>
                <Typography sx={{ fontSize: 24, color: '#262626' }}>{bmi}</Typography>
              </Grid2>
            </Grid2>
          </Box>
          <Grid2 size={12}>
            <FormInput
              name={''}
              label={'Medical Unit'}
              labelColor={'#262626'}
              required
              disabled
              defaultValue={clinics?.find((clinic) => clinic.id === clinicId)?.name}
            />
          </Grid2>
          <Grid2 size={12}>
            <FormTagSelector
              name={'tagIds'}
              label={'Customer Tag'}
              labelColor={'#262626'}
            />
          </Grid2>
          <Grid2 size={12}>
            <FormInput
              name={'note'}
              label={'Note'}
              labelColor={'#262626'}
              fullWidth
              multiline
              rows={4}
            />
          </Grid2>
        </Grid2>
      </FormProvider>
    </Box>
  )
})

export default PersonalDetailForm
PersonalDetailForm.displayName = 'PersonalDetailForm'
