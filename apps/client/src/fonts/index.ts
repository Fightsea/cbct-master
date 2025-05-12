import localFont from 'next/font/local'

export const openSans = localFont({
  src: './OpenSansVF.ttf',
  variable: '--font-open-snas',
  weight: '300 400 500 600 700',
  display: 'swap'
})

export const roboto = localFont({
  src: './RobotoVF.ttf',
  variable: '--font-roboto',
  weight: '300 400 500 600 700'
})

export const notoSansTc = localFont({
  src: './NotoSansTcVF.ttf',
  variable: '--font-noto-sans-tc',
  weight: '300 400 500 600 700'
})
