import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import { useCallback, useState, forwardRef, useImperativeHandle } from 'react'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'

export type StepperHandle = {
  handleNext: () => void
  handlePrev: () => void
  curStep: number
}

type StepperProps = {
  steps: {
    label: string
    description: string
    isFinished: boolean
  }[]
  onStepChange?: (step: number) => void
}

const Stepper = forwardRef<StepperHandle, StepperProps>(({ steps, onStepChange }, ref) => {
  const [curStep, setCurStep] = useState(1)
  const [maxStep, setMaxStep] = useState(1)

  const handlePrev = useCallback(() => {
    if (curStep > 1) {
      const prevStep = curStep - 1
      setCurStep(prevStep)
      onStepChange?.(prevStep)
    }
  }, [curStep, onStepChange])

  const handleNext = useCallback(() => {
    if (curStep < steps.length + 1) {
      const nextStep = curStep + 1
      setCurStep(nextStep)
      if (nextStep > maxStep) {
        setMaxStep(nextStep)
      }
      onStepChange?.(nextStep)
    }
  }, [curStep, steps.length, onStepChange, maxStep])

  useImperativeHandle(ref, () => ({
    handleNext,
    handlePrev,
    curStep
  }))

  return (
    <Box sx={{ width: '100%', height: 'auto', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
      {steps.map((step, index) => (
        <Box
          key={index}
          sx={{
            width: '100%',
            height: 'fill',
            opacity: step.isFinished ? 1 : 0.8,
            '&:hover': {
              cursor: maxStep >= index + 1 && curStep !== index + 1 ? 'pointer' : 'default'
            }
          }}
          onClick={() => {
            if (maxStep >= index + 1 && curStep !== index + 1) {
              setCurStep(index + 1)
              onStepChange?.(index + 1)
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 1, gap: 2 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: 32,
              height: 32,
              backgroundColor: curStep === index + 1 ? '#C6CAE2' : 'none',
              borderRadius: 2,
              transition: 'all 0.3s'
            }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 24,
                  height: 24,
                  backgroundColor: maxStep >= index + 1 ? '#6E7AB8' : '#fff',
                  borderRadius: 1,
                  border: maxStep >= index + 1 ? 'none' :'1px solid #E5E5E5',
                  color: maxStep >= index + 1 ? '#fff' : '#E5E5E5',
                  fontSize: 18,
                  transition: 'all 0.3s'
                }}
              >
                {step.isFinished ? <CheckRoundedIcon /> : index + 1}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography sx={{
                fontSize: 14,
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
                color: maxStep >= index + 1 ? '#6E7AB8' : '#656565',
                transition: 'all 0.3s'
              }}>{step.label}</Typography>
              <Typography sx={{
                fontFamily: 'Roboto',
                fontSize: 12,
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '150%',
                color: maxStep >= index + 1 ? '#656565' : '#A1A1A1',
                transition: 'all 0.3s'
              }}>{step.description}</Typography>
            </Box>
          </Box>
          <Box sx={{
            width: '100%',
            height: 4,
            backgroundColor: maxStep >= index + 1 ? '#6E7AB8' : '#E5E5E5',
            borderRadius: 0.5,
            transition: 'all 0.3s'
          }} />
        </Box>
      ))}
    </Box>
  )
})

export default Stepper
Stepper.displayName = 'Stepper'
