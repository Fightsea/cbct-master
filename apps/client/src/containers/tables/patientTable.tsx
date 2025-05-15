import { Box, IconButton, PaginationItem, Typography, styled } from '@mui/material'
import { DataGrid, gridClasses, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid'
import { SearchWithPagingResponse } from '@cbct/api/response/patient'
import useSWR from 'swr'
import patientApi from '@/apis/patientApi'
import { TreatmentStatus } from '@cbct/enum/patient'
import PatientStatusChip from '@/components/chips/PatientStatusChip'
import PatientAvatar from '@/components/images/PatientAvatar'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useStore } from 'zustand'
import { authStore } from '@/stores/authStore'
import TagChip from '@/components/chips/TagChip'
import { patientPageStore } from '@/stores/patientPageStore'
import OSARiskChip from '@/components/chips/OSARiskChip'
import Image from 'next/image'
import deleteConfirmImage from '@/public/delete-confirm.png'
import ScrollBar from '@/components/scrollbars/ScrollBar'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import Pagination from '@mui/material/Pagination'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { highlightText } from '@/utils/searching'

export type PatientTableHandle = {
  mutate: () => void
  setSearchValue: React.Dispatch<React.SetStateAction<string>>
}

type PatientTableProps = {
  status: TreatmentStatus
}

const StyledPagination = styled(Pagination)(({}) => ({
  '& .MuiPagination-ul': {
    justifyContent: 'center',

    '& .MuiPaginationItem-page': {
      padding: '0',
      minWidth: '44px',
      height: '44px',
      border: 'none',
      borderRadius: 0,
      fontWeight: 600,

      '&.Mui-selected': {
        backgroundColor: 'transparent',
        position: 'relative',

        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '3px',
          backgroundColor: '#6E7AB8',
          borderRadius: '8px 8px 0 0'
        }
      }
    },


    '& li:first-child': {
      marginRight: 'auto',

      '& .MuiPaginationItem-previousNext': {
        backgroundColor: 'transparent',
        border: 'none',
        height: '44px',
        minWidth: '95px',

        '&::after': {
          content: '"Label"',
          fontSize: '14px',
          fontWeight: 500,
          marginLeft: '18px'
        }
      }
    },

    '& li:last-child': {
      marginLeft: 'auto',

      '& .MuiPaginationItem-previousNext': {
        backgroundColor: 'transparent',
        border: 'none',
        height: '44px',
        minWidth: '95px',

        '&::before': {
          content: '"Label"',
          fontSize: '14px',
          fontWeight: 500,
          marginRight: '18px'
        }
      }
    }
  }
}))

