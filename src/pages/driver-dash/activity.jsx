import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { 
  MapPin, 
  Clock, 
  TrendingUp, 
  Navigation,
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  Target,
  BarChart3,
  Filter,
  Search,
  Download,
  RefreshCw,
  Activity,
  Route,
  TrendingDown,
  Gauge,
  Globe,
  ChevronRight,
  Wifi,
  Zap,
  Truck,
  Signal,
  Phone,
  Calendar,
  Battery,
  Compass,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { useAuth } from '../../authcontext/authcontext';


// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

// Enhanced API service with live location features
const fleetAPI = {
  getRealDrivers: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/drivers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch real drivers');
    return response.json();
  },

  getDriverLocations: async (since = null) => {
    const token = localStorage.getItem('token');
    const url = since 
      ? `${API_BASE_URL}/drivers/locations?since=${since}`
      : `${API_BASE_URL}/drivers/locations`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch driver locations');
    return response.json();
  },

  getRealStatistics: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/drivers/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch real statistics');
    return response.json();
  },

  // NEW: Fetch live location for specific driver
  fetchLiveLocation: async (driverId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/fetch-live-location`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch live location');
    return response.json();
  },

  // NEW: Fetch live locations for all drivers
  fetchAllLiveLocations: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/drivers/fetch-all-live-locations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch all live locations');
    return response.json();
  },

  // NEW: Location service control
  getLocationServiceStatus: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/location-service/status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to fetch service status');
    return response.json();
  },

  startLocationService: async (intervalMinutes = 2) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/location-service/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ intervalMinutes })
    });
    if (!response.ok) throw new Error('Failed to start location service');
    return response.json();
  },

  stopLocationService: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/location-service/stop`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to stop location service');
    return response.json();
  },

  triggerLocationUpdate: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/location-service/trigger-update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Failed to trigger location update');
    return response.json();
  }
};

