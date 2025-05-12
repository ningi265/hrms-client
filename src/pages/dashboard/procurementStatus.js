import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, 
  LineChart, Line, AreaChart, Area, ComposedChart,
  BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip
} from 'recharts';
import {
  Typography, Box, Card, CardContent, CardHeader, ButtonGroup, Button, 
  Tabs, Tab, useTheme, alpha
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart as PieChartIcon,
  Timeline,
  BarChart as BarChartIcon
} from '@mui/icons-material';

const ProcurementStatusCard = ({ summaryData, colors, allData, activeIndex, onPieEnter, onPieLeave, stats }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState('pie'); // 'pie', 'line', 'bar'
  const [activeCategory, setActiveCategory] = useState('Overall');

  // Define direct color values for MUI functions and consistent styling
  const primaryColor = '#3B82F6'; // Blue
  const secondaryColor = '#10b981'; // Green
  const tertiaryColor = '#dc2626'; // Red
  const cardBg = '#ffffff'; // Card background
  const borderColor = '#e5e7eb'; // Border color
  const textColor = '#000000'; // Text color

  // Define default colors for different statuses if not provided
  const defaultColors = {
    pending: '#FF9F1C',    // warm orange
    approved: '#2EC4B6',   // teal
    rejected: '#E71D36',   // bright red
    open: '#4361EE',       // bright blue
    closed: '#3A0CA3',     // deep purple
    paid: '#7209B7'        // vibrant purple
  };

  // Prepare data for different chart types
  const categories = ['Overall', 'Requisitions', 'RFQs', 'Purchase Orders', 'Invoices'];
  
  const getChartData = () => {
    if (activeCategory === 'Overall') {
      return summaryData;
    }
    
    // Filter data by category
    return allData
      .filter(item => item.category === activeCategory)
      .map(item => ({
        name: item.name.split(' ')[0], // Get status (Pending, Approved, etc.)
        value: item.value,
        status: item.status,
      }));
  };

  const chartData = getChartData();

  // Animation variants
  const chartVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    },
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'var(--card, #fefefe)',
            border: '1px solid var(--border, #e5e7eb)',
            borderRadius: 2,
            padding: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'var(--foreground, #000000)' }}>
            {payload[0].name || label}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: 'var(--muted-foreground, #000000)' }}>
            Count: <span style={{ fontWeight: 600, color: primaryColor }}>{payload[0].value}</span>
          </Typography>
          {chartType === 'pie' && (
            <Typography variant="caption" color="text.secondary">
              {Math.round((payload[0].value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100)}% of total
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  // Bar shape component for animations
  const AnimatedBar = (props) => {
    const { fill, ...rest } = props;
    return (
      <motion.g
        initial={{ scaleY: 0, translateY: rest.height }}
        animate={{ scaleY: 1, translateY: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: rest.index * 0.05 }}
        style={{ transformOrigin: `${rest.x + rest.width / 2}px ${rest.y + rest.height}px` }}
      >
        <rect {...rest} fill={fill} />
      </motion.g>
    );
  };

  // Card styling that adapts to the dashboard theme
  const cardStyles = {
    borderRadius: 4,
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    background: 'white',
    overflow: 'hidden',
    position: 'relative',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: 4,
      background: 'linear-gradient(90deg, #3b82f6, #10b981)',
    },
  };

  // Different chart types to render
  const chartComponents = {
    pie: (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={activeIndex !== null ? 120 : 110}
            paddingAngle={4}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            stroke="#ffffff"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors?.[entry.status?.toLowerCase()] || defaultColors[entry.status?.toLowerCase()] || primaryColor}
                fillOpacity={activeIndex === index ? 1 : 0.85}
                style={{
                  filter: activeIndex === index ? 'drop-shadow(0 0 12px rgba(0,0,0,0.2))' : 'none',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Pie>
          <RechartsTooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            layout="horizontal"
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => (
              <Typography
                component="span"
                variant="body2"
                sx={{ color: '#000000', fontWeight: 500 }}
              >
                {value}
              </Typography>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    ),
    
    line: (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <defs>
            {/* Gradient definition for area under line */}
            <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={0.8} />
              <stop offset="50%" stopColor={primaryColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#000000"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            stroke="#000000"
            fontSize={12}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => (
              <Typography
                component="span"
                variant="body2"
                sx={{ color: '#000000', fontWeight: 500 }}
              >
                {value}
              </Typography>
            )}
          />
          
          {/* Area under the line - needs to come before the line */}
          <Area
            type="monotone"
            dataKey="value"
            name="Value"
            fill="url(#valueGradient)"
            fillOpacity={1}
            stroke="none"
            animationBegin={0}
            animationDuration={800}
          />
          
          {/* Main line */}
          <Line
            type="monotone"
            dataKey="value"
            name="Value"
            stroke={primaryColor}
            strokeWidth={3}
            dot={{ 
              fill: primaryColor, 
              strokeWidth: 2, 
              r: 4,
              stroke: '#FFFFFF',
            }}
            activeDot={{ 
              r: 6, 
              stroke: primaryColor, 
              strokeWidth: 2,
              fill: '#FFFFFF', 
            }}
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </ComposedChart>
      </ResponsiveContainer>
    ),
    
    bar: (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBar data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#000000"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            stroke="#000000"
            fontSize={12}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => (
              <Typography
                component="span"
                variant="body2"
                sx={{ color: '#000000', fontWeight: 500 }}
              >
                {value}
              </Typography>
            )}
          />
          <Bar
            dataKey="value"
            name="Value"
            fill="url(#barGradient)"
            shape={(props) => <AnimatedBar {...props} />}
            barSize={20}
            radius={[4, 4, 0, 0]}
            animationBegin={0}
            animationDuration={1200}
          />
        </RechartsBar>
      </ResponsiveContainer>
    ),
  };

  // Quick Stats Section
  const QuickStats = () => {
    const totals = {
      Requisitions: stats?.requisitions?.counts?.total || 0,
      RFQs: stats?.rfqs?.counts?.total || 0,
      'Purchase Orders': stats?.purchaseOrders?.counts?.total || 0,
      Invoices: stats?.invoices?.counts?.total || 0
    };

    return (
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Add your quick stats content here if needed */}
      </Box>
    );
  };

  return (
    <Card sx={cardStyles}>
      <CardHeader
        title="Procurement Status"
        subheader="Current status of procurement activities"
        titleTypographyProps={{
          variant: 'h6',
          fontWeight: 600,
          color: 'var(--card-foreground, #000000)',
          letterSpacing: 0.5,
        }}
        subheaderTypographyProps={{
          variant: 'body2',
          color: 'var(--muted-foreground, #000000)',
        }}
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Chart Type Selector */}
            <ButtonGroup 
              variant="outlined" 
              size="small" 
              sx={{ 
                mr: 2,
                '& .MuiButton-root': {
                  borderColor: 'var(--border, #e5e7eb)',
                  color: 'var(--muted-foreground, #000000)',
                  '&:hover': {
                    borderColor: primaryColor,
                    backgroundColor: alpha(primaryColor, 0.04),
                  },
                  '&.Mui-selected': {
                    backgroundColor: primaryColor,
                    color: '#fff',
                    borderColor: primaryColor,
                  }
                }
              }}
            >
              <Button
                onClick={() => setChartType('pie')}
                variant={chartType === 'pie' ? 'contained' : 'outlined'}
                sx={{ 
                  px: 1.5, 
                  minWidth: 'auto',
                  ...(chartType === 'pie' && { 
                    backgroundColor: primaryColor,
                    color: '#fff',
                    borderColor: primaryColor,
                  })
                }}
              >
                <PieChartIcon sx={{ fontSize: 18 }} />
              </Button>
              <Button
                onClick={() => setChartType('line')}
                variant={chartType === 'line' ? 'contained' : 'outlined'}
                sx={{ 
                  px: 1.5, 
                  minWidth: 'auto',
                  ...(chartType === 'line' && { 
                    backgroundColor: primaryColor,
                    color: '#fff',
                    borderColor: primaryColor,
                  })
                }}
              >
                <Timeline sx={{ fontSize: 18 }} />
              </Button>
              <Button
                onClick={() => setChartType('bar')}
                variant={chartType === 'bar' ? 'contained' : 'outlined'}
                sx={{ 
                  px: 1.5, 
                  minWidth: 'auto',
                  ...(chartType === 'bar' && { 
                    backgroundColor: primaryColor,
                    color: '#fff',
                    borderColor: primaryColor,
                  })
                }}
              >
                <BarChartIcon sx={{ fontSize: 18 }} />
              </Button>
            </ButtonGroup>
          </Box>
        }
        sx={{
          borderBottom: '1px solid var(--border, #e5e7eb)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          px: 2.5,
          py: 1.5,
        }}
      />
      
      {/* Category Tabs */}
      <Box sx={{ 
        px: 3, 
        borderBottom: '1px solid var(--border, #e5e7eb)',
        background: 'var(--card, #fefefe)'
      }}>
        <Tabs 
          value={activeCategory} 
          onChange={(e, newValue) => setActiveCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            style: {
              background: primaryColor,
              height: 2,
            }
          }}
          sx={{
            '& .MuiTab-root': {
              color: 'var(--muted-foreground, #000000)',
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              '&.Mui-selected': {
                color: primaryColor,
                fontWeight: 600,
              }
            },
          }}
        >
          {categories.map((category) => (
            <Tab key={category} label={category} value={category} />
          ))}
        </Tabs>
      </Box>
      
      <CardContent sx={{ p: 3, background: 'var(--card, #fefefe)' }}>
        <Box sx={{ width: '100%', height: 360, position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={chartType}
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ width: '100%', height: '100%', position: 'absolute' }}
            >
              {chartComponents[chartType]}
            </motion.div>
          </AnimatePresence>
        </Box>
        
        {/* Quick Stats */}
        <QuickStats />
      </CardContent>
    </Card>
  );
};

export default ProcurementStatusCard;