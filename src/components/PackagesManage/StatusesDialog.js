import React, { useState, useEffect } from 'react';
import { FormControl, Typography, Button, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, InputLabel } from '@mui/material';
import { useSnackbar } from '../SnackbarProvider';
import api from '../../helpers/api';
import { useAuth } from '../../context/AuthContext';

function StatusesDialog({ open, onClose, trackingNumber, facilities }) {
    const [statuses, setStatuses] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [newFacility, setNewFacility] = useState('');
    const [loading, setLoading] = useState(true);
    const showSnackbar = useSnackbar();
    const { pkgStatuses } = useAuth();
  
    const handleAddStatus = async () => {
        try {
          const recorded_at = new Date().toISOString();
          const response = await api.post('/status-history', {
            tracking_number: trackingNumber,
            status_id: newStatus,
            facility_id: newFacility,
          });
      
          showSnackbar('Статус добавлен', 'success');
      
          // Обновляем только локальное состояние
          setStatuses((prevStatuses) => [
            ...prevStatuses,
            {
              id: response.data.status_history_id, // Новый ID из API
              status_value: pkgStatuses.find((s) => s.id === newStatus)?.value,
              facility_name: facilities.find((f) => f.id === newFacility)?.name,
              recorded_at,
            },
          ]);
      
          setNewStatus('');
          setNewFacility('');
        } catch (err) {
          showSnackbar('Не удалось добавить статус', 'error');
        }
    };
  
    const handleDeleteStatus = async (id) => {
        try {
          await api.delete(`/status-history/${id}`);
          showSnackbar('Статус удалён', 'success');
      
          // Локальное обновление массива
          setStatuses((prevStatuses) => prevStatuses.filter((status) => status.id !== id));
        } catch (err) {
          showSnackbar('Не удалось удалить статус', 'error');
        }
    };  
  
    useEffect(() => {
        const fetchStatuses = async () => {
          if (!hasFetched) {
            setLoading(true);
            try {
              const response = await api.get(`/status-history/${trackingNumber}`);
              setStatuses(response.data.result);
              setHasFetched(true); // Устанавливаем флаг
            } catch (err) {
              if (err.status === 404) {
                setStatuses([]);
              } else {
                showSnackbar('Не удалось загрузить статусы', 'error');
              }
            } finally {
              setLoading(false);
            }
          }
        };
      
        if (open) fetchStatuses();
    }, [open, trackingNumber, showSnackbar, hasFetched]);
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth={true}>
        <DialogTitle>Статусы для {trackingNumber}</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {statuses.map((status) => (
                <div key={status.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <Typography>
                    {status.status_value}&nbsp;
                    ({new Date(status.recorded_at).toLocaleString()}) 
                    в {status.facility_name}
                  </Typography>
                  <Button color="error" onClick={() => handleDeleteStatus(status.id)}>Удалить</Button>
                </div>
              ))}
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small" required>
                <InputLabel>Статус</InputLabel>
                <Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{ width: '200px' }}
                    >
                    {pkgStatuses.map((status) => (
                        <MenuItem key={status.id} value={status.id}>{status.value}</MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }} size="small" required>
                <InputLabel>Местонахождение</InputLabel>
                <Select
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    style={{ width: '200px' }}
                    >
                    {facilities.map((facility) => (
                        <MenuItem key={facility.id} value={facility.id}>{facility.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Закрыть</Button>
          <Button variant="contained" onClick={handleAddStatus}>Добавить</Button>
        </DialogActions>
      </Dialog>
    );
}

export default StatusesDialog;