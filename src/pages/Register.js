import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../components/SnackbarProvider';

import api from '../helpers/api';

const Register = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const showMessage = useSnackbar();
    
    useEffect(() => {
        if(user) return navigate('/');
    }, [user, navigate]);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
        const response = await api.post('/users/register', {
            first_name: formData.first_name,
            last_name: formData.last_name,
            address: formData.address,
            username: formData.username,
            password: formData.password,
        });

        console.log(response.data)

        showMessage('Регистрация прошла успешно. Пожалуйста, войдите в аккаунт', 'success');
        navigate('/login');
    } catch (err) {
        setError(err.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: '400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mt: 4,
      }}
    >
      <Typography variant="h4" textAlign="center">
        Регистрация
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Имя"
        name="first_name"
        type="text"
        value={formData.first_name}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Фамилия"
        name="last_name"
        type="text"
        value={formData.last_name}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Адрес"
        name="address"
        type="text"
        value={formData.address}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Имя пользователя"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Пароль"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Подтверждение пароля"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        fullWidth
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Зарегистрироваться
      </Button>
      <Button
        variant="text"
        onClick={() => navigate('/login')}
        fullWidth
      >
        Уже есть аккаунт?
      </Button>
    </Box>
  );
};

export default Register;
