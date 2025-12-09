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
  Car,
  Wrench,
  Fuel,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Activity,
  Settings,
  Bell,
  MapPin,
  Route,
  Timer,
  Zap,
  Award,
  RefreshCw,
  Filter,
  Download,
  ChevronRight,
  Eye,
  Edit,
  Plus,
  Search,
  AlertCircle,
  XCircle,
  Battery,
  Thermometer,
  RotateCcw
} from 'lucide-react';

// Sample vehicle data
const vehicleData = {
  totalVehicles: 3,
  activeVehicles: 2,
  inMaintenance: 1,
  totalMileage: 245680,
  avgFuelEfficiency: 9.8,
  maintenanceCosts: 45600,
  nextServiceDue: 'Toyota Hiace - 2 days',
  healthScore: 87
};

// Vehicle fleet data
const vehicles = [
  {
    id: 1,
    name: 'Toyota Hiace',
    plateNumber: 'MW-LL-1234',
    model: '2019 Toyota Hiace',
    mileage: 89450,
    fuelLevel: 75,
    healthScore: 92,
    status: 'active',
    lastService: '2024-05-15',
    nextService: '2024-06-20',
    servicesOverdue: 0,
    fuelEfficiency: 10.2,
    maintenanceCost: 12400,
    batteryLevel: 98,
    engineTemp: 'Normal',
    tireCondition: 'Good'
  },
  {
    id: 2,
    name: 'Nissan NV200',
    plateNumber: 'MW-BT-5678',
    model: '2020 Nissan NV200',
    mileage: 67230,
    fuelLevel: 45,
    healthScore: 78,
    status: 'maintenance',
    lastService: '2024-06-10',
    nextService: '2024-06-25',
    servicesOverdue: 1,
    fuelEfficiency: 9.8,
    maintenanceCost: 18200,
    batteryLevel: 85,
    engineTemp: 'High',
    tireCondition: 'Fair'
  },
  {
    id: 3,
    name: 'Ford Transit',
    plateNumber: 'MW-MZ-9012',
    model: '2018 Ford Transit',
    mileage: 124500,
    fuelLevel: 60,
    healthScore: 85,
    status: 'active',
    lastService: '2024-06-01',
    nextService: '2024-07-01',
    servicesOverdue: 0,
    fuelEfficiency: 9.5,
    maintenanceCost: 15000,
    batteryLevel: 92,
    engineTemp: 'Normal',
    tireCondition: 'Good'
  }
];

// Maintenance status data
const maintenanceStatusData = [
  { name: 'Up to Date', value: 2, color: '#10B981' },
  { name: 'Due Soon', value: 1, color: '#F59E0B' },
  { name: 'Overdue', value: 1, color: '#EF4444' }
];

// Fuel consumption data
const fuelConsumptionData = [
  { month: 'Jan', consumption: 450, cost: 18000 },
  { month: 'Feb', consumption: 420, cost: 16800 },
  { month: 'Mar', consumption: 480, cost: 19200 },
  { month: 'Apr', consumption: 460, cost: 18400 },
  { month: 'May', consumption: 510, cost: 20400 },
  { month: 'Jun', consumption: 485, cost: 19400 }
];

// Maintenance costs data
const maintenanceCostsData = [
  { month: 'Jan', cost: 8500 },
  { month: 'Feb', cost: 12000 },
  { month: 'Mar', cost: 6800 },
  { month: 'Apr', cost: 9200 },
  { month: 'May', cost: 15600 },
  { month: 'Jun', cost: 7400 }
];

// Service history data
const serviceHistory = [
  {
    id: 1,
    vehicle: 'Toyota Hiace',
    service: 'Oil Change & Filter',
    date: '2024-06-15',
    cost: 3200,
    status: 'completed',
    nextDue: '2024-09-15',
    mileage: 89200
  },
  {
    id: 2,
    vehicle: 'Nissan NV200',
    service: 'Brake Inspection',
    date: '2024-06-10',
    cost: 5600,
    status: 'completed',
    nextDue: '2024-12-10',
    mileage: 67100
  },
  {
    id: 3,
    vehicle: 'Ford Transit',
    service: 'Tire Rotation',
    date: '2024-06-01',
    cost: 2800,
    status: 'completed',
    nextDue: '2024-09-01',
    mileage: 124200
  },
  {
    id: 4,
    vehicle: 'Toyota Hiace',
    service: 'Engine Diagnostic',
    date: '2024-05-20',
    cost: 4500,
    status: 'completed',
    nextDue: '2024-11-20',
    mileage: 88800
  }
];

