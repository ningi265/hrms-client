import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="100vh"
    sx={{ backgroundColor: 'background.default' }}
  >
    <CircularProgress />
  </Box>
);

export default LoadingSpinner;
