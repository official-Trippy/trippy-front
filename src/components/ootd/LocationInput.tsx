import React, { useCallback, useState } from 'react';
import { GoogleMap, Marker, useLoadScript, Libraries } from '@react-google-maps/api';

interface LocationInputProps {
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
}

const libraries: Libraries = ['places'];

const LocationInput: React.FC<LocationInputProps> = ({ onLocationChange }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>({
    lat: 37.5665, // Default latitude
    lng: 126.9780, // Default longitude
  });

  const onMapClick = useCallback((event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });

    // Geocode the location to get the address
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        onLocationChange({ lat, lng, address: results[0].formatted_address });
      }
    });
  }, [onLocationChange]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-full h-96">
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={selectedLocation}
        zoom={10}
        onClick={onMapClick}
      >
        <Marker position={selectedLocation} draggable={true} onDragEnd={onMapClick} />
      </GoogleMap>
    </div>
  );
};

export default LocationInput;
