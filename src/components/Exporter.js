import React from 'react';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import { useSnackbar } from '../components/SnackbarProvider';
import api from '../helpers/api';

const Exporter = ({ tableName }) => {
    const showSnackbar = useSnackbar();

    if(!['facilities', 'packages', 'package_statuses', 'package_types', 'status_history', 'users'].includes(tableName)) return;

    const handleExport = async () => {
        try {
            const response = await api.get(`/export/${tableName}`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
            saveAs(blob, `${tableName}.xlsx`);

            showSnackbar('Файл успешно сохранен', 'success');
        } catch(err) {
            console.error('Ошибка экспорта:', err);
            showSnackbar('Произошла ошибка', 'error');
        }
    };

    return (
        <Button variant="contained" color="primary" onClick={handleExport}>
            Экспорт в Excel
        </Button>
    );
};

export default Exporter;
