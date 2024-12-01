import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControlLabel, Checkbox } from '@mui/material';
import { useSnackbar } from '../SnackbarProvider';
import api from '../../helpers/api';

function DeletePackageDialog({ open, onClose, currentPackage }) {
    const showSnackbar = useSnackbar();

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/packages/${currentPackage.tracking_number}/permanent`);
            showSnackbar(`Отправление ${currentPackage.tracking_number} успешно удалено`, 'success');

            onClose(true);
        } catch (err) {
            showSnackbar(`Ошибка при удалении отправления ${currentPackage.tracking_number}`, 'error');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Удаление отправления {currentPackage.tracking_number}</DialogTitle>
            <DialogContent>
                Вы действительно хотите удалить отправление {currentPackage.tracking_number}?
                <FormControlLabel disabled control={<Checkbox checked={true} />} label="Перманентное удаление" />
            </DialogContent>
            <DialogActions>
                <Button color="error" onClick={onClose}>Отмена</Button>
                <Button onClick={handleDeleteConfirm}>Удалить</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeletePackageDialog;