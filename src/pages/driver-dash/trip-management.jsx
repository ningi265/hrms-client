import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Tooltip,
  Legend
} from 'recharts';
import {
  MapPin,
  Clock,
  Users,
  Fuel,
  DollarSign,
  TrendingUp,
  Calendar,
  Route,
  Gauge,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Car,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Shield,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Star,
  Timer,
  Truck
} from 'lucide-react';

// Sample trip data - in real app, this would come from API
const tripData = {
  totalTrips: 156,
  totalDistance: 4250,
  totalFuel: 425,
  totalPassengers: 486,
  totalHours: 312,
  totalRevenue: 125600,
  avgTripDistance: 27.2,
  avgFuelEfficiency: 10.0,
  safetyScore: 94,
  onTimePercentage: 87
};

// Chart data
const monthlyTripsData = [
  { month: 'Jan', trips: 45, distance: 1200, fuel: 120 },
  { month: 'Feb', trips: 52, distance: 1350, fuel: 135 },
  { month: 'Mar', trips: 48, distance: 1280, fuel: 128 },
  { month: 'Apr', trips: 56, distance: 1420, fuel: 142 },
  { month: 'May', trips: 61, distance: 1580, fuel: 158 },
  { month: 'Jun', trips: 58, distance: 1510, fuel: 151 }
];

const tripStatusData = [
  { name: 'Completed', value: 142, color: '#10B981' },
  { name: 'Cancelled', value: 8, color: '#EF4444' },
  { name: 'In Progress', value: 6, color: '#3B82F6' }
];

const fuelEfficiencyData = [
  { week: 'Week 1', efficiency: 9.8 },
  { week: 'Week 2', efficiency: 10.2 },
  { week: 'Week 3', efficiency: 9.9 },
  { week: 'Week 4', efficiency: 10.1 },
  { week: 'Week 5', efficiency: 10.3 },
  { week: 'Week 6', efficiency: 9.7 }
];

const popularRoutesData = [
  { route: 'Lilongwe - Blantyre', trips: 45, percentage: 29 },
  { route: 'Blantyre - Zomba', trips: 32, percentage: 21 },
  { route: 'Mzuzu - Lilongwe', trips: 28, percentage: 18 },
  { route: 'Lilongwe - Kasungu', trips: 24, percentage: 15 },
  { route: 'Others', trips: 27, percentage: 17 }
];

const peakHoursData = [
  { hour: '6AM', trips: 12 },
  { hour: '7AM', trips: 18 },
  { hour: '8AM', trips: 25 },
  { hour: '9AM', trips: 15 },
  { hour: '12PM', trips: 20 },
  { hour: '1PM', trips: 22 },
  { hour: '5PM', trips: 28 },
  { hour: '6PM', trips: 24 },
  { hour: '7PM', trips: 16 }
];

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "", size = "normal" }) => {
  const cardClass = size === "large" ? "col-span-2" : "";
  const valueSize = size === "large" ? "text-4xl" : "text-2xl";
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${cardClass}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${
          color === 'blue' ? 'bg-blue-50' :
          color === 'green' ? 'bg-emerald-50' :
          color === 'purple' ? 'bg-purple-50' :
          color === 'orange' ? 'bg-orange-50' :
          color === 'red' ? 'bg-red-50' :
          'bg-gray-50'
        }`}>
          <Icon size={20} className={
            color === 'blue' ? 'text-blue-600' :
            color === 'green' ? 'text-emerald-600' :
            color === 'purple' ? 'text-purple-600' :
            color === 'orange' ? 'text-orange-600' :
            color === 'red' ? 'text-red-600' :
            'text-gray-600'
          } />
        </div>
        {trend && (
          <div className="flex items-center gap-1">
            <TrendingUp size={14} className={trend > 0 ? 'text-emerald-500' : 'text-red-500'} />
            <span className={`text-xs font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className={`${valueSize} font-bold text-gray-900 mb-1`}>
        {prefix}{value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );
};

