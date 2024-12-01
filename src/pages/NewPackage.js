import React, { useState } from 'react';
import { Box, Container, TextField, Typography, MenuItem, Button, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../components/SnackbarProvider';
import api from '../helpers/api';
import { useNavigate } from 'react-router-dom';

function NewPackage() {
    const showSnackbar = useSnackbar();
    const { user, pkgTypes } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        tracking_number: '',
        sender_id: user?.id || null,  // Default to logged-in user's ID
        receiver_id: '',
        type_id: '',
        size_width: '',
        size_length: '',
        size_weight: '',
        cost: ''
    });

    const [errors, setErrors] = useState({}); // For form validation

    const handleCreatePackage = async () => {
        // Basic validation
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (!formData[key] && key !== 'receiver_id') {
                newErrors[key] = 'Это поле обязательно';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const result = await api.post('/packages', formData);
            showSnackbar(`Вы успешно добавили отправление ${result.data.tracking_number}`, 'success');
            navigate('/packages');
        } catch (err) {
            console.error('create package err', err);
            showSnackbar('Ошибка при создании отправления', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Container style={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Новое отправление
            </Typography>
            
            <Box
                component="form"
                noValidate
                autoComplete="off"
            >
                <TextField
                    fullWidth
                    margin="dense"
                    name="tracking_number"
                    label="Трек-номер"
                    value={formData.tracking_number}
                    onChange={handleInputChange}
                    error={!!errors.tracking_number}
                    helperText={errors.tracking_number}
                    required
                />
                <TextField
                    fullWidth
                    margin="dense"
                    name="sender_id"
                    label="ID отправителя"
                    value={formData.sender_id}
                    onChange={handleInputChange}
                    error={!!errors.sender_id}
                    helperText={errors.sender_id}
                    required
                    disabled={user.role === 'user'}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    name="receiver_id"
                    label="ID получателя"
                    value={formData.receiver_id}
                    onChange={handleInputChange}
                    error={!!errors.receiver_id}
                    helperText={errors.receiver_id}
                />
                <TextField
                    select
                    fullWidth
                    margin="dense"
                    name="type_id"
                    label="Тип посылки"
                    value={formData.type_id}
                    onChange={handleInputChange}
                    error={!!errors.type_id}
                    helperText={errors.type_id}
                    required
                >
                    {pkgTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                            {type.value}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    margin="dense"
                    name="size_width"
                    label="Ширина (см)"
                    value={formData.size_width}
                    onChange={handleInputChange}
                    error={!!errors.size_width}
                    helperText={errors.size_width}
                    required
                />
                <TextField
                    fullWidth
                    margin="dense"
                    name="size_length"
                    label="Длина (см)"
                    value={formData.size_length}
                    onChange={handleInputChange}
                    error={!!errors.size_length}
                    helperText={errors.size_length}
                    required
                />
                <TextField
                    fullWidth
                    margin="dense"
                    name="size_weight"
                    label="Вес (кг)"
                    value={formData.size_weight}
                    onChange={handleInputChange}
                    error={!!errors.size_weight}
                    helperText={errors.size_weight}
                    required
                />
                <TextField
                    fullWidth
                    margin="dense"
                    name="cost"
                    label="Стоимость"
                    value={formData.cost}
                    onChange={handleInputChange}
                    error={!!errors.cost}
                    helperText={errors.cost}
                    required
                />
                
                {/* Submit Button */}
                <Stack direction="row" justifyContent="flex-end" style={{ marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreatePackage}
                    >
                        Создать отправление
                    </Button>
                </Stack>
            </Box>
        </Container>
    );
}

export default NewPackage;