// Enhanced Google Maps component with live location features
const FleetTrackingMap = ({ drivers, driverStats, onDriverSelect, isLoading, serviceStatus }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { user } = useAuth();

  // Load Google Maps API
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsMapLoaded(true);
    };

    script.onerror = () => {
      console.error('Google Maps API failed to load');
    };

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

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: -13.2543, lng: 34.3015 },
      zoom: 7,
      disableDefaultUI: true,
      styles: [
        {
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#6B7280"}]
        },
        {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [{"color": "#F9FAFB"}]
        },
        {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "road",
          "elementType": "all",
          "stylers": [{"saturation": -100}, {"lightness": 45}]
        },
        {
          "featureType": "water",
          "elementType": "all",
          "stylers": [{"color": "#3B82F6"}, {"visibility": "on"}]
        }
      ]
    });

    mapInstance.current = map;

    const malawiBounds = new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(-17.129, 32.670),
      new window.google.maps.LatLng(-9.368, 35.918)
    );
    map.fitBounds(malawiBounds);

    return () => {
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
  }, [isMapLoaded]);


  useEffect(() => {
  if (!isMapLoaded) return;

  // Request user's location
  const requestUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('User location obtained:', position.coords);
          // You can use this location to center the map or send to backend
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp)
          };
          
          // Update map center to user's location
          if (mapInstance.current) {
            mapInstance.current.setCenter({
              lat: userLocation.lat,
              lng: userLocation.lng
            });
            mapInstance.current.setZoom(12); // Zoom in closer
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
          // Fallback to Malawi if location access is denied
          if (mapInstance.current) {
            mapInstance.current.setCenter({ lat: -13.2543, lng: 34.3015 });
            mapInstance.current.setZoom(7);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  requestUserLocation();
}, [isMapLoaded]);

  // Enhanced marker creation with live location indicators
  useEffect(() => {
    if (!mapInstance.current || !drivers.length) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const getEnhancedMarkerIcon = (driver) => {
      const { status, isOnline, hasGPSEnabled, isMoving, speed } = driver;
      
      let color = '#9CA3AF';
      let strokeColor = '#6B7280';
      let scale = 8;

      if (!isOnline) {
        color = '#9CA3AF';
        strokeColor = '#6B7280';
      } else if (!hasGPSEnabled) {
        color = '#EF4444';
        strokeColor = '#DC2626';
      } else {
        switch(status) {
          case 'available':
            color = '#10B981';
            strokeColor = '#059669';
            break;
          case 'on-assignment':
            color = '#3B82F6';
            strokeColor = '#2563EB';
            break;
          case 'off-duty':
            color = '#9CA3AF';
            strokeColor = '#6B7280';
            break;
          case 'maintenance':
            color = '#EF4444';
            strokeColor = '#DC2626';
            break;
        }
      }

      // Larger marker for moving drivers
      if (isMoving && speed > 5) {
        scale = 10;
        strokeColor = '#F59E0B'; // Orange border for moving drivers
      }

      return { 
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: strokeColor,
        strokeWeight: hasGPSEnabled ? 3 : 2,
        scale: scale
      };
    };

    drivers.forEach(driver => {
      if (!driver.lat || !driver.lng) return;

      const marker = new window.google.maps.Marker({
        position: { lat: driver.lat, lng: driver.lng },
        map: mapInstance.current,
        icon: getEnhancedMarkerIcon(driver),
        title: `${driver.name} - ${driver.vehicle}`
      });

      const lastUpdateTime = driver.lastUpdate ? new Date(driver.lastUpdate).toLocaleString() : 'Never';
      const accuracyText = driver.locationAccuracy ? `±${driver.locationAccuracy}m` : 'Unknown';
      const speedText = driver.speed ? `${driver.speed} km/h` : 'Unknown';
      const batteryText = driver.batteryLevel ? `${driver.batteryLevel}%` : 'Unknown';
      const headingText = driver.heading ? `${driver.heading}°` : 'Unknown';

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-4 min-w-[280px]">
            <div class="flex items-center gap-2 mb-3">
              <h3 class="font-semibold text-gray-900 text-lg">${driver.name}</h3>
              ${driver.isOnline ? '<div class="w-3 h-3 bg-green-500 rounded-full"></div>' : '<div class="w-3 h-3 bg-gray-400 rounded-full"></div>'}
              ${driver.isMoving ? '<div class="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">MOVING</div>' : ''}
            </div>
            
            <p class="text-sm text-gray-600 mb-2 font-medium">${driver.vehicle}</p>
            <p class="text-sm font-semibold ${getStatusColorClass(driver.status)} mb-3">${driver.status.replace('-', ' ').toUpperCase()}</p>
            
            <div class="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-3">
              <div>
                <span class="font-medium text-gray-700">ID:</span><br>
                <span>${driver.empId}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Dept:</span><br>
                <span>${driver.department}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Speed:</span><br>
                <span class="font-medium ${driver.isMoving ? 'text-orange-600' : 'text-gray-500'}">${speedText}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Battery:</span><br>
                <span class="font-medium ${driver.batteryLevel < 20 ? 'text-red-600' : 'text-green-600'}">${batteryText}</span>
              </div>
            </div>
            
            <div class="text-xs text-gray-500 space-y-1 border-t pt-2">
              <p><span class="font-medium">Last Update:</span> ${lastUpdateTime}</p>
              <p><span class="font-medium">Accuracy:</span> ${accuracyText}</p>
              <p><span class="font-medium">Heading:</span> ${headingText}</p>
              <p><span class="font-medium">Source:</span> ${driver.locationSource || 'manual'}</p>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstance.current, marker);
        if (onDriverSelect) {
          onDriverSelect(driver);
        }
      });

      markersRef.current.push(marker);
    });

    function getStatusColorClass(status) {
      switch(status) {
        case 'available': return 'text-emerald-600';
        case 'on-assignment': return 'text-blue-600';
        case 'off-duty': return 'text-gray-600';
        case 'maintenance': return 'text-red-600';
        default: return 'text-gray-600';
      }
    }

  }, [drivers, onDriverSelect]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full min-h-[600px]">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <MapPin className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Live Fleet Tracking</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Real-time GPS tracking</span>
              {serviceStatus?.isRunning && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Live</span>
                </div>
              )}
            </div>
          </div>
          {isLoading && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-gray-600">Available ({driverStats.available})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Active ({driverStats.onAssignment})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Moving ({driverStats.moving || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">Online ({driverStats.online || 0})</span>
          </div>
        </div>
      </div>
      
      <div className="relative flex-1" style={{ height: 'calc(100% - 80px)' }}>
        <div 
          ref={mapRef}
          className="w-full h-full"
        >
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600 font-medium">Loading map...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Map Controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button 
            className="w-8 h-8 bg-white hover:bg-gray-50 rounded-lg shadow-md flex items-center justify-center text-gray-600 border border-gray-200"
            onClick={() => {
              if (mapInstance.current) {
                const malawiBounds = new window.google.maps.LatLngBounds(
                  new window.google.maps.LatLng(-17.129, 32.670),
                  new window.google.maps.LatLng(-9.368, 35.918)
                );
                mapInstance.current.fitBounds(malawiBounds);
              }
            }}
            title="Fit to Malawi"
          >
            <Globe size={14} />
          </button>
        </div>

        {/* Enhanced Status Legend */}
        <div className="absolute bottom-3 left-3 bg-white rounded-lg shadow-md border border-gray-200 p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">Driver Status</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-gray-600">Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">Off Duty</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Maintenance</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-700 mb-1">Live Tracking</div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Moving (Larger marker)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced main dashboard component
const DriverDashboard = () => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [driverStats, setDriverStats] = useState({
    available: 0,
    onAssignment: 0,
    offDuty: 0,
    maintenance: 0,
    total: 0,
    online: 0,
    withGPS: 0,
    moving: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastLocationUpdate, setLastLocationUpdate] = useState(null);
  const [serviceStatus, setServiceStatus] = useState(null);
  const socketRef = useRef(null);

  // Initialize WebSocket connection with enhanced event handling
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return;
    }

    socketRef.current = io(SOCKET_URL, {
      auth: { token }
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to WebSocket server for real-time tracking');
      // Request current locations on connect
      socket.emit('request-current-locations');
      socket.emit('request-service-status');
    });

    socket.on('driver-location-update', (data) => {
      console.log('Real-time location update received:', data);
      setDrivers(prevDrivers =>
        prevDrivers.map(driver =>
          driver.empId === data.driverId
            ? {
                ...driver,
                lat: data.location.latitude,
                lng: data.location.longitude,
                lastUpdate: data.timestamp,
                locationAccuracy: data.accuracy,
                locationSource: data.source || 'gps',
                speed: data.speed,
                heading: data.heading,
                batteryLevel: data.batteryLevel,
                isMoving: data.speed > 5
              }
            : driver
        )
      );
      setLastLocationUpdate(new Date());
    });

    socket.on('location-service-update', (data) => {
      console.log('Location service update:', data);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'info',
        message: `Location updated for ${data.driversUpdated}/${data.driversTotal} drivers`,
        timestamp: data.timestamp
      }, ...prev.slice(0, 4)]);
    });

    socket.on('service-status', (data) => {
      if (data.success) {
        setServiceStatus(data.data);
      }
    });

    socket.on('current-locations', (data) => {
      if (data.success) {
        console.log('Received current locations:', data.data.length);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [driversResponse, statsResponse, serviceResponse] = await Promise.all([
          fleetAPI.getRealDrivers(),
          fleetAPI.getRealStatistics(),
          fleetAPI.getLocationServiceStatus()
        ]);

        if (driversResponse.success) {
          setDrivers(driversResponse.data);
          console.log('Loaded real drivers:', driversResponse.data.length);
        }

        if (statsResponse.success) {
          setDriverStats(statsResponse.data);
          console.log('Loaded real statistics:', statsResponse.data);
        }

        if (serviceResponse.success) {
          setServiceStatus(serviceResponse.data);
        }

        setError(null);
      } catch (error) {
        console.error('Error fetching initial real data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Enhanced refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [driversResponse, statsResponse] = await Promise.all([
        fleetAPI.getRealDrivers(),
        fleetAPI.getRealStatistics()
      ]);

      if (driversResponse.success) {
        setDrivers(driversResponse.data);
      }

      if (statsResponse.success) {
        setDriverStats(statsResponse.data);
      }

      setError(null);
      setLastLocationUpdate(new Date());
      console.log('Manual refresh completed');
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError(error.message);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  // NEW: Trigger live location update
  const handleTriggerLocationUpdate = async () => {
    try {
      setIsRefreshing(true);
      const response = await fleetAPI.triggerLocationUpdate();
      if (response.success) {
        setNotifications(prev => [{
          id: Date.now(),
          type: 'success',
          message: `Live locations updated for ${response.data.driversUpdated} drivers`,
          timestamp: new Date()
        }, ...prev.slice(0, 4)]);
        
        // Refresh driver data after location update
        setTimeout(() => {
          handleRefresh();
        }, 2000);
      }
    } catch (error) {
      console.error('Error triggering location update:', error);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'error',
        message: 'Failed to update live locations',
        timestamp: new Date()
      }, ...prev.slice(0, 4)]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // NEW: Control location service
  const handleServiceControl = async (action) => {
    try {
      let response;
      if (action === 'start') {
        response = await fleetAPI.startLocationService(2);
      } else {
        response = await fleetAPI.stopLocationService();
      }
      
      if (response.success) {
        const status = await fleetAPI.getLocationServiceStatus();
        if (status.success) {
          setServiceStatus(status.data);
        }
        
        setNotifications(prev => [{
          id: Date.now(),
          type: 'success',
          message: response.message,
          timestamp: new Date()
        }, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error(`Error ${action}ing location service:`, error);
      setNotifications(prev => [{
        id: Date.now(),
        type: 'error',
        message: `Failed to ${action} location service`,
        timestamp: new Date()
      }, ...prev.slice(0, 4)]);
    }
  };

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
    console.log('Selected real driver:', driver);
  };

  // Enhanced statistics
  const advancedStats = {
    totalHours: driverStats.totalHours || 0,
    avgTransportTime: driverStats.avgTransportTime || 0,
    employeeSatisfaction: driverStats.employeeSatisfaction || 0,
    fuelEfficiency: driverStats.fuelEfficiency || 0,
    responseTime: driverStats.responseTime || 0,
    fleetUtilization: driverStats.fleetUtilization || 0,
    costSavings: driverStats.costSavings || 0
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle, prefix = "", suffix = "" }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color === 'text-blue-600' ? 'bg-blue-50' : color === 'text-emerald-600' ? 'bg-emerald-50' : color === 'text-purple-600' ? 'bg-purple-50' : 'bg-orange-50'}`}>
          <Icon size={20} className={color} />
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
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {prefix}{value}{suffix}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</div>
      {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Loading Fleet Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-gray-900 font-semibold mb-1">Connection Error</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Enhanced Header with Live Tracking Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Fleet Management</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Signal className="w-4 h-4 text-green-500" />
                <span>GPS tracking {serviceStatus?.isRunning ? 'active' : 'inactive'}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>{drivers.filter(d => d.hasGPSEnabled).length} GPS enabled</span>
              </div>
              <div className="flex items-center gap-1">
                <Navigation className="w-4 h-4 text-orange-500" />
                <span>{drivers.filter(d => d.isMoving).length} moving</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi className="w-4 h-4 text-green-500" />
                <span>{driverStats.online || 0} online</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Location Service Controls */}
            <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => handleServiceControl('start')}
                disabled={serviceStatus?.isRunning}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500 text-white rounded disabled:bg-gray-300"
                title="Start Location Service"
              >
                <Play size={12} />
                Start
              </button>
              <button
                onClick={() => handleServiceControl('stop')}
                disabled={!serviceStatus?.isRunning}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500 text-white rounded disabled:bg-gray-300"
                title="Stop Location Service"
              >
                <Square size={12} />
                Stop
              </button>
            </div>
            
            <button
              onClick={handleTriggerLocationUpdate}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
              title="Fetch Live Locations Now"
            >
              <Zap size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Live Update
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Active Drivers" 
            value={driverStats.active + driverStats.onAssignment} 
            icon={Users} 
            color="text-blue-600" 
            trend={8}
            subtitle={`${drivers.length} total`}
          />
          <StatCard 
            title="GPS Enabled" 
            value={driverStats.withGPS || drivers.filter(d => d.hasGPSEnabled).length}
            icon={MapPin} 
            color="text-emerald-600" 
            trend={12}
            subtitle="Real-time tracking"
          />
          <StatCard 
            title="Currently Moving" 
            value={driverStats.moving || drivers.filter(d => d.isMoving).length}
            icon={Navigation} 
            color="text-orange-600" 
            trend={5}
            subtitle="Live movement"
          />
          <StatCard 
            title="Fleet Utilization" 
            value={advancedStats.fleetUtilization}
            suffix="%"
            icon={Gauge} 
            color="text-purple-600" 
            trend={-2}
            subtitle="Efficiency rate"
          />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          <div className="xl:col-span-3">
            <FleetTrackingMap 
              drivers={drivers}
              driverStats={driverStats}
              onDriverSelect={handleDriverSelect}
              isLoading={isRefreshing}
              serviceStatus={serviceStatus}
            />
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-4">
            {/* Live Tracking Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Signal className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Live Tracking</h3>
                {serviceStatus?.isRunning && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Status:</span>
                  <span className={`font-medium ${serviceStatus?.isRunning ? 'text-green-600' : 'text-red-600'}`}>
                    {serviceStatus?.isRunning ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Update:</span>
                  <span className="font-medium text-gray-700">
                    {serviceStatus?.lastUpdateTime ? new Date(serviceStatus.lastUpdateTime).toLocaleTimeString() : 'Never'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GPS Enabled:</span>
                  <span className="font-medium text-blue-600">{driverStats.withGPS || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Moving Now:</span>
                  <span className="font-medium text-orange-600">{drivers.filter(d => d.isMoving).length}</span>
                </div>
              </div>
            </div>

            {/* Driver Status Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Driver Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-emerald-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Available</span>
                  <span className="text-lg font-bold text-emerald-600">{driverStats.available}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium text-gray-700">On Assignment</span>
                  <span className="text-lg font-bold text-blue-600">{driverStats.onAssignment}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Off Duty</span>
                  <span className="text-lg font-bold text-gray-600">{driverStats.offDuty}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm font-medium text-gray-700">Maintenance</span>
                  <span className="text-lg font-bold text-red-600">{driverStats.maintenance}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {notifications.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="space-y-2">
                  {notifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className={`p-2 rounded text-xs ${
                      notification.type === 'error' ? 'bg-red-50 border-l-2 border-red-500' :
                      notification.type === 'success' ? 'bg-green-50 border-l-2 border-green-500' :
                      'bg-blue-50 border-l-2 border-blue-500'
                    }`}>
                      <p className="text-gray-800 font-medium leading-tight">{notification.message}</p>
                      <p className="text-gray-500 mt-1">{new Date(notification.timestamp).toLocaleTimeString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {notifications.length === 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="text-center py-4">
                  <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recent activity</p>
                  <p className="text-xs text-gray-400">Live tracking events will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Driver List with Live Data */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Driver Fleet ({drivers.length})</h3>
              {serviceStatus?.isRunning && (
                <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Tracking
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span>Updated: {lastLocationUpdate ? lastLocationUpdate.toLocaleTimeString() : 'Never'}</span>
              <button className="text-blue-600 hover:text-blue-700 font-medium">Export</button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {drivers.map((driver) => (
                <div key={driver.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center relative">
                        <span className="text-white text-xs font-bold">
                          {driver.name.split(' ').map(n => n[0]).join('')}
                        </span>
                        {driver.isMoving && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">{driver.name}</h4>
                        <p className="text-xs text-gray-500">{driver.empId}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {driver.isOnline && <Wifi className="w-3 h-3 text-green-500" />}
                      {driver.hasGPSEnabled && <MapPin className="w-3 h-3 text-blue-500" />}
                      {driver.isMoving && <Navigation className="w-3 h-3 text-orange-500" />}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-medium ${
                        driver.status === 'available' ? 'text-emerald-600' :
                        driver.status === 'on-assignment' ? 'text-blue-600' :
                        driver.status === 'off-duty' ? 'text-gray-600' :
                        'text-red-600'
                      }`}>
                        {driver.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    {driver.speed !== null && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Speed:</span>
                        <span className={`font-medium ${driver.isMoving ? 'text-orange-600' : 'text-gray-600'}`}>
                          {driver.speed} km/h
                        </span>
                      </div>
                    )}
                    {driver.batteryLevel && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Battery:</span>
                        <div className="flex items-center gap-1">
                          <Battery className={`w-3 h-3 ${driver.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`} />
                          <span className={`font-medium ${driver.batteryLevel < 20 ? 'text-red-600' : 'text-green-600'}`}>
                            {driver.batteryLevel}%
                          </span>
                        </div>
                      </div>
                    )}
                    {driver.lastUpdate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Updated:</span>
                        <span className="font-medium text-gray-700">
                          {new Date(driver.lastUpdate).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                    <span>Trips: {driver.trips}</span>
                    <span>Hrs: {driver.hoursWorked}</span>
                    <span className={`flex items-center gap-1 ${driver.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                      {driver.isOnline ? (
                        <>
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          Online
                        </>
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          Offline
                        </>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {drivers.length === 0 && (
              <div className="text-center py-8">
                <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No drivers found</p>
                <p className="text-gray-400 text-sm">Add drivers to your fleet to see them here</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;