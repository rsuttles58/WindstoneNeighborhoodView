import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Location, HolidayType } from '../types';

interface MapProps {
  locations: Location[];
  center: { lat: number; lng: number };
  bounds?: { north: number; south: number; east: number; west: number };
  onLocationClick?: (location: Location) => void;
}

const containerStyle = {
  width: '100%',
  height: '600px',
};

// Get emoji for Halloween decorations based on properties
const getHalloweenEmoji = (properties: string[]): string => {
  // Priority order: check for specific decorations
  if (properties.includes('scary_props')) return '😱';
  if (properties.includes('pumpkins')) return '🎃';
  if (properties.includes('skeleton_display')) return '💀';
  if (properties.includes('graveyard')) return '🪦';
  // Default Halloween emoji if none of the specific ones match
  return '👻';
};

// Custom marker icons for different holidays using emoji/SVG
const getMarkerIcon = (location: Location, size: number): google.maps.Icon => {
  // Create custom SVG markers with emoji
  const createSvgMarker = (emoji: string, color: string): string => {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="${color}" stroke="white" stroke-width="3"/>
        <text x="24" y="30" text-anchor="middle" font-size="24">${emoji}</text>
      </svg>
    `)}`;
  };

  const halfSize = size / 2;

  switch (location.holiday_type) {
    case 'halloween':
      return {
        url: createSvgMarker(getHalloweenEmoji(location.properties), '#FF6B35'),
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(halfSize, halfSize)
      };
    case 'christmas':
      return {
        url: createSvgMarker('🎄', '#D62828'),
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(halfSize, halfSize)
      };
    case 'easter':
      return {
        url: createSvgMarker('🐰', '#F77FBE'),
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(halfSize, halfSize)
      };
    default:
      return {
        url: createSvgMarker('🎉', '#007BFF'),
        scaledSize: new google.maps.Size(size, size),
        anchor: new google.maps.Point(halfSize, halfSize)
      };
  }
};

const Map: React.FC<MapProps> = ({ locations, center, bounds, onLocationClick }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerSize, setMarkerSize] = useState(32);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    // If bounds are provided, fit the map to those bounds
    if (bounds) {
      const googleBounds = new google.maps.LatLngBounds(
        { lat: bounds.south, lng: bounds.west },
        { lat: bounds.north, lng: bounds.east }
      );
      map.fitBounds(googleBounds);
    }

    // Update marker size based on zoom level
    const updateMarkerSize = () => {
      const zoom = map.getZoom() || 14;
      // Scale markers based on zoom: zoom 10 = 20px, zoom 15 = 32px, zoom 18 = 40px
      const size = Math.min(Math.max(zoom * 2, 20), 40);
      setMarkerSize(size);
    };

    updateMarkerSize();
    map.addListener('zoom_changed', updateMarkerSize);
  }, [bounds]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  const mapOptions: google.maps.MapOptions = {
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ],
    disableDefaultUI: false, // Keep zoom controls
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={{
            lat: Number(location.latitude),
            lng: Number(location.longitude),
          }}
          icon={getMarkerIcon(location, markerSize)}
          onClick={() => handleMarkerClick(location)}
        />
      ))}

      {selectedLocation && (
        <InfoWindow
          position={{
            lat: Number(selectedLocation.latitude),
            lng: Number(selectedLocation.longitude),
          }}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div style={{ maxWidth: '250px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
              {selectedLocation.holiday_type.charAt(0).toUpperCase() + 
               selectedLocation.holiday_type.slice(1)} Decorations
            </h3>
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
              <strong>Address:</strong> {selectedLocation.address}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Features:</strong>
            </p>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {selectedLocation.properties.map((prop, index) => (
                <li key={index}>{prop.replace(/_/g, ' ')}</li>
              ))}
            </ul>
            {selectedLocation.notes && (
              <p style={{ margin: '5px 0', fontStyle: 'italic' }}>
                {selectedLocation.notes}
              </p>
            )}
            {selectedLocation.submitted_by && (
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                Submitted by: {selectedLocation.submitted_by}
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default Map;

