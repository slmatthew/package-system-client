import React, { useState, useEffect, useCallback, useContext } from 'react';
import api from '../helpers/api';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/SnackbarProvider';
import { Container, Typography, List, ListItem, ListItemText, Button, CircularProgress } from '@mui/material';
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
        showSnackbar('Failed to fetch packages', 'error');
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

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Мои посылки&nbsp;
        <Button variant="text" onClick={fetchPackages}>
          Обновить
        </Button>
      </Typography>
      <List>
        {packages.map((pkg, i) => (
          <ListItem key={i}>
            <ListItemText
              primary={`${formattedTypes[pkg.type_id]} (${pkg.tracking_number})`}
              secondary={`${pkg.size_weight}кг`}
            />
            <Button onClick={() => navigate(`/status-history/${pkg.tracking_number}`)}>перейти</Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Packages;
