import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Container, Typography, TextField, Button, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import StatusesDialog from '../../components/PackagesManage/StatusesDialog';
import DeletePackageDialog from '../../components/PackagesManage/DeletePackageDialog';
import EditPackageDialog from '../../components/PackagesManage/EditPackageDialog';
import { useSnackbar } from '../../components/SnackbarProvider';
import api from '../../helpers/api';
import { useAuth } from '../../context/AuthContext';

function PackagesManage() {
  const [packages, setPackages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null); // Для управления статусами
  const [statusesDialogOpen, setStatusesDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const searchInputRef = useRef(null); // useRef для управления фокусом
  const { expiredToken } = useAuth();
  const showSnackbar = useSnackbar();

  const filteredPackages = packages.filter(item => {
    if(selectedType > 0 && item.type_id !== selectedType) return false;

    return item.tracking_number.includes(searchQuery) ||
          (item.sender_name.toLowerCase().includes(searchQuery) || item.receiver_name?.toLowerCase().includes(searchQuery))
  });

  // Получение списка посылок
  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/packages');
      setPackages(response.data.result);
    } catch (err) {
      if(expiredToken(err)) return;
      showSnackbar('Не удалось загрузить посылки', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar, expiredToken]);

  // Получение типов посылок
  const fetchTypes = useCallback(async () => {
    try {
      const response = await api.get('/package-types');
      setTypes(response.data);
    } catch (err) {
      if(expiredToken(err)) return;
      showSnackbar('Не удалось загрузить типы посылок', 'error');
    }
  }, [expiredToken, showSnackbar]);

  const fetchFacilities = useCallback(async () => {
    try {
        const result = await api.get('/facilities');
        setFacilities(result.data);
    } catch(err) {
        if(expiredToken(err)) return;
        showSnackbar('Не удалось загрузить список складов', 'error');
    }
  }, [expiredToken, showSnackbar]);

  useEffect(() => {
    fetchPackages();
    fetchTypes();
    fetchFacilities();
  }, [fetchFacilities, fetchPackages, fetchTypes]);

  // Открыть диалог статусов
  const handleViewStatuses = (pkg) => {
    setSelectedPackage(pkg);
    setStatusesDialogOpen(true);
  };

  // Закрыть диалог статусов
  const handleCloseStatusesDialog = () => {
    setStatusesDialogOpen(false);
    setSelectedPackage(null);
  };

  const handleDeletePackage = (pkg) => {
    setSelectedPackage(pkg);
    setDeleteDialogOpen(true);
  };

  const handleCancelDeletePackage = (deleted = false) => {
    setDeleteDialogOpen(false);
    setSelectedPackage(null);

    if(deleted) fetchPackages();
  };

  const handleEditPackage = (pkg) => {
    setSelectedPackage(pkg);
    setEditDialogOpen(true);
  };

  const handleCancelEditPackage = () => {
    setEditDialogOpen(false);
    setSelectedPackage(null);
  };

  if (loading) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '20px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>Управление посылками</Typography>
      
      {/* Панель поиска и фильтров */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <TextField
          label="Поиск (трек-номер, имя отправителя, получателя)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          inputRef={searchInputRef}
          autoFocus
        />
        <Select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          displayEmpty
          style={{ width: '200px' }}
        >
          <MenuItem value="">Все типы</MenuItem>
          {types.map((type) => (
            <MenuItem key={type.id} value={type.id}>{type.value}</MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={fetchPackages}>Обновить</Button>
      </div>

      {/* Таблица с посылками */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Трек-номер</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Отправитель</TableCell>
              <TableCell>Получатель</TableCell>
              <TableCell>Последний статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPackages.map((pkg) => (
              <TableRow key={pkg.tracking_number}>
                <TableCell>{pkg.tracking_number}</TableCell>
                <TableCell>{pkg.package_type}</TableCell>
                <TableCell>{pkg.sender_name || '—'}</TableCell>
                <TableCell>{pkg.receiver_name || '—'}</TableCell>
                <TableCell>{pkg.last_status || '—'}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleViewStatuses(pkg)}>Статусы</Button>
                  <Button style={{ marginLeft: 5 }} variant="outlined" color="info" onClick={() => handleEditPackage(pkg)}>Изменить</Button>
                  <Button style={{ marginLeft: 5 }} variant="outlined" color="error" onClick={() => handleDeletePackage(pkg)}>Удалить</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог статусов */}
      {selectedPackage && (
        <StatusesDialog
          open={statusesDialogOpen}
          onClose={handleCloseStatusesDialog}
          trackingNumber={selectedPackage.tracking_number}
          facilities={facilities}
        />
      )}
      {selectedPackage && (
        <DeletePackageDialog
          open={deleteDialogOpen}
          onClose={handleCancelDeletePackage}
          currentPackage={selectedPackage}
        />
      )}
      {selectedPackage && (
        <EditPackageDialog
          open={editDialogOpen}
          onClose={handleCancelEditPackage}
          currentPackage={selectedPackage}
          fetchPackages={fetchPackages}
          types={types}
        />
      )}
    </Container>
  );
}

export default PackagesManage;
