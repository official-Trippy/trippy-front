import React, { useCallback, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { GoogleMap, Marker, useLoadScript, Libraries } from '@react-google-maps/api';
import SearchIcon from '../../../public/icon_search.svg'; 

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
    lat: 37.5665, 
    lng: 126.9780, 
  });
  const [currentAddress, setCurrentAddress] = useState<string>('');

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelectedLocation({ lat, lng });

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          console.log(results[0]);
          setCurrentAddress(results[0].formatted_address);
        }
      });
    }
  }, []);

  const handleConfirm = () => {
    onLocationChange({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      address: currentAddress,
    });
    setModalIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setModalIsOpen(true)}
        className="w-full h-[4rem] rounded border border-[#cfcfcf] flex items-center p-2 text-neutral-500 text-lg"
      >
        <div className="flex-1 text-left text-neutral-500">{selectedLocationName || '지역 선택'}</div>
        <img src={SearchIcon.src} alt="Search Icon" className="w-6 h-6 ml-2" />
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
