
import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const MobileLayoutWrapper = ({ children, maxWidth = '1200px' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: isMobile ? '100%' : maxWidth,
        margin: '0 auto',
        padding: isMobile ? 2 : 3,
        // Prevent horizontal scrolling
        overflowX: 'hidden',
        // Ensure content is readable on mobile
        '& .MuiCard-root, & .MuiPaper-root': {
          marginBottom: isMobile ? 2 : 3,
        },
        // Make tables scroll horizontally on mobile
        '& .MuiTableContainer-root': {
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        },
        // Adjust typography for mobile
        '& .MuiTypography-h4': {
          fontSize: isMobile ? '1.5rem' : '2rem',
        },
        '& .MuiTypography-h5': {
          fontSize: isMobile ? '1.25rem' : '1.5rem',
        },
        '& .MuiTypography-h6': {
          fontSize: isMobile ? '1.1rem' : '1.25rem',
        },
      }}
    >
      {children}
    </Box>
  );
};

export default MobileLayoutWrapper;