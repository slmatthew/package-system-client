import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Delete, Edit, Refresh, Search, Password } from '@mui/icons-material';
import Exporter from '../../components/Exporter';
import { useSnackbar } from '../../components/SnackbarProvider';
import api from '../../helpers/api';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [formValues, setFormValues] = useState({
    first_name: '',
    last_name: '',
    username: '',
    address: '',
    role: '',
  });

  const showSnackbar = useSnackbar();

  // Загрузка списка пользователей
  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Произошла ошибка при получении списка пользователей', 'error');
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Обновление формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Открытие диалога редактирования
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormValues(user);
    setEditDialogOpen(true);
  };

  // Сохранение изменений
  const handleSave = async () => {
    try {
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, formValues);
        showSnackbar('Информация о пользователе обновлена', 'success');
      } else {
        console.error('no user selected');
      }
      setEditDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('error update: ', error);
      showSnackbar('Ошибка при обновлении информации о пользователе', 'error');
    }
  };

  // Удаление пользователя
  const handleDeleteOpen = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${selectedUser.id}`);
      showSnackbar(`Пользователь ${selectedUser.id} удален`, 'success');
      setDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('delete error', error);
      showSnackbar('Ошибка при удалении пользователя', 'error');
    }
  };

  const handlePasswordOpen = (user) => {
    setSelectedUser(user);
    setGeneratedPassword('');
    setPasswordDialogOpen(true);
  };

  const handlePasswordReset = async () => {
      const generateRandomPassword = () =>
        Array.from({ length: Math.floor(Math.random() * 3) + 6 }, () =>
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          .charAt(Math.floor(Math.random() * 62))
        ).join('');

      try {
        const new_password = generateRandomPassword();

        await api.patch(`/users/password/${selectedUser.id}`, { old_password: 'SLMATTHEW', new_password });
        setGeneratedPassword(new_password);
        showSnackbar(`Пароль ${selectedUser.username} успешно сброшен`, 'success');
      } catch(err) {
        console.error('update password err', err);
        showSnackbar('Ошибка при сбросе пароля', 'error');
      }
  };

  // Обновление строки поиска
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Фильтрация пользователей
  const filteredUsers = users.filter((user) =>
    [user.id.toString(), user.first_name, user.last_name, user.username, user.address]
      .some((field) => field.toLowerCase().includes(searchTerm))
  );
  

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Управление пользователями
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        {/* Поле поиска */}
        <TextField
          label="Поиск"
          variant="outlined"
          slotProps={{
            input: <Search style={{ marginRight: 8 }} />,
          }}
          onChange={handleSearchChange}
          style={{ flex: 1, marginRight: 16 }}
        />

        {/* Кнопка обновления */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<Refresh />}
          onClick={fetchUsers}
          style={{ marginRight: 10 }}
        >
          Обновить список
        </Button>
        <Exporter tableName="users" />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Фамилия</TableCell>
              <TableCell>Логин</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handlePasswordOpen(user)}>
                    <Password />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteOpen(user)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Сброс пароля */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Сброс пароля</DialogTitle>
        <DialogContent>
          {generatedPassword.length === 0 && (
            <span>Вы действительно хотите сбросить пароль {selectedUser?.username}?</span>
          )}
          {generatedPassword.length > 0 && (
            <span>Новый пароль {selectedUser?.username}: {generatedPassword}</span>
          )}
        </DialogContent>
        <DialogActions>
          {generatedPassword.length === 0 && (
            <>
              <Button onClick={() => setPasswordDialogOpen(false)}>Отмена</Button>
              <Button onClick={handlePasswordReset} color="error">
                Сбросить
              </Button>
            </>
          )}
          {generatedPassword.length > 0 && (
            <Button onClick={() => setPasswordDialogOpen(false)}>Закрыть</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Редактирование пользователя</DialogTitle>
        <DialogContent>
          <TextField
            label="Имя"
            name="first_name"
            value={formValues.first_name}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Фамилия"
            name="last_name"
            value={formValues.last_name}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Логин"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Адрес"
            name="address"
            value={formValues.address}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <Select
            label="Роль"
            name="role"
            value={formValues.role}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          >
            <MenuItem value="user">Пользователь</MenuItem>
            <MenuItem value="sorter">Сортировщик</MenuItem>
            <MenuItem value="admin">Админ</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleSave} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Удаление пользователя</DialogTitle>
        <DialogContent>
          <Typography>
            Вы действительно хотите удалить пользователя{" "}
            <strong>{selectedUser?.username}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleDelete} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
