import React, { useCallback, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { GoogleMap, Marker, useLoadScript, Libraries } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setSelectedLocation({ lat, lng });

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results?.[0]) {
          setCurrentAddress(results[0].formatted_address);
        }
      });
    }
  }, []);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setSelectedLocation({ lat, lng });
        setCurrentAddress(place.formatted_address || '');

        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(12); // 적절한 줌 레벨 설정
        }
      }
    }
  };

  const handleConfirm = () => {
    onLocationChange({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      address: currentAddress,
    });
    setModalIsOpen(false);
  };

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (inputRef.current) {
      const searchBox = new window.google.maps.places.SearchBox(inputRef.current);
      searchBoxRef.current = searchBox;
      searchBox.addListener('places_changed', onPlacesChanged);
    }
  };

  return (
    <div className="mt-[80px]">
      <button
        onClick={() => setModalIsOpen(true)}
        className="w-full h-[4rem] rounded-[8px] border border-[#cfcfcf] flex items-center px-4 py-2 text-neutral-500 text-lg shadow-sm hover:bg-gray-100 transition"
      >
        <div className="flex-1 text-left text-[#cfcfcf]">{selectedLocationName || '지역 선택'}</div>
        <img src={SearchIcon.src} alt="Search Icon" className="w-6 h-6 ml-2" />
      </button>
      <Modal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal-dialog-centered"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            위치 선택
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="relative w-full h-[50rem]">
            {isLoaded ? (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="장소를 검색하세요"
                  className="absolute z-10 top-4 left-1/2 transform -translate-x-1/2 w-[80%] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                />
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={selectedLocation}
                  zoom={12}
                  onClick={onMapClick}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                  }}
                  onLoad={onMapLoad} // Map을 로드하면 onMapLoad 호출
                >
                  <Marker position={selectedLocation} draggable={true} onDragEnd={onMapClick} />
                </GoogleMap>
              </>
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={handleConfirm}
            className="mt-2 bg-rose-500 rounded-lg flex justify-center items-center px-8 py-3 text-white text-lg mr-2 hover:bg-rose-600 transition"
          >
            확인
          </button>
          <button
            onClick={() => setModalIsOpen(false)}
            className="mt-2 rounded-lg flex justify-center border border-[#cfcfcf] items-center px-8 py-3 text-[#9d9d9d] text-lg hover:bg-gray-200 transition"
          >
            취소
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LocationInput;