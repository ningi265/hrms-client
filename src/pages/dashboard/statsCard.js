import React from 'react';
import {
  Box,
  Card,
  Typography,
  useTheme,
  alpha,
  styled,
  Divider
} from '@mui/material';
import { 
  ShoppingCart, 
  People, 
  Inventory, 
  CreditCard, 
  ArrowUpward, 
  ArrowDownward 
} from '@mui/icons-material';

// Styled components for refined, professional visuals
const StatsCardStyled = styled(Card)(({ theme, color }) => ({
  height: '100%',
  borderRadius: 8,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  border: '1px solid #f0f0f0',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    width: 4,
    height: '100%',
    backgroundColor: theme.palette[color].main
  }
}));

const IconContainer = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: alpha(theme.palette[color].main, 0.08),
  color: theme.palette[color].main
}));

const TrendIndicator = styled(Box)(({ theme, direction }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 500,
  color: direction === 'up' ? '#28a745' : '#dc3545',
  marginLeft: theme.spacing(0.75)
}));

// Individual stat card component
const StatsCard = ({ title, value, description, trend, trendDirection, icon, color }) => {
  const theme = useTheme();

  return (
    <StatsCardStyled color={color}>
      {/* Card Header with Title and Icon */}
      <Box sx={{ 
        px: 2.5, 
        pt: 2, 
        pb: 1.5,
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center"
      }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: alpha(theme.palette.text.primary, 0.7),
            fontSize: '0.8125rem',
            fontWeight: 500,
            letterSpacing: '0.01em'
          }}
        >
          {title}
        </Typography>
        
        <IconContainer color={color}>
          {React.cloneElement(icon, { sx: { fontSize: 18 } })}
        </IconContainer>
      </Box>
      
      <Divider sx={{ opacity: 0.6 }} />
      
      {/* Card Content with Values */}
      <Box sx={{ px: 2.5, py: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Main Value */}
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1.625rem',
                letterSpacing: '-0.01em'
              }}
            >
              {value}
            </Typography>
            
            <TrendIndicator direction={trendDirection}>
              {trendDirection === 'up' 
                ? <ArrowUpward sx={{ fontSize: 12, mr: 0.25 }} /> 
                : <ArrowDownward sx={{ fontSize: 12, mr: 0.25 }} />}
              {trend}
            </TrendIndicator>
          </Box>
        </Box>
        
        {/* Description */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: alpha(theme.palette.text.secondary, 0.85),
            fontSize: '0.75rem',
            lineHeight: 1.5
          }}
        >
          {description}
        </Typography>
      </Box>
    </StatsCardStyled>
  );
};

// Main component that renders the grid of stat cards
const StatsCardsGrid = ({ stats }) => {
  return (
    <Box 
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: { 
          xs: "repeat(1, 1fr)", 
          sm: "repeat(2, 1fr)", 
          md: "repeat(4, 1fr)" 
        },
        mb: 3,
        mt: 2.5
      }}
    >
      <StatsCard
        title="Requisitions"
        value={stats.requisitions.counts.total}
        description={`${stats.requisitions.counts.pending} pending approval`}
        trend="+12.5%"
        trendDirection="up"
        icon={<ShoppingCart />}
        color="primary"
      />

      <StatsCard
        title="RFQs"
        value={stats.rfqs.counts.total}
        description={`${stats.rfqs.counts.open} open requests`}
        trend="+5.2%"
        trendDirection="up"
        icon={<People />}
        color="info"
      />

      <StatsCard
        title="Purchase Orders"
        value={stats.purchaseOrders.counts.total}
        description={`${stats.purchaseOrders.counts.pending} pending approval`}
        trend="-3.1%"
        trendDirection="down"
        icon={<Inventory />}
        color="secondary"
      />

      <StatsCard
        title="Invoices"
        value={stats.invoices.counts.total}
        description={`${stats.invoices.counts.pending} pending payment`}
        trend="+8.7%"
        trendDirection="up"
        icon={<CreditCard />}
        color="error"
      />
    </Box>
  );
}

export default StatsCardsGrid;