import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Bell,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Users,
  Fuel,
  DollarSign,
  Star,
  Phone,
  MessageSquare,
  Zap,
  Shield,
  Target,
  BarChart3,
  Calendar,
  Settings,
  Filter,
  Search,
  Download,
  RefreshCw,
  Activity,
  Thermometer,
  Cloud,
  Route,
  Eye,
  TrendingDown,
  Gauge,
  Globe,
  ChevronRight
} from 'lucide-react';
//import FleetTrackingMap from './fleetMap';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
 
   const [drivers, setDrivers] = useState([]);
  
    const [searchQuery, setSearchQuery] = useState('');
   

  // Simulate real-time driver positions
  useEffect(() => {
    const initialDrivers = [
      { id: 1, name: "John Smith", lat: 40.7128, lng: -74.0060, status: "available", vehicle: "Toyota Camry", rating: 4.8, trips: 45, earnings: 1250, phone: "+1-555-0123" },
      { id: 2, name: "Sarah Johnson", lat: 40.7589, lng: -73.9851, status: "on-trip", vehicle: "Honda Accord", rating: 4.9, trips: 38, earnings: 1180, phone: "+1-555-0124" },
      { id: 3, name: "Mike Wilson", lat: 40.7505, lng: -73.9934, status: "available", vehicle: "Nissan Altima", rating: 4.7, trips: 52, earnings: 1420, phone: "+1-555-0125" },
      { id: 4, name: "Emily Davis", lat: 40.7831, lng: -73.9712, status: "on-trip", vehicle: "Ford Fusion", rating: 4.9, trips: 41, earnings: 1320, phone: "+1-555-0126" },
      { id: 5, name: "Robert Brown", lat: 40.7282, lng: -73.7949, status: "offline", vehicle: "Chevrolet Malibu", rating: 4.6, trips: 33, earnings: 980, phone: "+1-555-0127" },
      { id: 6, name: "Lisa Garcia", lat: 40.7900, lng: -73.9441, status: "available", vehicle: "Hyundai Elantra", rating: 4.8, trips: 47, earnings: 1290, phone: "+1-555-0128" },
      { id: 7, name: "David Miller", lat: 40.7614, lng: -73.9776, status: "maintenance", vehicle: "Kia Optima", rating: 4.5, trips: 29, earnings: 850, phone: "+1-555-0129" },
      { id: 8, name: "Anna Wilson", lat: 40.7489, lng: -73.9680, status: "on-trip", vehicle: "Subaru Legacy", rating: 4.9, trips: 56, earnings: 1560, phone: "+1-555-0130" }
    ];
    
    setDrivers(initialDrivers);

    // Simulate real-time position updates
    const interval = setInterval(() => {
      setDrivers(prevDrivers => 
        prevDrivers.map(driver => ({
          ...driver,
          lat: driver.lat + (Math.random() - 0.5) * 0.001,
          lng: driver.lng + (Math.random() - 0.5) * 0.001,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simulate real-time notifications
  useEffect(() => {
    const notificationMessages = [
      "Driver John Smith completed trip to JFK Airport - $85 earned",
      "High demand alert: Downtown Manhattan area needs drivers",
      "Vehicle maintenance reminder: Unit #A123 due for service",
      "Peak hour surge pricing activated in Midtown",
      "Sarah Johnson received 5-star rating from customer",
      "Traffic alert: Heavy congestion on FDR Drive - rerouting drivers",
      "New driver Emily Chen completed onboarding process"
    ];

    const interval = setInterval(() => {
      const randomMessage = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];
      setNotifications(prev => [{
        id: Date.now(),
        message: randomMessage,
        time: new Date().toLocaleTimeString(),
        type: Math.random() > 0.7 ? 'urgent' : 'info'
      }, ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  // Enhanced metrics calculation
  const driverStats = {
    available: drivers.filter(d => d.status === 'available').length,
    onTrip: drivers.filter(d => d.status === 'on-trip').length,
    offline: drivers.filter(d => d.status === 'offline').length,
    maintenance: drivers.filter(d => d.status === 'maintenance').length,
    total: drivers.length
  };

  const advancedStats = {
    totalRevenue: 8450,
    avgTripTime: 18,
    customerSatisfaction: 4.8,
    fuelEfficiency: 85,
    responseTime: 3.2,
    peakHours: "2:00 PM - 6:00 PM",
    fleetUtilization: Math.round(((driverStats.available + driverStats.onTrip) / driverStats.total) * 100)
  };

  const tripStats = {
    today: {
      completed: 156,
      inProgress: driverStats.onTrip,
      cancelled: 8,
      earnings: 8450,
      distance: 2847,
      avgRating: 4.7
    },
    total: {
      completed: 12847,
      inProgress: driverStats.onTrip,
      cancelled: 423,
      earnings: 456780,
      distance: 234567,
      avgRating: 4.8
    }
  };

  const recentTrips = [
    { id: 1, driver: "John Smith", route: "Times Square → JFK Airport", status: "completed", earnings: 95, time: "3 mins ago", distance: "18.2 km", duration: "24 min", rating: 5 },
    { id: 2, driver: "Sarah Johnson", route: "Central Park → Brooklyn Bridge", status: "in-progress", earnings: 45, time: "8 mins ago", distance: "12.1 km", duration: "16 min", rating: null },
    { id: 3, driver: "Mike Wilson", route: "Grand Central → LaGuardia", status: "completed", earnings: 78, time: "12 mins ago", distance: "15.7 km", duration: "22 min", rating: 4 },
    { id: 4, driver: "Emily Davis", route: "Wall Street → Penn Station", status: "completed", earnings: 35, time: "18 mins ago", distance: "6.8 km", duration: "14 min", rating: 5 },
    { id: 5, driver: "Anna Wilson", route: "SoHo → Upper East Side", status: "in-progress", earnings: 52, time: "25 mins ago", distance: "11.3 km", duration: "19 min", rating: null },
  ];

  // Filter drivers based on search
  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const StatCard = ({ title, value, icon: Icon, color, trend, bgColor, subtitle, prefix = "", suffix = "" }) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:transform hover:-translate-y-2 border border-gray-100/50 group backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-50"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${bgColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} className={color} />
          </div>
          {trend && (
            <div className="flex items-center space-x-1">
              {trend > 0 ? (
                <TrendingUp size={16} className="text-emerald-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <span className={`text-sm font-semibold ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        <h3 className="text-gray-600 text-sm font-semibold mb-2">{title}</h3>
        <div className="flex items-baseline space-x-1">
          <span className={`text-3xl font-bold ${color} group-hover:scale-105 transition-transform`}>
            {prefix}{value}{suffix}
          </span>
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
      </div>
    </div>
  );

  const DriverMarker = ({ driver, onClick }) => {
    const getStatusColor = (status) => {
      switch(status) {
        case 'available': return 'bg-emerald-500 shadow-emerald-500/50';
        case 'on-trip': return 'bg-blue-500 shadow-blue-500/50';
        case 'offline': return 'bg-gray-400 shadow-gray-400/50';
        case 'maintenance': return 'bg-red-500 shadow-red-500/50';
        default: return 'bg-gray-400 shadow-gray-400/50';
      }
    };

    return (
      <div 
        className={`absolute w-7 h-7 ${getStatusColor(driver.status)} rounded-full border-3 border-white shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-150 hover:z-20 z-10`}
        style={{
          left: `${((driver.lng + 74.1) / 0.3) * 100}%`,
          top: `${((40.9 - driver.lat) / 0.2) * 100}%`,
          animation: driver.status === 'on-trip' ? 'pulse 2s infinite' : 'none'
        }}
        onClick={() => onClick(driver)}
      >
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          <div className="font-semibold">{driver.name}</div>
          <div className="text-gray-300 capitalize">{driver.status}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
     

      {/* Dashboard Content */}
      <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
       

       

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Enhanced Dynamic Fleet Map -  <FleetTrackingMap 
      drivers={drivers}
      filteredDrivers={filteredDrivers}
      searchQuery={searchQuery}
      driverStats={driverStats}
    /> */}
         

          {/* Enhanced Analytics Sidebar */}
          <div className="space-y-6">
            {/* Trip Analytics */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Analytics Hub</h3>
                <div className="flex bg-gray-100 rounded-2xl p-1">
                  <button 
                    onClick={() => setActiveTab('today')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'today' 
                        ? 'bg-white text-blue-600 shadow-md' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => setActiveTab('total')}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'total' 
                        ? 'bg-white text-blue-600 shadow-md' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Total
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="text-emerald-600" size={24} />
                      <span className="text-gray-800 font-semibold">Completed</span>
                    </div>
                    <span className="text-3xl font-bold text-emerald-600">
                      {activeTab === 'today' ? tripStats.today.completed : tripStats.total.completed.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Navigation className="text-blue-600" size={24} />
                      <span className="text-gray-800 font-semibold">Active</span>
                    </div>
                    <span className="text-3xl font-bold text-blue-600">
                      {activeTab === 'today' ? tripStats.today.inProgress : tripStats.total.inProgress}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="text-amber-600" size={24} />
                      <span className="text-gray-800 font-semibold">Revenue</span>
                    </div>
                    <span className="text-3xl font-bold text-amber-600">
                      ${activeTab === 'today' ? tripStats.today.earnings.toLocaleString() : tripStats.total.earnings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <BarChart3 className="text-blue-500" size={22} />
                <span>Performance Insights</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Avg Trip Duration</span>
                  <span className="font-bold text-gray-900">{advancedStats.avgTripTime} min</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Peak Hours</span>
                  <span className="font-bold text-gray-900 text-sm">{advancedStats.peakHours}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Fleet Utilization</span>
                  <span className="font-bold text-blue-600">{advancedStats.fleetUtilization}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Customer Rating</span>
                  <span className="font-bold text-yellow-600">{activeTab === 'today' ? tripStats.today.avgRating : tripStats.total.avgRating} ⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Recent Activity Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <Route className="text-blue-500" size={28} />
              <span>Recent Trip Activity</span>
            </h3>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-all">
                <Download size={16} />
                <span>Export Data</span>
              </button>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center space-x-2">
                <span>View All Trips</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm">Driver</th>
                  <th className="text-left py-4 px-6 text-gray-700 font-bold text-sm">Route</th>
                  <th className="text-center py-4 px-6 text-gray-700 font-bold text-sm">Status</th>
                  <th className="text-center py-4 px-6 text-gray-700 font-bold text-sm">Distance</th>
                  <th className="text-center py-4 px-6 text-gray-700 font-bold text-sm">Duration</th>
                  <th className="text-center py-4 px-6 text-gray-700 font-bold text-sm">Rating</th>
                  <th className="text-right py-4 px-6 text-gray-700 font-bold text-sm">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTrips.map((trip, index) => (
                  <tr key={trip.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 group">
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <span className="text-white text-sm font-bold">
                            {trip.driver.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{trip.driver}</span>
                          <p className="text-xs text-gray-500">{trip.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-gray-700 font-medium">{trip.route}</div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold inline-flex items-center ${
                        trip.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        trip.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {trip.status === 'in-progress' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>}
                        {trip.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center text-gray-600 font-medium">
                      {trip.distance}
                    </td>
                    <td className="py-5 px-6 text-center text-gray-600 font-medium">
                      {trip.duration}
                    </td>
                    <td className="py-5 px-6 text-center">
                      {trip.rating ? (
                        <span className="text-yellow-500 font-bold">{trip.rating} ⭐</span>
                      ) : (
                        <span className="text-gray-400 text-sm">Pending</span>
                      )}
                    </td>
                    <td className="py-5 px-6 text-right font-bold text-lg text-gray-900">
                      ${trip.earnings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
         {/* Real-time Activity Feed */}
        {notifications.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <Activity className="text-blue-500" size={24} />
                <span>Live Activity Stream</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className={`p-4 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                  notification.type === 'urgent' 
                    ? 'bg-red-50 border-red-200 hover:bg-red-100' 
                    : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      notification.type === 'urgent' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm font-medium leading-relaxed">{notification.message}</p>
                      <p className="text-gray-500 text-xs mt-2 font-medium">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DriverDashboard;