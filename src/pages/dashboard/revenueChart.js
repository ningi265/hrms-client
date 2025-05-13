import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart, ComposedChart
} from 'recharts';
import { 
  Typography, Box, Card, CardContent, CardHeader, ButtonGroup, Button, 
  Tabs, Tab, Paper, alpha, useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart as PieChartIcon, 
  Timeline, 
  BarChart as BarChartIcon,
  TrendingUp,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';

const RevenueChart = ({ salesData = [], revenueBreakdown = [], regionalMapData = [] }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState('line');
  const [activeCategory, setActiveCategory] = useState('Monthly');

  // Define colors as direct values for MUI functions
  const primaryColor = '#3B82F6'; // Blue
  const secondaryColor = '#fbbf24'; // Amber/orange
  const tertiaryColor = '#dc2626'; // Red
  const successColor = '#10b981'; // Green
  const chartBg = '#ffffff'; // Chart background
  const darkGrey = '#000000'; // Text color

  // Default data in case props are empty
  const defaultSalesData = [
    { month: 'Jan', revenue: 65000, target: 60000, growth: 8 },
    { month: 'Feb', revenue: 59000, target: 65000, growth: -5 },
    { month: 'Mar', revenue: 80000, target: 70000, growth: 12 },
    { month: 'Apr', revenue: 81000, target: 75000, growth: 10 },
    { month: 'May', revenue: 56000, target: 80000, growth: -15 },
    { month: 'Jun', revenue: 95000, target: 85000, growth: 20 },
    { month: 'Jul', revenue: 100000, target: 90000, growth: 18 }
  ];

  const defaultRevenueBreakdown = [
    { name: 'Product A', value: 35, color: '#3f51b5' },
    { name: 'Product B', value: 25, color: '#00acc1' },
    { name: 'Product C', value: 20, color: '#4caf50' },
    { name: 'Product D', value: 15, color: '#ff9800' },
    { name: 'Other', value: 5, color: '#9e9e9e' }
  ];

  // Use provided data or fallback to defaults
  const chartData = salesData.length > 0 ? salesData : defaultSalesData;
  const pieData = revenueBreakdown.length > 0 ? revenueBreakdown : defaultRevenueBreakdown;

  // Chart variants for animations
  const chartVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.3 }
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
            padding: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'var(--foreground, #000000)' }}>
            {payload[0].name || label}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: 'var(--muted-foreground, #000000)' }}>
            {chartType === 'pie' ? (
              <>Value: <span style={{ fontWeight: 600, color: primaryColor }}>{payload[0].value}%</span></>
            ) : (
              <>Revenue: <span style={{ fontWeight: 600, color: primaryColor }}>${payload[0].value?.toLocaleString()}</span></>
            )}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Card styling that adapts to the dashboard theme
  const cardStyles = {
    borderRadius: 2,
    background: 'var(--card, #fefefe)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid var(--border, #e5e7eb)',
    overflow: 'hidden',
    position: 'relative',
  };

  // Different chart types to render
  const chartComponents = {
    line: (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            {/* Gradient for revenue area */}
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={0.8} />
              <stop offset="50%" stopColor={primaryColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            vertical={true} 
          />
          <XAxis 
            dataKey="month" 
            stroke="#000000"
            fontSize={12}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            stroke="#000000"
            fontSize={12}
            tickFormatter={(value) => `$${value/1000}k`}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
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
          
          {/* Area under the line with gradient - this needs to come before the line */}
          <Area
            type="monotone"
            dataKey="revenue"
            fill="url(#revenueGradient)"
            fillOpacity={1}
            stroke="none"
            animationBegin={0}
            animationDuration={1200}
          />
          
          {/* Lines need to render after the Area to appear on top */}
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke={primaryColor}
            strokeWidth={2}
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
            animationDuration={1200}
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Target"
            stroke={secondaryColor}
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={{ 
              fill: secondaryColor, 
              strokeWidth: 2, 
              r: 4,
              stroke: '#FFFFFF',
            }}
            activeDot={{ 
              r: 6, 
              stroke: secondaryColor, 
              strokeWidth: 2,
              fill: '#FFFFFF'
            }}
            animationBegin={200}
            animationDuration={1200}
          />
        </ComposedChart>
      </ResponsiveContainer>
    ),
    bar: (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="revenueBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={primaryColor} stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="targetBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={secondaryColor} stopOpacity={0.8} />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity={0.4} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            vertical={false} 
          />
          <XAxis 
            dataKey="month" 
            stroke="#000000"
            fontSize={12}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            stroke="#000000"
            fontSize={12}
            tickFormatter={(value) => `$${value/1000}k`}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
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
            dataKey="revenue"
            name="Revenue"
            fill="url(#revenueBarGradient)"
            barSize={20}
            radius={[4, 4, 0, 0]}
            animationBegin={0}
            animationDuration={1200}
          />
          <Bar
            dataKey="target"
            name="Target"
            fill="url(#targetBarGradient)"
            barSize={20}
            radius={[4, 4, 0, 0]}
            animationBegin={200}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    ),
    pie: (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={120}
            paddingAngle={4}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {pieData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke="#ffffff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom"
            layout="horizontal"
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
        </PieChart>
      </ResponsiveContainer>
    )
  };

  // Revenue Metrics Section with theme-aware styling
  const RevenueMetrics = () => {
    const metrics = [
      { 
        title: "Current Month", 
        value: "$95K",
        change: "+12.5%",
        trend: "up"
      },
      {
        title: "Previous Month", 
        value: "$81K",
        change: "+8.3%",
        trend: "up"
      },
      {
        title: "YTD Revenue", 
        value: "$536K",
        change: "+5.7%",
        trend: "up"
      },
      {
        title: "Projected Q2", 
        value: "$310K",
        change: "-2.1%",
        trend: "down"
      }
    ];

    return (
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mt: 3 }}>
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Paper
              sx={{
                p: 2,
                borderRadius: 2,
                background: 'var(--card, #fefefe)',
                border: '1px solid var(--border, #e5e7eb)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }
              }}
            >
              <Typography variant="body2" color="var(--muted-foreground, #000000)" fontWeight={500}>
                {metric.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                <Typography variant="h5" fontWeight={600} color="var(--card-foreground, #000000)">
                  {metric.value}
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    ml: 1, 
                    px: 1, 
                    py: 0.5, 
                    borderRadius: 1,
                    backgroundColor: metric.trend === 'up' 
                      ? alpha(successColor, 0.1)
                      : alpha(tertiaryColor, 0.1),
                    color: metric.trend === 'up' 
                      ? successColor
                      : tertiaryColor
                  }}
                >
                  {metric.trend === 'up' ? (
                    <ArrowUpward sx={{ fontSize: 12, mr: 0.5 }} />
                  ) : (
                    <ArrowDownward sx={{ fontSize: 12, mr: 0.5 }} />
                  )}
                  <Typography variant="caption" fontWeight={600}>
                    {metric.change}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        ))}
      </Box>
    );
  };

  return (
    <Card sx={cardStyles}>
      <CardHeader
        title="Revenue Overview"
        subheader="Financial performance analysis"
        titleTypographyProps={{
          variant: 'h6',
          fontWeight: 600,
          color: 'var(--card-foreground, #000000)',
        }}
        subheaderTypographyProps={{
          variant: 'body2',
          color: 'var(--muted-foreground, #000000)',
        }}
        action={
          <ButtonGroup 
            variant="outlined" 
            size="small"
            sx={{ 
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
        }
        sx={{ 
          px: 3, 
          py: 2, 
          borderBottom: '1px solid var(--border, #e5e7eb)',
          backgroundColor: 'var(--card, #fefefe)'
        }}
      />
      
      {/* Time Period Tabs with professional styling */}
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
      textTransform: 'capitalize', // Changed from default 'uppercase'
      color: 'var(--muted-foreground, #000000)',
      fontWeight: 500,
      '&.Mui-selected': {
        color: primaryColor,
        fontWeight: 600,
      }
    }
  }}
>
  {['Monthly', 'Quarterly', 'Yearly'].map((category) => (
    <Tab 
      key={category} 
      label={category} 
      value={category}
    />
  ))}
</Tabs>
      </Box>
      
      <CardContent sx={{ p: 3, background: 'var(--card, #fefefe)' }}>
        <Box sx={{ width: '100%', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={chartType}
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ width: '100%' }}
            >
              {chartComponents[chartType]}
            </motion.div>
          </AnimatePresence>
        </Box>
        
        {/* Revenue Metrics */}
        <RevenueMetrics />
      </CardContent>
    </Card>
  );
};

export default RevenueChart;