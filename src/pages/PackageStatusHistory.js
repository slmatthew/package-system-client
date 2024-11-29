import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useSnackbar } from '../components/SnackbarProvider';
import api from '../helpers/api';

const PackageStatusHistory = () => {
  const { tracking_number } = useParams(); // ID посылки из URL
  const showMessage = useSnackbar();
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusHistory = async () => {
      try {
        const response = await api.get(`/status-history/${tracking_number}`);
        setStatusHistory(response.data.result);
      } catch (err) {
        showMessage(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStatusHistory();
  }, [tracking_number, showMessage]);

  if (loading) {
    return <CircularProgress />;
  }

  if (statusHistory.length === 0) {
    return <Typography>No status history available for this package.</Typography>;
  }

  console.log(statusHistory)

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Отслеживание отправления {tracking_number}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {statusHistory.map((status) => (
            <TableRow key={status.id}>
              <TableCell>{status.status_value}</TableCell>
              <TableCell>{new Date(status.recorded_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default PackageStatusHistory;
