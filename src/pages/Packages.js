import React, { useState, useEffect, useCallback, useContext } from 'react';
import api from '../helpers/api';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarProvider';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Chip } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

function Packages() {
  const { pkgTypes } = useContext(AuthContext);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const formattedTypes = pkgTypes.reduce((acc, item) => {
    acc[item.id] = item.value;
    return acc;
  }, {});

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

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Мои посылки&nbsp;
        <Button variant="text" onClick={fetchPackages}>
          Обновить
        </Button>
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Тип</TableCell>
              <TableCell>Отправитель</TableCell>
              <TableCell>Получатель</TableCell>
              <TableCell>Вес</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packages.map((pkg, i) => (
              <TableRow key={i}>
                <TableCell>{formattedTypes[pkg.type_id]}</TableCell>
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
