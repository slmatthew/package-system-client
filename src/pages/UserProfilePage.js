import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import api from '../helpers/api';
import { useSnackbar } from '../components/SnackbarProvider';
import { useAuth } from '../context/AuthContext';

const UserProfilePage = () => {
    const showSnackbar = useSnackbar();
    const { refreshUser } = useAuth();
    
    const [userData, setUserData] = useState({
        id: 0,
        first_name: '',
        last_name: '',
        username: '',
        address: '',
    });

    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Загрузка данных о пользователе
        const fetchUserData = async () => {
            try {
                const response = await api.get('/users/me');
                setUserData({
                    id: response.data.id,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    username: response.data.username,
                    address: response.data.address,
                });
            } catch (err) {
                console.error('Error fetching user data:', err);
                showSnackbar('Ошибка при загрузке данных пользователя', 'error');
            }
        };

        fetchUserData();
    }, [showSnackbar]);

    const handleUserDataChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateUserData = async () => {
        setLoading(true);
        try {
            await api.put(`/users/${userData.id}`, userData);
            refreshUser();
            showSnackbar('Данные успешно обновлены', 'success');
        } catch (err) {
            console.error('Error updating user data:', err);
            showSnackbar('Ошибка при обновлении данных', 'error');
        }
        setLoading(false);
    };

    const handleChangePassword = async () => {
        if (passwordData.new_password !== passwordData.confirm_password) {
            showSnackbar('Пароли не совпадают', 'error');
            return;
        }

        setLoading(true);
        try {
            await api.patch(`/users/password/${userData.id}`, {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password,
            });
            showSnackbar('Пароль успешно изменен', 'success');
        } catch (err) {
            console.error('Error changing password:', err);
            showSnackbar('Ошибка при изменении пароля', 'error');
        }
        setLoading(false);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Редактирование профиля</Typography>

            {/* Форма редактирования данных */}
            <Box component="form" noValidate autoComplete="off" marginBottom="20px">
                <TextField
                    fullWidth
                    margin="normal"
                    label="Имя"
                    name="first_name"
                    value={userData.first_name}
                    onChange={handleUserDataChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Фамилия"
                    name="last_name"
                    value={userData.last_name}
                    onChange={handleUserDataChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Имя пользователя"
                    name="username"
                    value={userData.username}
                    onChange={handleUserDataChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Адрес"
                    name="address"
                    value={userData.address}
                    onChange={handleUserDataChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateUserData}
                    disabled={loading}
                    style={{ marginTop: '20px' }}
                >
                    Обновить данные
                </Button>
            </Box>

            {/* Форма изменения пароля */}
            <Typography variant="h5" gutterBottom>Изменить пароль</Typography>
            <Box component="form" noValidate autoComplete="off">
                <TextField
                    fullWidth
                    margin="normal"
                    label="Старый пароль"
                    type="password"
                    name="old_password"
                    value={passwordData.old_password}
                    onChange={handlePasswordChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Новый пароль"
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Подтверждение пароля"
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleChangePassword}
                    disabled={loading}
                    style={{ marginTop: '20px' }}
                >
                    Изменить пароль
                </Button>
            </Box>
        </Container>
    );
};

export default UserProfilePage;
