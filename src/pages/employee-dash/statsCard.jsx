import React from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { 
  ShoppingCart, 
  People, 
  Inventory, 
  CreditCard, 
  ArrowUpward, 
  ArrowDownward, 
  ArrowForward
} from '@mui/icons-material';

/**
 * Premium stat card component with sophisticated design elements
 * Combines enterprise reliability with premium modern aesthetics
 */
const PremiumStatCard = ({ 
  title, 
  value, 
  description, 
  trend, 
  trendDirection, 
  icon, 
  color = 'primary', 
  emphasizeWithArrow = false,
  testId
}) => {
  // Premium color system with enhanced palettes
  const colorSystem = {
    primary: {
      main: '#3366FF', // Vibrant blue
      light: '#EBF0FF',
      dark: '#1939B7',
      gradient: 'linear-gradient(135deg, #3366FF 0%, #5B8DEF 100%)',
      soft: 'rgba(51, 102, 255, 0.08)'
    },
    info: {
      main: '#00B8D9', // Teal
      light: '#E6FCFF',
      dark: '#006C9C',
      gradient: 'linear-gradient(135deg, #00B8D9 0%, #36C5F0 100%)',
      soft: 'rgba(0, 184, 217, 0.08)'
    },
    secondary: {
      main: '#6E56CF', // Rich purple
      light: '#F4F0FF',
      dark: '#4D399E',
      gradient: 'linear-gradient(135deg, #6E56CF 0%, #9F85F0 100%)',
      soft: 'rgba(110, 86, 207, 0.08)'
    },
    error: {
      main: '#E5484D', // Vibrant red
      light: '#FEF0F0',
      dark: '#B42B2B',
      gradient: 'linear-gradient(135deg, #E5484D 0%, #FF6A6A 100%)',
      soft: 'rgba(229, 72, 77, 0.08)'
    },
    success: {
      main: '#30A46C', // Rich green
      light: '#ECFDF3',
      dark: '#18794E',
      gradient: 'linear-gradient(135deg, #30A46C 0%, #4CC38A 100%)',
      soft: 'rgba(48, 164, 108, 0.08)'
    }
  };

  const colorSet = colorSystem[color] || colorSystem.primary;

  // Render premium trend indicators
  const renderTrendIndicator = () => {
    if (emphasizeWithArrow) {
      return (
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ml: 1,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: colorSystem.error.gradient,
            boxShadow: `0 2px 4px ${alpha(colorSystem.error.main, 0.25)}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: `0 3px 6px ${alpha(colorSystem.error.main, 0.3)}`,
            }
          }}
          data-testid={testId ? `${testId}-arrow` : undefined}
        >
          <ArrowForward sx={{ 
            fontSize: 14,
            color: '#fff'
          }} />
        </Box>
      );
    } else if (trend) {
      const trendColor = trendDirection === 'up' ? colorSystem.success : colorSystem.error;
      
      return (
        <Box 
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            ml: 1,
            px: 0.8,
            py: 0.3,
            borderRadius: 1.5,
            background: trendColor.soft,
            color: trendColor.main,
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.01em',
          }}
          data-testid={testId ? `${testId}-trend` : undefined}
        >
          {trendDirection === 'up' 
            ? <ArrowUpward sx={{ fontSize: 11, mr: 0.3 }} /> 
            : <ArrowDownward sx={{ fontSize: 11, mr: 0.3 }} />}
          {trend}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box 
      sx={{
        position: 'relative',
        height: 70,
        background: '#FFFFFF',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.02)',
        borderRadius: 5, // Extra rounded for premium feel
        p: 2.5,
        pl: 3.2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'all 0.25s ease',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02)',
          transform: 'translateY(-2px)',
        },
        // Premium accent with subtle animation
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 10,
          bottom: 10,
          width: '4px',
          background: colorSet.gradient,
          borderRadius: 4,
          boxShadow: `0 0 8px ${alpha(colorSet.main, 0.2)}`,
          transition: 'all 0.3s ease',
        },
        '&:hover::before': {
          top: 6,
          bottom: 6,
        },
        // Subtle pattern element
        '&::after': {
          content: '""',
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '40%',
          height: '60%',
          background: `radial-gradient(circle at bottom right, ${alpha(colorSet.light, 0.7)}, transparent 70%)`,
          opacity: 0.5,
          zIndex: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::after': {
          opacity: 0.8,
        }
      }}
      data-testid={testId}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 1,
        position: 'relative',
        zIndex: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.25rem',
              color: '#1A1A1A',
              letterSpacing: '-0.02em',
            }}
            data-testid={testId ? `${testId}-value` : undefined}
          >
            {value}
          </Typography>
          
          {/* Premium trend indicators */}
          {renderTrendIndicator()}
        </Box>
        
        {/* Icon with premium styling */}
        {icon && (
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: colorSet.soft,
              color: colorSet.main,
              width: 32,
              height: 32,
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: alpha(colorSet.main, 0.12),
                transform: 'scale(1.05)',
              }
            }}
            data-testid={testId ? `${testId}-icon` : undefined}
          >
            {React.cloneElement(icon, { sx: { fontSize: 16 } })}
          </Box>
        )}
      </Box>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#4B5563',
          fontSize: '0.8125rem',
          fontWeight: 600,
          position: 'relative',
          zIndex: 1,
          letterSpacing: '-0.01em',
        }}
        data-testid={testId ? `${testId}-title` : undefined}
      >
        {title}
      </Typography>
      
      {description && (
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#6B7280',
            fontSize: '0.6875rem',
            display: 'block',
            fontWeight: 500,
            position: 'relative',
            zIndex: 1,
            mt: 0.3,
          }}
          data-testid={testId ? `${testId}-description` : undefined}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

/**
 * Premium StatsCardsGrid component with enhanced layout
 */
const StatsCardsGrid = ({ stats, testId }) => {
  return (
    <Box 
      sx={{
        display: "flex",
        gap: 3.5,
        pt: 0, // Removed top padding to move cards up
        pb: 2,
        px: 1.5,
        width: '100%',
        marginTop: -1, // Added negative margin to pull cards up further
        '& > div': {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateZ(0)', // Triggers GPU acceleration
            zIndex: 1,
          }
        }
      }}
      data-testid={testId || 'stats-cards-grid'}
    >
      <Box sx={{ width: '25%', minWidth: 130 }}>
        <PremiumStatCard
          title="Approved"
          value={stats.requisitions.counts.total}
          color="primary"
          icon={<ShoppingCart />}
          testId="approve-card"
        />
      </Box>

      <Box sx={{ width: '25%', minWidth: 130 }}>
        <PremiumStatCard
          title="Travel Requisitions"
          value={stats.rfqs.counts.total}
          icon={<People />}
          color="info"
          testId="po-requisitions-card"
        />
      </Box>

      <Box sx={{ width: '25%', minWidth: 130 }}>
        <PremiumStatCard
          title="Send to supplier"
          value={stats.purchaseOrders.counts.total}
          icon={<Inventory />}
          color="secondary"
          testId="supplier-card"
        />
      </Box>

      <Box sx={{ width: '25%', minWidth: 130 }}>
        <PremiumStatCard
          title="To be paid"
          value={stats.invoices.counts.total}
          icon={<CreditCard />}
          color="error"
          testId="to-be-paid-card"
        />
      </Box>
    </Box>
  );
};

export default StatsCardsGrid;