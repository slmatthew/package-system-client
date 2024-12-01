import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../helpers/api';
import { useSnackbar } from '../../components/SnackbarProvider';

const CreateFacilityPage = () => {
    const [facility, setFacility] = useState({ name: '', address: '' });
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();

    const handleCreate = async () => {
        try {
            await api.post('/facilities', facility);
            navigate('/admin/facilities');
            showSnackbar(`${facility.name} успешно добавлен в систему`, 'success');
        } catch (err) {
            console.error('Ошибка при создании склада:', err);
            showSnackbar('Ошибка при создании склада', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFacility((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Container style={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Новый склад
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
                onClick={handleCreate}
            >
                Создать склад
            </Button>
        </Container>
    );
};

export default CreateFacilityPage;