// Chart Card Component
const ChartCard = ({ title, children, action, size = "normal" }) => {
  const cardClass = size === "large" ? "col-span-2" : size === "full" ? "col-span-full" : "";
  
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${cardClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {action && (
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TripManagementDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trip Management</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Active tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Last 30 days</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Trips" 
            value={tripData.totalTrips}
            icon={Route} 
            color="blue" 
            trend={12}
            subtitle="This month"
          />
          <MetricCard 
            title="Distance Covered" 
            value={tripData.totalDistance.toLocaleString()}
            suffix=" km"
            icon={MapPin} 
            color="green" 
            trend={8}
            subtitle="Total kilometers"
          />
          <MetricCard 
            title="Passengers Transported" 
            value={tripData.totalPassengers.toLocaleString()}
            icon={Users} 
            color="purple" 
            trend={15}
            subtitle="Total passengers"
          />
          <MetricCard 
            title="Fuel Consumed" 
            value={tripData.totalFuel}
            suffix=" L"
            icon={Fuel} 
            color="orange" 
            trend={-3}
            subtitle="Total fuel"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Revenue Generated" 
            value={tripData.totalRevenue.toLocaleString()}
            prefix="MWK "
            icon={DollarSign} 
            color="green" 
            trend={18}
          />
          <MetricCard 
            title="Avg Trip Distance" 
            value={tripData.avgTripDistance}
            suffix=" km"
            icon={Navigation} 
            color="blue" 
            trend={5}
          />
          <MetricCard 
            title="Fuel Efficiency" 
            value={tripData.avgFuelEfficiency}
            suffix=" km/L"
            icon={Gauge} 
            color="purple" 
            trend={7}
          />
          <MetricCard 
            title="Safety Score" 
            value={tripData.safetyScore}
            suffix="/100"
            icon={Shield} 
            color="green" 
            trend={2}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Trip Status Pie Chart */}
          <ChartCard title="Trip Status Distribution">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={tripStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tripStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {tripStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Fuel Efficiency Trend */}
          <ChartCard title="Fuel Efficiency Trend">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={fuelEfficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Performance Indicators */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Performance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">On-Time Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-14 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Customer Rating</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                    ))}
                    <span className="text-sm font-medium ml-1">4.6</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-15 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trends Chart */}
        <ChartCard title="Monthly Trip Trends" size="full" action="View Details">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTripsData}>
              <defs>
                <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="trips" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTrips)" />
              <Area type="monotone" dataKey="distance" stroke="#10B981" fillOpacity={1} fill="url(#colorDistance)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Popular Routes and Peak Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Popular Routes */}
          <ChartCard title="Popular Routes">
            <div className="space-y-3">
              {popularRoutesData.map((route, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{route.route}</div>
                    <div className="text-xs text-gray-500">{route.trips} trips</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${route.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{route.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Peak Hours */}
          <ChartCard title="Peak Hours Analysis">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="trips" fill="#3B82F6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Recent Trips Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Route className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Recent Trips</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { date: '2024-06-17', route: 'Lilongwe → Blantyre', distance: '312 km', passengers: 8, duration: '4h 15m', status: 'completed', revenue: 'MWK 12,400' },
                  { date: '2024-06-17', route: 'Blantyre → Zomba', distance: '67 km', passengers: 5, duration: '1h 30m', status: 'completed', revenue: 'MWK 5,200' },
                  { date: '2024-06-16', route: 'Mzuzu → Lilongwe', distance: '278 km', passengers: 6, duration: '3h 45m', status: 'completed', revenue: 'MWK 10,800' },
                  { date: '2024-06-16', route: 'Lilongwe → Kasungu', distance: '112 km', passengers: 4, duration: '2h 10m', status: 'completed', revenue: 'MWK 6,400' },
                  { date: '2024-06-15', route: 'Blantyre → Lilongwe', distance: '312 km', passengers: 7, duration: '4h 20m', status: 'completed', revenue: 'MWK 11,800' }
                ].map((trip, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{trip.date}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{trip.route}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{trip.distance}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{trip.passengers}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{trip.duration}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                        trip.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{trip.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripManagementDashboard;