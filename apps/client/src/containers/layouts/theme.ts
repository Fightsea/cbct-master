import { createTheme } from '@mui/material'
import { openSans, roboto, notoSansTc } from '@/fonts'

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    primary: true
    secondary: true
    list: true
    cancel: true
  }
}

// console.log('font: ', openSans.style.fontFamily)

export const theme = createTheme({
  typography: {
    fontFamily: `${openSans.style.fontFamily.split(',')[0]}, ${roboto.style.fontFamily.split(',')[0]}, ${notoSansTc.style.fontFamily.split(',')[0]}, sans-serif`,
    h3: {
      fontSize: 22,
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '150%'
    },
    h4: {
      fontSize: 18,
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '150%'
    },
    h5: {
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '150%'
    }
  },
  palette: {
    primary: {
      main: '#6E7AB8'
    },
    error: {
      main: '#FF7700'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          variants: [{
            props: { variant: 'primary' },
            style: {
              boxSizing: 'border-box',
              height: 40,
              minWidth: 0,
              px: 1.5,
              borderRadius: 8,
              fontWeight: 600,
              border: '0.5px solid rgba(232, 236, 255, 0.12)',
              background: '#6E7AB8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              color: '#fff',
              textTransform: 'none',
              ':hover': {
                background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), #6E7AB8'
              },
              '&.Mui-disabled': {
                color: '#fff',
                opacity: 0.7
              },
              '& .MuiSvgIcon-root': {
                fontSize: 24,
                '& path': {
                  fill: '#fff'
                }
              }
            }
          }, {
            props: { variant: 'secondary' },
            style: {
              boxSizing: 'border-box',
              height: 40,
              minWidth: 0,
              borderRadius: 8,
              px: 1.5,
              border: '2px solid #E8ECFF',
              background: '#FAFAFA',
              lineHeight: 1,
              color: '#3E3E3E',
              ':hover': {
                border: '2px solid #C6CAE2',
                background: '#E9EBF4'
              },
              '& .MuiSvgIcon-root': {
                fontSize: 24,
                '& path': {
                  fill: '#3E3E3E'
                }
              }
            }
          }, {
            props: { variant: 'list' },
            style: {
              boxSizing: 'border-box',
              height: 40,
              borderRadius: 8,
              fontWeight: 600,
              px: 1.5,
              border: '0.5px solid rgba(232, 236, 255, 0)',
              background: 'opacity',
              lineHeight: 1,
              color: 'rgba(255, 255, 255, 0.5)',
              ':hover': {
                border: '0.5px solid rgba(232, 236, 255, 0.12)',
                background: 'radial-gradient(50% 50% at 50% 50%, rgba(110, 122, 184, 0.50) 0%, rgba(110, 122, 184, 0.00) 100%)',
                textShadow: '0px 0px 12px #fff',
                color: 'rgba(255, 255, 255, 1)',
                '& .MuiSvgIcon-root': {
                  filter: 'drop-shadow(0px 0px 12px #fff)',
                  '& path': {
                    fill: 'rgba(255, 255, 255, 1)'
                  }
                }
              },
              '& .MuiSvgIcon-root': {
                fontSize: 24,
                '& path': {
                  fill: 'rgba(255, 255, 255, 0.5)'
                }
              }
            }
          }, {
            props: { variant: 'cancel' },
            style: {
              boxSizing: 'border-box',
              height: 40,
              minWidth: 0,
              borderRadius: 8,
              px: 1.5,
              border: '0.5px solid rgba(232, 236, 255, 0.12)',
              background: '#A1A1A1',
              lineHeight: 1,
              color: '#fff',
              ':hover': {
                background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), #A1A1A1'
              },
              '& .MuiSvgIcon-root': {
                fontSize: 24,
                '& path': {
                  fill: '#fff'
                }
              }
            }
          }]
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#6E7AB8'
        },
        root: {
          '& .MuiTab-root': {
            '&.Mui-selected': {
              color: '#6E7AB8'
            }
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.visually-hidden': {
            clip: 'rect(0 0 0 0)',
            clipPath: 'inset(50%)',
            height: '1px',
            overflow: 'hidden',
            position: 'absolute',
            bottom: 0,
            left: 0,
            whiteSpace: 'nowrap',
            width: '1px'
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.image': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            padding: 0.25,
            borderRadius: 4,
            margin: 8,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            },
            '& .MuiSvgIcon-root': {
              color: '#fff'
            }
          }
        }
      }
    }
  }
})
