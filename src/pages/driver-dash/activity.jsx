import React, { useState, useEffect, useRef } from 'react';
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

// Google Maps Fleet Tracking Component
const FleetTrackingMap = ({ drivers, driverStats, onDriverSelect }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef(new Map());
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Load Google Maps API
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsMapLoaded(true);
    };

    // For demo purposes, we'll simulate the Google Maps API
    setTimeout(() => {
      window.google = {
        maps: {
          Map: class {
            constructor(element, options) {
              this.element = element;
              this.options = options;
              // Simulate map initialization
            }
            setCenter() {}
            setZoom() {}
          },
          Marker: class {
            constructor(options) {
              this.options = options;
              this.position = options.position;
            }
            setPosition(pos) { this.position = pos; }
            setMap() {}
            setIcon() {}
          },
          InfoWindow: class {
            constructor(options) {
              this.options = options;
            }
            open() {}
            close() {}
            setContent() {}
          },
          LatLng: class {
            constructor(lat, lng) {
              this.lat = lat;
              this.lng = lng;
            }
          }
        }
      };
      setIsMapLoaded(true);
    }, 1000);

    document.head.appendChild(script);
    
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    // Create a custom map visualization since we can't use actual Google Maps in this environment
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';
    
    // Create a custom map background
    const mapDiv = document.createElement('div');
    mapDiv.className = 'relative w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 rounded-2xl overflow-hidden';
    mapDiv.style.backgroundImage = `
      radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)
    `;
    
    // Add grid pattern
    const gridSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    gridSvg.setAttribute('class', 'absolute inset-0 w-full h-full');
    gridSvg.innerHTML = `
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(59, 130, 246, 0.1)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    `;
    
    mapDiv.appendChild(gridSvg);
    mapContainer.appendChild(mapDiv);

    mapInstance.current = { element: mapDiv };
  }, [isMapLoaded]);

  // Update driver markers
  useEffect(() => {
    if (!mapInstance.current || !drivers.length) return;

    const mapElement = mapInstance.current.element;
    
    // Clear existing markers
    const existingMarkers = mapElement.querySelectorAll('.driver-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add new markers
    drivers.forEach(driver => {
      const marker = document.createElement('div');
      marker.className = 'driver-marker absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 hover:z-50';
      
      // Convert lat/lng to map coordinates (simplified for demo)
      const x = ((driver.lng + 74.1) / 0.3) * 100;
      const y = ((40.9 - driver.lat) / 0.2) * 100;
      
      marker.style.left = `${Math.max(5, Math.min(95, x))}%`;
      marker.style.top = `${Math.max(5, Math.min(95, y))}%`;

      const getStatusColor = (status) => {
        switch(status) {
          case 'available': return 'bg-emerald-500 border-emerald-300 shadow-emerald-500/50';
          case 'on-trip': return 'bg-blue-500 border-blue-300 shadow-blue-500/50';
          case 'offline': return 'bg-gray-400 border-gray-300 shadow-gray-400/50';
          case 'maintenance': return 'bg-red-500 border-red-300 shadow-red-500/50';
          default: return 'bg-gray-400 border-gray-300 shadow-gray-400/50';
        }
      };

      marker.innerHTML = `
        <div class="relative">
          <div class="w-8 h-8 ${getStatusColor(driver.status)} rounded-full border-2 border-white shadow-lg flex items-center justify-center ${driver.status === 'on-assignment' ? 'animate-pulse' : ''}">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
            </svg>
          </div>
          ${driver.status === 'on-assignment' ? `
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
          ` : ''}
          <div class="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900/90 text-white px-3 py-2 rounded-lg text-xs opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
            <div class="font-semibold">${driver.name}</div>
            <div class="text-gray-300">${driver.vehicle}</div>
            <div class="text-blue-300 capitalize">${driver.status}</div>
          </div>
        </div>
      `;

      marker.addEventListener('click', () => {
        if (onDriverSelect) {
          onDriverSelect(driver);
        }
      });

      mapElement.appendChild(marker);
    });
  }, [drivers, onDriverSelect]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
          <MapPin className="text-blue-500" size={24} />
          <span>Live Fleet Tracking</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600">Available ({driverStats.available})</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600">On Assignment ({driverStats.onAssignment})</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600">Off Duty ({driverStats.offDuty})</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={mapRef}
          className="w-full h-96 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden"
        >
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-2xl">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading Fleet Map...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-2 space-y-2">
          <button className="w-10 h-10 bg-white hover:bg-gray-50 rounded-xl shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors">
            <Search size={16} />
          </button>
          <button className="w-10 h-10 bg-white hover:bg-gray-50 rounded-xl shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors">
            <RefreshCw size={16} />
          </button>
          <button className="w-10 h-10 bg-white hover:bg-gray-50 rounded-xl shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors">
            <Filter size={16} />
          </button>
        </div>

        {/* Status Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Driver Status</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Available for assignments</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Currently on assignment</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Under maintenance</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-xs text-gray-600">Off duty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
      { id: 1, name: "John Smith", lat: 40.7128, lng: -74.0060, status: "available", vehicle: "Toyota Camry", empId: "DRV001", trips: 45, hoursWorked: 168, phone: "+1-555-0123", department: "Corporate Transport" },
      { id: 2, name: "Sarah Johnson", lat: 40.7589, lng: -73.9851, status: "on-assignment", vehicle: "Honda Accord", empId: "DRV002", trips: 38, hoursWorked: 152, phone: "+1-555-0124", department: "Executive Transport" },
      { id: 3, name: "Mike Wilson", lat: 40.7505, lng: -73.9934, status: "available", vehicle: "Mercedes E-Class", empId: "DRV003", trips: 52, hoursWorked: 176, phone: "+1-555-0125", department: "Executive Transport" },
      { id: 4, name: "Emily Davis", lat: 40.7831, lng: -73.9712, status: "on-assignment", vehicle: "Ford Transit", empId: "DRV004", trips: 41, hoursWorked: 144, phone: "+1-555-0126", department: "Shuttle Service" },
      { id: 5, name: "Robert Brown", lat: 40.7282, lng: -73.7949, status: "off-duty", vehicle: "Chevrolet Suburban", empId: "DRV005", trips: 33, hoursWorked: 120, phone: "+1-555-0127", department: "Airport Service" },
      { id: 6, name: "Lisa Garcia", lat: 40.7900, lng: -73.9441, status: "available", vehicle: "Toyota Highlander", empId: "DRV006", trips: 47, hoursWorked: 160, phone: "+1-555-0128", department: "Corporate Transport" },
      { id: 7, name: "David Miller", lat: 40.7614, lng: -73.9776, status: "maintenance", vehicle: "BMW 5 Series", empId: "DRV007", trips: 29, hoursWorked: 96, phone: "+1-555-0129", department: "Executive Transport" },
      { id: 8, name: "Anna Wilson", lat: 40.7489, lng: -73.9680, status: "on-assignment", vehicle: "Audi A6", empId: "DRV008", trips: 56, hoursWorked: 184, phone: "+1-555-0130", department: "Client Relations" }
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
      "Driver John Smith completed executive transport to JFK Airport",
      "Shuttle request: Marketing team needs transport to client meeting downtown",
      "Vehicle maintenance completed: Unit BMW-007 ready for service",
      "Morning shuttle schedule: 8:30 AM pickup for finance department",
      "Sarah Johnson completed VIP transport for board members",
      "Traffic alert: Route to LaGuardia delayed - rerouting executive transport",
      "New employee orientation: HR requesting airport pickup for new hires",
      "Emergency transport request: IT team needs urgent transport to data center"
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

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
    // You can add more functionality here like showing driver details in a modal
    console.log('Selected driver:', driver);
  };

  // Enhanced metrics calculation
  const driverStats = {
    available: drivers.filter(d => d.status === 'available').length,
    onAssignment: drivers.filter(d => d.status === 'on-assignment').length,
    offDuty: drivers.filter(d => d.status === 'off-duty').length,
    maintenance: drivers.filter(d => d.status === 'maintenance').length,
    total: drivers.length
  };

  const advancedStats = {
    totalHours: 1240,
    avgTransportTime: 24,
    employeeSatisfaction: 4.6,
    fuelEfficiency: 85,
    responseTime: 4.2,
    peakHours: "8:00 AM - 10:00 AM, 5:00 PM - 7:00 PM",
    fleetUtilization: Math.round(((driverStats.available + driverStats.onAssignment) / driverStats.total) * 100),
    costSavings: 15240
  };

  const transportStats = {
    today: {
      completed: 94,
      inProgress: driverStats.onAssignment,
      cancelled: 3,
      totalHours: 156,
      distance: 2847,
      employeesSafelyTransported: 142,
      costSavings: 2840
    },
    total: {
      completed: 8947,
      inProgress: driverStats.onAssignment,
      cancelled: 67,
      totalHours: 12456,
      distance: 234567,
      employeesSafelyTransported: 15847,
      costSavings: 156780
    }
  };

  const recentAssignments = [
    { id: 1, driver: "John Smith", route: "Corporate HQ → JFK Airport", status: "completed", passengers: "Board Members (3)", time: "3 mins ago", distance: "18.2 km", duration: "24 min", department: "Executive" },
    { id: 2, driver: "Sarah Johnson", route: "Office → Client Meeting (Goldman Sachs)", status: "in-progress", passengers: "Sales Team (4)", time: "8 mins ago", distance: "12.1 km", duration: "16 min", department: "Sales" },
    { id: 3, driver: "Mike Wilson", route: "LaGuardia → Corporate HQ", status: "completed", passengers: "New Hires (2)", time: "12 mins ago", distance: "15.7 km", duration: "22 min", department: "HR" },
    { id: 4, driver: "Emily Davis", route: "Office → Downtown Conference Center", status: "completed", passengers: "Marketing Team (6)", time: "18 mins ago", distance: "6.8 km", duration: "14 min", department: "Marketing" },
    { id: 5, driver: "Anna Wilson", route: "Corporate HQ → Medical Center", status: "in-progress", passengers: "Employee (1)", time: "25 mins ago", distance: "11.3 km", duration: "19 min", department: "Emergency" },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Dashboard Content */}
      <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Active Drivers" 
            value={driverStats.available + driverStats.onAssignment} 
            icon={Users} 
            color="text-blue-600" 
            bgColor="bg-blue-100"
            trend={8}
            subtitle="Out of total fleet"
          />
          <StatCard 
            title="Cost Savings" 
            value={advancedStats.costSavings.toLocaleString()} 
            prefix="$"
            icon={DollarSign} 
            color="text-emerald-600" 
            bgColor="bg-emerald-100"
            trend={12}
            subtitle="Monthly vs external transport"
          />
          <StatCard 
            title="Fleet Utilization" 
            value={advancedStats.fleetUtilization}
            suffix="%"
            icon={Gauge} 
            color="text-purple-600" 
            bgColor="bg-purple-100"
            trend={-2}
            subtitle="Current efficiency"
          />
          <StatCard 
            title="Avg Response Time" 
            value={advancedStats.responseTime}
            suffix=" min"
            icon={Clock} 
            color="text-orange-600" 
            bgColor="bg-orange-100"
            trend={-8}
            subtitle="Driver pickup time"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Enhanced Dynamic Fleet Map */}
          <div className="xl:col-span-3">
            <FleetTrackingMap 
              drivers={drivers}
              driverStats={driverStats}
              onDriverSelect={handleDriverSelect}
            />
          </div>

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
                      {activeTab === 'today' ? transportStats.today.completed : transportStats.total.completed.toLocaleString()}
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
                      {activeTab === 'today' ? transportStats.today.inProgress : transportStats.total.inProgress}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="text-amber-600" size={24} />
                      <span className="text-gray-800 font-semibold">Cost Savings</span>
                    </div>
                    <span className="text-3xl font-bold text-amber-600">
                      ${activeTab === 'today' ? transportStats.today.costSavings.toLocaleString() : transportStats.total.costSavings.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics - <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <BarChart3 className="text-blue-500" size={22} />
                <span>Performance Insights</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Avg Transport Time</span>
                  <span className="font-bold text-gray-900">{advancedStats.avgTransportTime} min</span>
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
                  <span className="text-gray-700 font-medium">Employee Satisfaction</span>
                  <span className="font-bold text-yellow-600">{advancedStats.employeeSatisfaction}/5.0 ⭐</span>
                </div>
              </div>
            </div>*/}
            
          </div>
        </div>

        {/* Enhanced Recent Activity Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100/50 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <Route className="text-blue-500" size={28} />
              <span>Recent Employee Transport Activity</span>
            </h3>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 text-sm font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-all">
                <Download size={16} />
                <span>Export Data</span>
              </button>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center space-x-2">
                <span>View All Assignments</span>
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
                  <th className="text-center py-4 px-6 text-gray-700 font-bold text-sm">Passengers</th>
                  <th className="text-center py-4 px-6 text-gray-700 font-bold text-sm">Distance</th>
                  <th className="text-center py-4 px-6 text-gray-700 font-bold text-sm">Duration</th>
                  <th className="text-right py-4 px-6 text-gray-700 font-bold text-sm">Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentAssignments.map((assignment, index) => (
                  <tr key={assignment.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 group">
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <span className="text-white text-sm font-bold">
                            {assignment.driver.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">{assignment.driver}</span>
                          <p className="text-xs text-gray-500">{assignment.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="text-gray-700 font-medium">{assignment.route}</div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className={`px-4 py-2 rounded-full text-xs font-bold inline-flex items-center ${
                        assignment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        assignment.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {assignment.status === 'in-progress' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>}
                        {assignment.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center text-gray-600 font-medium">
                      {assignment.passengers}
                    </td>
                    <td className="py-5 px-6 text-center text-gray-600 font-medium">
                      {assignment.distance}
                    </td>
                    <td className="py-5 px-6 text-center text-gray-600 font-medium">
                      {assignment.duration}
                    </td>
                    <td className="py-5 px-6 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {assignment.department}
                      </span>
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