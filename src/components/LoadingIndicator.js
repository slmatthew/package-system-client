import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingIndicator = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f9'
      }}
    >
      <CircularProgress color="primary" size={60} thickness={4} />
      <Typography 
        variant="h6" 
        sx={{ marginTop: 2, color: '#555' }}
      >
        Пожалуйста, подождите...
      </Typography>
    </Box>
  );
};

export default LoadingIndicator;
