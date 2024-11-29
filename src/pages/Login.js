import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../components/SnackbarProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';

function Login() {
  const { login, user } = useContext(AuthContext);
  const showSnackbar = useSnackbar();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async () => {
    try {
      await login({ username, password });
      showSnackbar('Вы вошли в аккаунт', 'success');
      navigate(from);
    } catch (err) {
      showSnackbar('Проверьте указанные данные', 'error');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if(user) return navigate(from);
    };

    checkAuth();
  }, [user, navigate, from]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Вход в аккаунт
      </Typography>
      <TextField
        label="Имя пользователя"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Пароль"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Войти
      </Button>
      <Button
        variant="text"
        onClick={() => navigate('/register')}
        fullWidth
      >
        Зарегистрироваться
      </Button>
    </Container>
  );
}

export default Login;
