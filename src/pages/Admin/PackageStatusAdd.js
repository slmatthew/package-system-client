import React, { useState } from 'react';
import { useSnackbar } from '../../components/SnackbarProvider';
import { Container, TextField, Button, Typography } from '@mui/material';
import api from '../../helpers/api';

function PackageStatusAdd() {
    const [value, setValue] = useState('');
    const showSnackbar = useSnackbar();

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
        } catch (err) {
            showSnackbar(err.message, 'error');
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
            <Typography variant="h5" gutterBottom>
                Добавить новый статус
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
        </Container>
    );
}

export default PackageStatusAdd;
