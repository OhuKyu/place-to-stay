import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Tooltip, Typography } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useValue } from '../../../context/ContextProvider';
import { getRooms } from '../../../actions/room';
import moment from 'moment';
import { grey } from '@mui/material/colors';
import RoomsActions from './RoomsActions';
import isAdmin from '../utils/isAdmin';

const Rooms = ({ setSelectedLink, link }) => {
  const {
    state: { rooms, currentUser },
    dispatch,
  } = useValue()

  const [pageSize, setPageSize] = useState(5)

  useEffect(() => {
    setSelectedLink(link)
    if (rooms.length === 0) getRooms(dispatch)
  }, [])

  const columns = useMemo(
    () => [
      {
        field: 'images',
        headerName: 'Ảnh',
        width: 70,
        renderCell: (params) => (
          <Avatar src={params.row.images[0]} variant="rounded" />
        ),
        sortable: false,
        filterable: false,
      },
      {
        field: 'price',
        headerName: 'Giá',
        width: 70,
        renderCell: (params) => '$' + params.row.price,
      },
      { field: 'title', headerName: 'Tiêu đề', width: 170 },
      { field: 'description', headerName: 'Miêu tả', width: 200 },
      { field: 'lng', headerName: 'Kinh độ', width: 110 },
      { field: 'lat', headerName: 'Vĩ độ', width: 110 },

      {
        field: 'uName',
        headerName: 'Thêm bởi',
        width: 80,
        renderCell: (params) => (
          <Tooltip title={params.row.uName}>
            <Avatar src={params.row.uPhoto} />
          </Tooltip>
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Được tạo tại',
        width: 200,
        renderCell: (params) =>
          moment(params.row.createdAt).format('YYYY-MM-DD HH:MM:SS'),
      },
      { field: '_id', hide: true },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        width: 150,
        renderCell: (params) => <RoomsActions {...{ params }} />,
      },
    ],
    []
  );

  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: 'center', mt: 3, mb: 3 }}
      >
        Quản lý phòng
      </Typography>
      <DataGrid
        columns={columns}
        rows={
          isAdmin(currentUser)
            ? rooms
            : rooms.filter((room) => room.uid === currentUser.id)
        }
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? grey[200] : grey[900],
          },
        }}
      />
    </Box>
  )
}

export default Rooms;
