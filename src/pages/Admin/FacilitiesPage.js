import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Exporter from '../../components/Exporter';
import api from '../../helpers/api';

const FacilitiesPage = () => {
    const [facilities, setFacilities] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);  // Состояние для открытия/закрытия диалога
    const [facilityToDelete, setFacilityToDelete] = useState(null);  // Состояние для хранения id склада для удаления
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchFacilities();
    }, []);

    // Получаем список складов
    const fetchFacilities = async () => {
        try {
            const response = await api.get('/facilities');
            setFacilities(response.data);
        } catch (err) {
            console.error('Ошибка при получении складов:', err);
        }
    };

    // Открытие диалога подтверждения удаления
    const handleOpenDialog = (id) => {
        setFacilityToDelete(id);
        setOpenDialog(true);
    };

    // Закрытие диалога без удаления
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFacilityToDelete(null);
    };

    // Удаление склада
    const handleDelete = async () => {
        try {
            await api.delete(`/facilities/${facilityToDelete}`);
            fetchFacilities();  // Обновляем список складов после удаления
            handleCloseDialog();  // Закрываем диалог
        } catch (err) {
            console.error('Ошибка при удалении склада:', err);
        }
    };

    return (
        <Container style={{ marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Список складов
            </Typography>
            {user.role === 'admin' && (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/admin/facilities/new')} // Переход к форме создания нового склада
                        style={{ marginRight: '10px' }}
                    >
                        Добавить склад
                    </Button>
                    <Exporter tableName="facilities" />
                </>
            )}

            <TableContainer style={{ marginTop: '20px' }} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell>Адрес</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {facilities.map((facility) => (
                            <TableRow key={facility.id}>
                                <TableCell>{facility.name}</TableCell>
                                <TableCell>{facility.address}</TableCell>
                                <TableCell>
                                    {user?.role === 'admin' && (
                                        <>
                                            <IconButton onClick={() => navigate(`/admin/facilities/edit/${facility.id}`)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleOpenDialog(facility.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Диалог подтверждения удаления */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>Подтвердите удаление</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить этот склад?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default FacilitiesPage;
