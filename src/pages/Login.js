import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSnackbar } from '../components/SnackbarProvider';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';

function Login() {
  const { login } = useContext(AuthContext);
  const showSnackbar = useSnackbar();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await login({ username, password });
      showSnackbar('Login successful!', 'success');
      navigate('/packages');
    } catch (err) {
      showSnackbar('Login failed. Please check your credentials.', 'error');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Login
      </Button>
    </Container>
  );
}

export default Login;
