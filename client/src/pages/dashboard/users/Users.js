import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useValue } from '../../../context/ContextProvider';
import { getUsers } from '../../../actions/user';
import moment from 'moment';
import { grey } from '@mui/material/colors';
import UsersActions from './UsersActions';

const Users = ({ setSelectedLink, link }) => {
  const {
    state: { users },
    dispatch,
  } = useValue();

  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editRowsModel, setEditRowsModel] = useState({});

  useEffect(() => {
    setSelectedLink(link);
    if (users.length === 0) {
      getUsers(dispatch).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [users.length, dispatch, setSelectedLink, link]);

  const handleEditRowsModelChange = (model) => {
    setEditRowsModel(model);
    const editedIds = Object.keys(model);
    if (editedIds.length > 0) {
      setRowId(editedIds[0]);
    } else {
      setRowId(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        field: 'photoURL',
        headerName: 'Avatar',
        width: 60,
        renderCell: (params) => <Avatar src={params.row.photoURL} />,
        sortable: false,
        filterable: false,
      },
      { field: 'name', headerName: 'Tên', width: 170 },
      { field: 'email', headerName: 'Email', width: 200 },
      {
        field: 'role',
        headerName: 'Vai trò',
        width: 100,
        type: 'singleSelect',
        valueOptions: ['basic', 'editor', 'admin'],
        editable: true,
      },
      {
        field: 'active',
        headerName: 'Hoạt động',
        width: 100,
        type: 'boolean',
        editable: true,
      },
      {
        field: 'createdAt',
        headerName: 'Thời gian tạo',
        width: 200,
        renderCell: (params) =>
          moment(params.row.createdAt).format('YYYY-MM-DD HH:MM:SS'),
      },
      { field: '_id', headerName: 'Id', width: 220 },
      {
        field: 'actions',
        headerName: 'Hành động',
        type: 'actions',
        renderCell: (params) => (
          <UsersActions {...{ params, rowId, setRowId }} />
        ),
      },
    ],
    [rowId]
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: 'center', mt: 3, mb: 3 }}
      >
        Quản lý người dùng
      </Typography>
      <DataGrid
        columns={columns}
        rows={users}
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5, 10, 20]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        editRowsModel={editRowsModel}
        onEditRowsModelChange={handleEditRowsModelChange}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? grey[200] : grey[900],
          },
        }}
      />
    </Box>
  );
};

export default Users;
