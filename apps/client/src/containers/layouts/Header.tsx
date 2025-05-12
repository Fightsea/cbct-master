import BellIcon from '@/components/icons/BellIcon'
import SearchIcon from '@/components/icons/SearchIcon'
import SettingIcon from '@/components/icons/SettingIcon'
import { Box, Stack, IconButton, Typography } from '@mui/material'

type HeaderProps = {
  title: string
}

const Header = ({ title }: HeaderProps) => {
  return (
    <Stack
      direction={'row'}
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        pl: 4,
        pr: 3.25
      }}
    >
      <Box sx={{
        height: 72,
        display: 'flex',
        alignItems: 'end'
      }}>
        <Typography sx={{
          color: '#3E3E3E',
          fontSize: 26,
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: '150%'
        }}>
          {title}
        </Typography>
      </Box>
      <Stack direction={'row'}>
        <IconButton aria-label={'search'} size={'large'} sx={{ width: 48, height: 48 }}>
          <SearchIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <IconButton aria-label={'setting'} size={'large'} sx={{ width: 48, height: 48 }}>
          <SettingIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <IconButton aria-label={'notification'} size={'large'} sx={{ width: 48, height: 48 }}>
          <BellIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Stack>
    </Stack>
  )
}

export default Header
