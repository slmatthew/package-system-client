import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, MenuItem } from '@mui/material';
import { useSnackbar } from '../SnackbarProvider';
import api from '../../helpers/api';

function EditPackageDialog({ open, onClose, currentPackage, fetchPackages, types }) {
  const showSnackbar = useSnackbar();

  const [formData, setFormData] = useState({
    tracking_number: '',
    sender_id: '',
    receiver_id: '',
    type_id: '',
    size_width: '',
    size_length: '',
    size_weight: '',
    cost: '',
  });

  // Загрузка данных в форму при открытии
  useEffect(() => {
    if (currentPackage) {
      setFormData({
        tracking_number: currentPackage.tracking_number || '',
        sender_id: currentPackage.sender_id || '',
        receiver_id: currentPackage.receiver_id || '',
        type_id: currentPackage.type_id || '',
        size_width: currentPackage.size_width || '',
        size_length: currentPackage.size_length || '',
        size_weight: currentPackage.size_weight || '',
        cost: currentPackage.cost || '',
      });
    }
  }, [currentPackage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await api.put(`/packages/${formData.tracking_number}`, formData);
      showSnackbar('Данные посылки успешно обновлены', 'success');
      await fetchPackages(); // Обновить список посылок
      onClose();
    } catch (err) {
      showSnackbar('Ошибка при обновлении данных посылки', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Редактирование посылки</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="dense"
          name="tracking_number"
          label="Трек-номер"
          value={formData.tracking_number}
          onChange={handleChange}
          disabled
        />
        <TextField
          fullWidth
          margin="dense"
          name="sender_id"
          label="ID отправителя"
          type="number"
          value={formData.sender_id}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="receiver_id"
          label="ID получателя"
          type="number"
          value={formData.receiver_id}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          select
          margin="dense"
          name="type_id"
          label="Тип посылки"
          value={formData.type_id}
          onChange={handleChange}
        >
          {types.map((type) => (
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
          type="number"
          value={formData.size_width}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="size_length"
          label="Длина (см)"
          type="number"
          value={formData.size_length}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="size_weight"
          label="Вес (кг)"
          type="number"
          value={formData.size_weight}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="dense"
          name="cost"
          label="Стоимость"
          type="number"
          value={formData.cost}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Отмена
        </Button>
        <Button onClick={handleSave} color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPackageDialog;
