import React, { useState, useEffect, useCallback } from 'react';
import api from '../helpers/api';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarProvider';
import { TextField, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Chip } from '@mui/material';

function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/packages/my');
      setPackages(response.data.result);
    } catch (err) {
      if(err.response?.status === 401) {
        navigate('/login');
        showSnackbar('Необходимо выполнить повторный вход', 'error');
      } else {
        showSnackbar('Не удалось загрузить посылки', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [showSnackbar, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 8:
        return 'success';
      case 4: case 3: case 5:
        return 'warning';
      case 7:
        return 'error';
      default:
        return 'default';
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Фильтрация пользователей
  const filteredPackages = packages.filter((item) =>
    [item.tracking_number, item.sender_name, item.receiver_name, item.package_type]
      .some((field) => field.toLowerCase().includes(searchTerm))
  );

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  if (loading) {
    return (
      <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '20px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Мои посылки&nbsp;
        <Button variant="text" onClick={fetchPackages}>
          Обновить
        </Button>
        <Button variant="text" onClick={() => navigate('/packages/new')}>
          Отправить
        </Button>
      </Typography>
      <TextField
          label="Поиск"
          variant="outlined"
          onChange={handleSearchChange}
          fullWidth
      />
      <TableContainer style={{ marginTop: 15 }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Трек-номер</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Отправитель</TableCell>
              <TableCell>Получатель</TableCell>
              <TableCell>Вес</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPackages.map((pkg, i) => (
              <TableRow key={i}>
                <TableCell>{pkg.tracking_number}</TableCell>
                <TableCell>{pkg.package_type}</TableCell>
                <TableCell>{pkg.sender_name}</TableCell>
                <TableCell>{pkg.receiver_name}</TableCell>
                <TableCell>{pkg.size_weight} кг</TableCell>
                <TableCell>
                  <Chip label={pkg.last_status} color={getStatusColor(pkg.last_status_id)} />
                </TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/tracking/${pkg.tracking_number}`)} variant="outlined">Отслеживание</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Packages;
