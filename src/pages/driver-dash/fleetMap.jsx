import { GoogleMap, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api';
import { useMemo, useState } from 'react';

const MapComponent = ({ drivers, selectedDriver, onDriverSelect }) => {
  const [activeMarker, setActiveMarker] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['geometry', 'places'] // Add additional libraries as needed
  });

  // Fit bounds to show all drivers when data changes
  const onLoad = (map) => {
    setMapRef(map);
    if (drivers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      drivers.forEach(driver => {
        bounds.extend({ lat: driver.lat, lng: driver.lng });
      });
      map.fitBounds(bounds);
      
      // Add padding if needed
      map.padding = 50;
    }
  };

  // Center map on selected driver
  useMemo(() => {
    if (selectedDriver && mapRef) {
      setCenter({ lat: selectedDriver.lat, lng: selectedDriver.lng });
      mapRef.panTo({ lat: selectedDriver.lat, lng: selectedDriver.lng });
      mapRef.setZoom(15); // Zoom in when selecting a driver
    }
  }, [selectedDriver, mapRef]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      zoom={12}
      center={center}
      onLoad={onLoad}
      mapContainerClassName="w-full h-full rounded-2xl"
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: mapStyles // Custom map styles (optional)
      }}
    >
      {drivers.map(driver => (
        <Marker
          key={driver.id}
          position={{ lat: driver.lat, lng: driver.lng }}
          icon={{
            url: getDriverIcon(driver.status),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 16)
          }}
          onClick={() => {
            setActiveMarker(driver.id);
            onDriverSelect(driver);
          }}
        >
          {activeMarker === driver.id && (
            <InfoWindow
              onCloseClick={() => setActiveMarker(null)}
              position={{ lat: driver.lat, lng: driver.lng }}
            >
              <div className="p-2">
                <h3 className="font-bold">{driver.name}</h3>
                <p>{driver.vehicle}</p>
                <p className="capitalize">{driver.status.replace('-', ' ')}</p>
                <p>Rating: {driver.rating}/5</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
};

// Custom map styling (optional)
const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
];

// Enhanced icon handling with fallbacks
const getDriverIcon = (status) => {
  // In production, you might use a CDN or local assets
  const iconBase = 'https://maps.google.com/mapfiles/ms/icons/';
  
  const icons = {
    'available': `${iconBase}green-dot.png`,
    'on-trip': `${iconBase}blue-dot.png`,
    'offline': `${iconBase}gray-dot.png`,
    'maintenance': `${iconBase}red-dot.png`
  };
  
  return icons[status] || `${iconBase}yellow-dot.png`;
};

export default MapComponent;