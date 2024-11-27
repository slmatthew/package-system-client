import React, { useState, useEffect, useCallback } from 'react';
import api from '../helpers/api';
import { useSnackbar } from '../components/SnackbarProvider';
import { Container, Typography, List, ListItem, ListItemText, Button, CircularProgress } from '@mui/material';

function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbar();

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/packages/my');
      setPackages(response.data.result);
    } catch (err) {
      showSnackbar('Failed to fetch packages', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

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
        My Packages
      </Typography>
      <List>
        {packages.map((pkg) => (
          <ListItem key={pkg.id}>
            <ListItemText
              primary={`Package ID: ${pkg.id}`}
              secondary={`Status: ${pkg.status}, Weight: ${pkg.weight}kg`}
            />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" onClick={fetchPackages}>
        Refresh
      </Button>
    </Container>
  );
}

export default Packages;
