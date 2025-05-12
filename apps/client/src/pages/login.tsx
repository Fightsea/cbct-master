import loginImage_1 from '@/public/loginImage-1.png'
import loginImage_2 from '@/public/loginImage-2.png'
import Image from 'next/image'
import { Box } from '@mui/material'
import LoginForm from '@/containers/forms/LoginForm'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import styles from '@/styles/swiper.module.css'

const LoginPage = () => {

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return `<span class="${styles.bullet} ${className}"></span>`
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{ width: '50%', display: { xs: 'none', md: 'block' }, height: '100%', position: 'relative' }} >
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          pagination={pagination}
          modules={[Pagination, Autoplay]}
          speed={800}
          autoplay={{
            delay: 5000
          }}
          className={styles.swiper}
        >
          <SwiperSlide>
            <Box sx={{ width: '100%', height: '100vh', position: 'relative' }} >
              <Image src={loginImage_1} alt={'logo'} fill style={{ objectFit: 'cover', display: 'block' }} />
            </Box>
          </SwiperSlide>
          <SwiperSlide>
            <Box sx={{ width: '100%', height: '100vh' }} >
              <Image src={loginImage_2} alt={'logo'} fill style={{ objectFit: 'cover', display: 'block' }} />
            </Box>
          </SwiperSlide>
        </Swiper>
      </Box>

      <Box sx={{
        width: { xs: '100%', md: '50%' },
        filter: 'drop-shadow(0px 50px 50px rgba(0, 7, 41, 0.7))',
        backdropFilter: 'blur(200px)'
      }}>
        <Box sx={{
          px: 8,
          width: '100%',
          height: '100vh',
          background: 'rgba(9, 10, 15, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box
            sx={{
              width: '100%',
              px: 4,
              py: 6,
              backgroundColor: 'rgba(110, 122, 184, 0.5)',
              border: '1px solid rgba(232, 236, 255, 0.12)',
              filter: 'drop-shadow(0px 0px 50px rgba(0, 0, 0, 0.5))',
              borderRadius: '16px'
            }}
          >
            <Box sx={{
              color: '#fff',
              fontSize: 42,
              fontWeight: 600,
              mb: 6
            }}>
              LOGIN
            </Box>
            <LoginForm />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage
