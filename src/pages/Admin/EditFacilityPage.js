import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../helpers/api';
import { useSnackbar } from '../../components/SnackbarProvider';

const EditFacilityPage = () => {
    const [facility, setFacility] = useState({ name: '', address: '' });
    const { id } = useParams();
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();

    useEffect(() => {
        fetchFacility(id);
    }, [id]);

    // Получаем информацию о складе по ID
    const fetchFacility = async (id) => {
        try {
            const response = await api.get(`/facilities/${id}`);
            setFacility(response.data);
        } catch (err) {
            console.error('Ошибка при получении склада:', err);
        }
    };

    // Обновление данных склада
    const handleUpdate = async () => {
        try {
            await api.put(`/facilities/${id}`, facility);
            navigate('/admin/facilities');  // Переходим обратно на страницу со списком
            showSnackbar('Информация успешно обновлена', 'success');
        } catch (err) {
            console.error('Ошибка при обновлении склада:', err);
            showSnackbar('Ошибка при обновлении склада', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFacility((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Container style={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Редактировать склад
            </Typography>
            <TextField
                fullWidth
                label="Название"
                name="name"
                value={facility.name}
                onChange={handleInputChange}
                style={{ marginBottom: '20px' }}
            />
            <TextField
                fullWidth
                label="Адрес"
                name="address"
                value={facility.address}
                onChange={handleInputChange}
                style={{ marginBottom: '20px' }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
            >
                Обновить склад
            </Button>
        </Container>
    );
};

export default EditFacilityPage;
