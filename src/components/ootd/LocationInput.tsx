import React, { useCallback, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { GoogleMap, Marker, useLoadScript, Libraries } from '@react-google-maps/api';

interface LocationInputProps {
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
  selectedLocationName: string;
}

const libraries: Libraries = ['places'];

const LocationInput: React.FC<LocationInputProps> = ({ onLocationChange, selectedLocationName }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>({
    lat: 37.5665, // Default latitude
    lng: 126.9780, // Default longitude
  });

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelectedLocation({ lat, lng });

      // Address lookup, but do not update parent location on map click
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          // Only update the location on confirm
        }
      });
    }
  }, []);

  const handleConfirm = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: selectedLocation }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        onLocationChange({
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          address: results[0].formatted_address,
        });
        setModalIsOpen(false);
      }
    });
  };

  return (
    <div>
      <button
        onClick={() => setModalIsOpen(true)}
        className="w-full bg-neutral-100 rounded-lg flex justify-center items-center py-4 text-neutral-500 text-lg"
      >
        {selectedLocationName || '지역선택'}
      </button>
      <Modal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            위치 선택
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-full h-[50rem]">
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={selectedLocation}
              zoom={10}
              onClick={onMapClick}
            >
              <Marker position={selectedLocation} draggable={true} onDragEnd={onMapClick} />
            </GoogleMap>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => setModalIsOpen(false)}
            className="mt-2 bg-rose-500 rounded-lg flex justify-center items-center px-6 py-3 text-white text-lg"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="mt-2 bg-rose-500 rounded-lg flex justify-center items-center px-6 py-3 text-white text-lg"
          >
            확인
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LocationInput;
