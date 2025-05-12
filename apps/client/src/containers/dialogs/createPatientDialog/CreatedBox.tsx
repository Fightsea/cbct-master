import { Box, Typography } from '@mui/material'
import CreateSuccessfullyImage from '@/public/created-successfully.png'
import Image from 'next/image'

const CreatedBox = () => {
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Image src={CreateSuccessfullyImage} alt={'patient-created'} width={500} height={500} />
      <Typography sx={{ fontSize: 26, fontStyle: 'normal', fontWeight: 600 }}>Created Successfully</Typography>
    </Box>
  )
}

export default CreatedBox
