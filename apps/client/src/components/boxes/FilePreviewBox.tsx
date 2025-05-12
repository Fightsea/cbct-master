import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import TrashIcon from '@/components/icons/TrashIcon'
import { ReactNode } from 'react'
import { globalStore } from '@/stores/globalStore'
import { useStore } from 'zustand'
import ScrollBar from '@/components/scrollbars/ScrollBar'

export type DateFiles = {
  date: string
  files: FileType[]
}

export type FileType = {
  id: string
  name: string
} & Record<string, any>

type Props = {
  files: DateFiles[]
  deleteFile: (id: string) => void
  toolbar?: ReactNode
}

const FilePreviewBox = ({ files, deleteFile, toolbar }: Props) => {
  const { openDeleteDialog } = useStore(globalStore)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '8px 12px', bgcolor: '#E5E5E5', borderRadius: '8px'  }}>
      <Box sx={{ width: '100%', mb: 1 }}>
        {toolbar}
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', marginLeft: '-12px' }}>
        <ScrollBar height={'100%'} width={'100%'}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, flex: 1 }}>
            {files.map((file, index) => file.files.length ? (
              <Accordion
                key={index}
                sx={{
                  background: '#FAFAFA',
                  boxShadow: 'none',
                  margin: '0 !important',
                  '&::before': {
                    display: 'none'
                  },
                  '& .MuiAccordionSummary-content': {
                    margin: 0,
                    '&.Mui-expanded': {
                      margin: '0 !important'
                    }
                  },
                  '& .Mui-expanded': {
                    margin: 0
                  },
                  '& .MuiAccordionSummary-root': {
                    minHeight: '48px',
                    margin: 0,
                    '&.Mui-expanded': {
                      minHeight: '48px'
                    }
                  },
                  '& .MuiIconButton-root': {
                    height: '24px',
                    width: '24px'
                  }
                }}
                defaultExpanded
              >
                <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                  <Typography>{file.date}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  {file.files.map((file) => (
                    <Box
                      key={file.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 1,
                        border: '1px solid #E5E5E5',
                        background: '#FFF'
                      }}
                    >
                      <Typography sx={{ height: '100%', fontSize: 16, textAlign: 'center' }}>{file.name}</Typography>
                      <IconButton onClick={() => openDeleteDialog(() =>deleteFile(file.id))}>
                        <TrashIcon />
                      </IconButton>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            ): null)}
          </Box>
        </ScrollBar>
      </Box>
    </Box>
  )
}

export default FilePreviewBox