// Upcoming maintenance alerts
const upcomingMaintenance = [
  {
    vehicle: 'Toyota Hiace',
    service: 'Engine Oil Change',
    dueDate: '2024-06-20',
    daysLeft: 2,
    priority: 'high',
    estimatedCost: 3500
  },
  {
    vehicle: 'Ford Transit',
    service: 'Brake Pad Replacement',
    dueDate: '2024-06-25',
    daysLeft: 7,
    priority: 'medium',
    estimatedCost: 8500
  },
  {
    vehicle: 'Nissan NV200',
    service: 'AC System Check',
    dueDate: '2024-07-01',
    daysLeft: 14,
    priority: 'low',
    estimatedCost: 4200
  }
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
            {trend > 0 ? (
              <TrendingUp size={14} className="text-emerald-500" />
            ) : (
              <TrendingDown size={14} className="text-red-500" />
            )}
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

// Vehicle Card Component
const VehicleCard = ({ vehicle }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Car className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
            <p className="text-sm text-gray-500">{vehicle.plateNumber}</p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehicle.status)}`}>
          {vehicle.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="text-lg font-bold text-gray-900">{vehicle.mileage.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Mileage (km)</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className={`text-lg font-bold ${getHealthColor(vehicle.healthScore)}`}>{vehicle.healthScore}%</div>
          <div className="text-xs text-gray-500">Health Score</div>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Fuel Level</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full ${vehicle.fuelLevel > 50 ? 'bg-green-500' : vehicle.fuelLevel > 25 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${vehicle.fuelLevel}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium">{vehicle.fuelLevel}%</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Battery</span>
          <div className="flex items-center gap-2">
            <Battery className="w-3 h-3 text-gray-500" />
            <span className="text-xs font-medium">{vehicle.batteryLevel}%</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Engine Temp</span>
          <div className="flex items-center gap-2">
            <Thermometer className="w-3 h-3 text-gray-500" />
            <span className={`text-xs font-medium ${vehicle.engineTemp === 'Normal' ? 'text-green-600' : 'text-red-600'}`}>
              {vehicle.engineTemp}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">Next Service: {vehicle.nextService}</span>
        <div className="flex gap-1">
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Eye size={14} />
          </button>
          <button className="p-1 text-gray-400 hover:text-blue-600">
            <Edit size={14} />
          </button>
        </div>
      </div>
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

const VehicleManagementDashboard = () => {
  const [selectedVehicle, setSelectedVehicle] = useState('all');
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
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span>Real-time monitoring</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Fleet health: {vehicleData.healthScore}%</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white"
            >
              <option value="all">All Vehicles</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
              ))}
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
            title="Total Vehicles" 
            value={vehicleData.totalVehicles}
            icon={Car} 
            color="blue" 
            subtitle="In fleet"
          />
          <MetricCard 
            title="Active Vehicles" 
            value={vehicleData.activeVehicles}
            icon={CheckCircle} 
            color="green" 
            trend={5}
            subtitle="Currently operational"
          />
          <MetricCard 
            title="In Maintenance" 
            value={vehicleData.inMaintenance}
            icon={Wrench} 
            color="orange" 
            subtitle="Under service"
          />
          <MetricCard 
            title="Fleet Health" 
            value={vehicleData.healthScore}
            suffix="%"
            icon={Shield} 
            color="purple" 
            trend={3}
            subtitle="Overall condition"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Total Mileage" 
            value={vehicleData.totalMileage.toLocaleString()}
            suffix=" km"
            icon={Route} 
            color="blue" 
            trend={12}
          />
          <MetricCard 
            title="Avg Fuel Efficiency" 
            value={vehicleData.avgFuelEfficiency}
            suffix=" km/L"
            icon={Fuel} 
            color="green" 
            trend={-2}
          />
          <MetricCard 
            title="Maintenance Costs" 
            value={vehicleData.maintenanceCosts.toLocaleString()}
            prefix="MWK "
            icon={DollarSign} 
            color="red" 
            trend={-8}
          />
          <MetricCard 
            title="Next Service Due" 
            value="2 days"
            icon={Calendar} 
            color="orange" 
            subtitle={vehicleData.nextServiceDue}
          />
        </div>

        {/* Vehicle Fleet Cards */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Vehicle Fleet</h3>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
              <Plus size={16} />
              Add Vehicle
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Maintenance Status */}
          <ChartCard title="Maintenance Status">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={maintenanceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {maintenanceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-3 mt-2 text-xs">
              {maintenanceStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Maintenance Costs Trend */}
          <ChartCard title="Maintenance Costs">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={maintenanceCostsData}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#EF4444" 
                  fillOpacity={1} 
                  fill="url(#colorCost)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Upcoming Maintenance Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Service Alerts</h3>
            </div>
            <div className="space-y-3">
              {upcomingMaintenance.slice(0, 3).map((item, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-3 ${
                  item.priority === 'high' ? 'bg-red-50 border-red-500' :
                  item.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.vehicle}</h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.daysLeft} days
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{item.service}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Due: {item.dueDate}</span>
                    <span>Est: MWK {item.estimatedCost.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fuel Consumption Chart */}
        <ChartCard title="Fuel Consumption & Costs" size="full" action="View Details">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fuelConsumptionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="consumption" fill="#3B82F6" name="Consumption (L)" radius={[8, 8, 8, 8]} />
              <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#EF4444" strokeWidth={2} name="Cost (MWK)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Service History Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Service History</h3>
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
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Next Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {serviceHistory.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{service.vehicle}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{service.service}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{service.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{service.mileage.toLocaleString()} km</td>
                    <td className="py-3 px-4 text-sm text-gray-600">MWK {service.cost.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {service.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{service.nextDue}</td>
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

export default VehicleManagementDashboard;