import React, { useEffect, useState, useCallback } from 'react';
import { useSnackbar } from '../../components/SnackbarProvider';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    TextField,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import api from '../../helpers/api';

function PackageStatuses() {
    const [value, setValue] = useState('');
    const [statuses, setStatuses] = useState([]);
    const [editStatus, setEditStatus] = useState(null); // Для хранения редактируемого статуса
    const [deleteStatus, setDeleteStatus] = useState(null); // Для хранения удаляемого статуса
    const [loading, setLoading] = useState(false); // Для индикатора загрузки
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!value.trim()) {
            showSnackbar('Введите название статуса', 'error');
            return;
        }

        try {
            await api.post('/package-statuses', { value: value.trim() });
            showSnackbar('Добавлен новый статус', 'success');
            setValue(''); // Очистить поле ввода после успешного добавления
            fetchStatuses();
        } catch (err) {
            showSnackbar(err.message, 'error');
        }
    };

    const handleEditSubmit = async () => {
        if (!editStatus?.value.trim()) {
            showSnackbar('Введите название статуса', 'error');
            return;
        }

        try {
            await api.put(`/package-statuses/${editStatus.id}`, { value: editStatus.value.trim() });
            showSnackbar('Статус обновлён', 'success');
            setEditStatus(null);
            fetchStatuses();
        } catch (err) {
            showSnackbar(err.message, 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/package-statuses/${deleteStatus.id}`);
            showSnackbar('Статус удалён', 'success');
            setDeleteStatus(null);
            fetchStatuses();
        } catch (err) {
            showSnackbar(err.message, 'error');
        }
    };

    const fetchStatuses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/package-statuses');
            setStatuses(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
                showSnackbar('Необходимо выполнить повторный вход', 'error');
            } else {
                showSnackbar('Не удалось загрузить статусы', 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [showSnackbar, navigate]);

    useEffect(() => {
        fetchStatuses();
    }, [fetchStatuses]);

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Статусы отправлений
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Название статуса"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                    Добавить
                </Button>
            </form>
            {loading ? (
                <CircularProgress style={{ marginTop: '20px' }} />
            ) : (
                <List>
                    {statuses.map((status) => (
                        <ListItem key={status.id}>
                            <ListItemText primary={status.value} secondary={`ID: ${status.id}`} />
                            <Button
                                color="primary"
                                onClick={() => setEditStatus({ ...status })} // Открыть диалог редактирования
                            >
                                Изменить
                            </Button>
                            <Button
                                color="secondary"
                                onClick={() => setDeleteStatus(status)} // Открыть диалог удаления
                            >
                                Удалить
                            </Button>
                        </ListItem>
                    ))}
                </List>
            )}

            {/* Диалог редактирования */}
            <Dialog open={!!editStatus} onClose={() => setEditStatus(null)}>
                <DialogTitle>Изменить статус</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название статуса"
                        value={editStatus?.value || ''}
                        onChange={(e) => setEditStatus({ ...editStatus, value: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditStatus(null)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог подтверждения удаления */}
            <Dialog open={!!deleteStatus} onClose={() => setDeleteStatus(null)}>
                <DialogTitle>Удалить статус?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить статус &quot;{deleteStatus?.value}&quot;?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteStatus(null)} color="error">
                        Отмена
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="primary">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default PackageStatuses;
