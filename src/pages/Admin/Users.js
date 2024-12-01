import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import api from '../../helpers/api';
import { useSnackbar } from '../../components/SnackbarProvider';

function Users() {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editUser, setEditUser] = useState({ first_name: '', last_name: '', username: '', role: '' });
    const showSnackbar = useSnackbar();

    // Функция для получения пользователей
    const fetchUsers = useCallback(async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            showSnackbar('Не удалось загрузить пользователей', 'error');
        }
    }, [showSnackbar]);

    // Функция для открытия диалога редактирования пользователя
    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditUser({ ...user });
        setOpenDialog(true);
    };

    // Функция для закрытия диалога редактирования
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUser(null);
    };

    // Функция для сохранения изменений пользователя
    const handleSave = async () => {
        try {
            await api.put(`/users/${selectedUser.id}`, editUser);
            showSnackbar('Пользователь обновлён', 'success');
            fetchUsers();  // Обновляем список пользователей
            handleCloseDialog();
        } catch (err) {
            showSnackbar('Не удалось обновить пользователя', 'error');
        }
    };

    // Функция для удаления пользователя
    const handleDelete = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            showSnackbar('Пользователь удалён', 'success');
            fetchUsers();  // Обновляем список пользователей
        } catch (err) {
            showSnackbar('Не удалось удалить пользователя', 'error');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <Container maxWidth="md" style={{ marginTop: '20px' }}>
            <h2>Управление пользователями</h2>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Имя</TableCell>
                            <TableCell>Фамилия</TableCell>
                            <TableCell>Логин</TableCell>
                            <TableCell>Роль</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.first_name}</TableCell>
                                <TableCell>{user.last_name}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={() => handleEdit(user)}>Редактировать</Button>
                                    <Button color="secondary" onClick={() => handleDelete(user.id)}>Удалить</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Диалог редактирования пользователя */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Редактирование пользователя</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Имя"
                        value={editUser.first_name}
                        onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Фамилия"
                        value={editUser.last_name}
                        onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Логин"
                        value={editUser.username}
                        onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Роль"
                        value={editUser.role}
                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Users;
