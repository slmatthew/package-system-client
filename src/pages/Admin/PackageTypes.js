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
import Exporter from '../../components/Exporter';
import api from '../../helpers/api';

function PackageTypes() {
    const [value, setValue] = useState('');
    const [types, setTypes] = useState([]);
    const [editType, setEditType] = useState(null); // Для хранения редактируемого статуса
    const [deleteType, setDeleteType] = useState(null); // Для хранения удаляемого статуса
    const [loading, setLoading] = useState(false); // Для индикатора загрузки
    const showSnackbar = useSnackbar();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!value.trim()) {
            showSnackbar('Введите название типа', 'error');
            return;
        }

        try {
            await api.post('/package-types', { value: value.trim() });
            showSnackbar('Добавлен новый тип', 'success');
            setValue(''); // Очистить поле ввода после успешного добавления
            fetchTypes();
        } catch (err) {
            showSnackbar(err.message, 'error');
        }
    };

    const handleEditSubmit = async () => {
        if (!editType?.value.trim()) {
            showSnackbar('Введите название типа', 'error');
            return;
        }

        try {
            await api.put(`/package-types/${editType.id}`, { value: editType.value.trim() });
            showSnackbar('Тип обновлён', 'success');
            setEditType(null);
            fetchTypes();
        } catch (err) {
            showSnackbar(err.message, 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/package-types/${deleteType.id}`);
            showSnackbar('Тип удалён', 'success');
            setDeleteType(null);
            fetchTypes();
        } catch (err) {
            showSnackbar(err.message, 'error');
        }
    };

    const fetchTypes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/package-types');
            setTypes(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                navigate('/login');
                showSnackbar('Необходимо выполнить повторный вход', 'error');
            } else {
                showSnackbar('Не удалось загрузить типы', 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [showSnackbar, navigate]);

    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Типы отправлений
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Название типа"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                    Добавить
                </Button>
            </form>
            <Exporter tableName="package_types" />
            {loading ? (
                <CircularProgress style={{ marginTop: '20px' }} />
            ) : (
                <List>
                    {types.map((type) => (
                        <ListItem key={type.id}>
                            <ListItemText primary={type.value} secondary={`ID: ${type.id}`} />
                            <Button
                                color="primary"
                                onClick={() => setEditType({ ...type })} // Открыть диалог редактирования
                            >
                                Изменить
                            </Button>
                            <Button
                                color="secondary"
                                onClick={() => setDeleteType(type)} // Открыть диалог удаления
                            >
                                Удалить
                            </Button>
                        </ListItem>
                    ))}
                </List>
            )}

            {/* Диалог редактирования */}
            <Dialog open={!!editType} onClose={() => setEditType(null)}>
                <DialogTitle>Изменить тип</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Название типа"
                        value={editType?.value || ''}
                        onChange={(e) => setEditType({ ...editType, value: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditType(null)} color="secondary">
                        Отмена
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог подтверждения удаления */}
            <Dialog open={!!deleteType} onClose={() => setDeleteType(null)}>
                <DialogTitle>Удалить тип?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить тип &quot;{deleteType?.value}&quot;?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteType(null)} color="error">
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

export default PackageTypes;
