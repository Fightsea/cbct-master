import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginRequestBodySchema, type LoginRequest } from '@cbct/api/request/auth'
import { Button, Stack, Box, Typography } from '@mui/material'
import authApi from '@/apis/authApi'
import FormInput from '@/components/forms/FormInput'
import { useStore } from 'zustand'
import { authStore } from '@/stores/authStore'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { SnackbarContext } from '@/contexts/SnackbarContext'
import WhiteCheckBox from '@/components/checkboxes/WhiteCheckbox'

const LoginForm = () => {
  const [isRememberMe, setIsRememberMe] = useState(false)
  const router = useRouter()
  const { email, login } = useStore(authStore)
  const { openSnackbar } = useContext(SnackbarContext)

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestBodySchema),
    defaultValues: {
      email: email ?? ''
    }
  })

  const onSubmit = (data: LoginRequest) => {
    authApi.login(data)
      .then(res => {
        login(res, isRememberMe ? data.email : null)
        router.push('/')
        openSnackbar({
          message: 'Login successful',
          severity: 'success'
        })
      })
      .catch(() => {
        openSnackbar({
          message: 'Login failed',
          severity: 'error'
        })
      })
  }

  return (
    <Box sx={{ width: '100%' }}>
      <FormProvider {...form}>
        <Box
          component={'form'}
          onSubmit={form.handleSubmit(onSubmit)}
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Stack
            spacing={2}
            sx={{ width: '100%' }}
          >
            <FormInput
              name={'email'}
              label={'E-mail Address'}
              placeholder={'E-mail'}
              fullWidth
            />
            <FormInput
              name={'password'}
              label={'Password'}
              placeholder={'Password'}
              fullWidth
              type={'password'}
            />

            <Box
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <WhiteCheckBox
                checked={isRememberMe}
                onChange={() => setIsRememberMe(prev => !prev)}
                sx={{
                  position: 'relative',
                  mr: 1,
                  '&.Mui-checked': {
                    color: '#649CBF'
                  }
                }}
              />
              <Typography sx={{ fontWeight: 400, color: '#fff' }}>Remember E-mail</Typography>
            </Box>

            <Button
              type={'submit'}
              variant={'contained'}
              sx={{
                borderRadius: 2,
                background: '#6E7AB8',
                border: '0.5px solid rgba(232, 236, 255, 0.12)',
                py: '13.5px'
              }}
            >
              <Typography sx={{ color: '#fff', filter: 'drop-shadow(0px 0px 12px #fff)' }}>LOGIN</Typography>
            </Button>
          </Stack>
        </Box>
      </FormProvider>
    </Box>
  )
}

export default LoginForm