const PatientTable = forwardRef<PatientTableHandle, PatientTableProps>(({ status }, ref) => {
  const { clinicId } = useStore(authStore)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'createdAt', sort: 'desc' }
  ])
  const [rowCount, setRowCount] = useState(0)
  const [searchValue, setSearchValue] = useState<string>('')

  const { openPatientDetailDialog } = useStore(patientPageStore)

  const { data, isLoading, mutate } = useSWR<SearchWithPagingResponse['results']>(
    `${clinicId}/patient/search?treatmentStatus=${status}&page=${paginationModel.page + 1}&size=${paginationModel.pageSize}&order=${sortModel[0]?.field}&sort=${sortModel[0]?.sort || 'asc'}&search=${searchValue}`,
    async () => patientApi.search({
      treatmentStatus: status,
      page: paginationModel.page + 1,
      size: paginationModel.pageSize,
      order: sortModel[0]?.field,
      sort: sortModel[0]?.sort || 'asc',
      search: searchValue
    })
      .then(data => {
        setRowCount(data.total)
        return data.results
      })
  )

  const handlePinnedClick = async ( id: string, isPinned: boolean) => {
    await patientApi.updatePinned(id, { pinned: isPinned })
      .then(() => {
        mutate()
      })
  }

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    setPaginationModel(model)
    mutate()
  }

  useImperativeHandle(ref, () => ({
    mutate,
    setSearchValue
  }))

  const columns: GridColDef<SearchWithPagingResponse['results'][number]>[] = [
    {
      field: 'pinned',
      headerName: '',
      width: 50,
      headerAlign: 'center',
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <StarRoundedIcon sx={{ width: 20, height: 20, color: '#656565' }} />
      ),
      renderCell: (params) => (
        <Box sx={{ py: 1, height: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            sx={{ padding: 0 }}
            size={'small'}
            onClick={(e) => {
              e.stopPropagation()
              handlePinnedClick(params.row.id, !params.row.pinned)
            }}
          >
            { params.row.pinned ?
              <StarRoundedIcon sx={{ width: 20, height: 20, color: '#6E7AB8' }} /> :
              <StarBorderRoundedIcon sx={{ width: 20, height: 20, color: '#C6CAE2' }} />
            }
          </IconButton>
        </Box>
      )
    },
    {
      field: 'name',
      headerName: 'Photo',
      width: 250,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, py: 1, height: '100%', boxSizing: 'border-box' }}>
          <PatientAvatar patientId={params.row.id} sx={{ width: 60, height: 80 }} />
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            height: '100%',
            width: 140
          }}>
            <Typography sx={{
              width: '100%',
              textWrap: 'wrap',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 700
            }}>{highlightText(params.row.name, searchValue)}</Typography>
            <PatientStatusChip status={params.row.treatmentStatus} sx={{ mt: 'auto' }} />
          </Box>
        </Box>
      )
    }, {
      field: 'osaRisk',
      headerName: 'OSA Risk',
      width: 140,
      disableColumnMenu: true,
      renderCell: (params) => {
        const osaRisk = params.row.osaRisk
        return <OSARiskChip osaRisk={osaRisk !== null} sx={{ px: 0 }} />
      }
    }, {
      field: 'tags',
      headerName: 'Tags',
      width: 140,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 0.5,
            py: 1
          }}>
            {params.row.tags.map((tag) => (
              <TagChip
                key={tag.id}
                label={highlightText(tag.name, searchValue)}
                color={tag.color}
              />
            ))}
          </Box>
        </Box>
      )
    }, {
      field: 'note',
      headerName: 'Note',
      width: 257,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ height: '100%', py: 1, display: 'flex', alignItems: 'center' }}>
          <Typography
            component={'p'}
            sx={{
              display: '-webkit-box',
              color: '#21272A',
              fontFamily: 'Roboto',
              fontSize: 12,
              lineHeight: '150%',
              textWrap: 'wrap',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>{highlightText(params.row.note, searchValue)}
          </Typography>
        </Box>
      )
    }, {
      field: 'createdAt',
      headerName: 'Time',
      flex: 1,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Typography sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          py: 1,
          color: '#21272A',
          fontFamily: 'Roboto',
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 400,
          textWrap: 'wrap'
        }}>{params.row.createdAt}</Typography>
      )
    }
  ]

  const EmptyStateOverlay = () => {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>點選右上角「+NEW」開始新增病患檔案</Typography>
        <Box sx={{ width: '100%', maxWidth: '500px', maxHeight: 'calc(100% - 60px)', aspectRatio: '1/1', position: 'relative' }}>
          <Image src={deleteConfirmImage} fill objectFit={'contain'} alt={'delete'}></Image>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ height: '100%', width: '100%', marginLeft: '-12px' }}>
        <ScrollBar
          height={'calc(100vh - 260px)'}
          fullHeight={!data || data.length === 0}
        >
          <Box
            sx={{
              height: '100%'
            }}
          >
            <DataGrid
              sx={{
                width: '100%',
                border: 'none',
                '& .MuiDataGrid-cell': {
                  border: 'none'
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontFamily: 'Roboto',
                  fontWeight: 600,
                  color: '#656565'
                },
                '& .MuiDataGrid-columnSeparator': {
                  display: 'none'
                },
                [`& .${gridClasses}, & .${gridClasses.cell}`]: {
                  outline: 'transparent'
                },
                [`& .${gridClasses.columnHeader}, & .${gridClasses['columnHeader--sortable']}, & .${gridClasses.withBorderColor}`]: {
                  border: 'none !important'
                },
                [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
                  outline: 'none',
                  fontWeight: 600
                }
              }}
              scrollbarSize={0}
              hideFooter
              columns={columns}
              rows={data}
              loading={isLoading}
              rowHeight={96}
              paginationMode={'server'}
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
              rowCount={rowCount}
              disableRowSelectionOnClick
              sortingMode={'server'}
              sortModel={sortModel}
              sortingOrder={['asc', 'desc']}
              onSortModelChange={setSortModel}
              onRowClick={(params) => openPatientDetailDialog(params.row.id)}
              columnHeaderHeight={data?.length === 0 ? 0 : 56}
              slots={{
                noRowsOverlay: () => <EmptyStateOverlay/>
              }}
            />
          </Box>
        </ScrollBar>
        <Box
          sx={{
            position: 'absolute',
            bottom: '12px',
            width: 'calc(100% - 48px)'
          }}
        >
          <StyledPagination
            count={Math.ceil(rowCount/paginationModel.pageSize)}
            variant={'outlined'}
            shape={'rounded'}
            page={paginationModel.page + 1}
            onChange={(event, currentPage) => {
              const pageItem = {
                page: currentPage - 1,
                pageSize: paginationModel.pageSize
              }
              setPaginationModel(pageItem)
            }}
            renderItem={(item) => {
              if (item.type === 'previous' || item.type === 'next') {
                return (
                  <PaginationItem
                    slots={{
                      previous: ArrowBackRoundedIcon,
                      next: ArrowForwardRoundedIcon
                    }}
                    {...item}
                  />
                )
              }
              return <PaginationItem {...item} />
            }}
          />
        </Box>
      </Box>
    </>
  )
})

export default PatientTable
PatientTable.displayName = 'PatientTable'
