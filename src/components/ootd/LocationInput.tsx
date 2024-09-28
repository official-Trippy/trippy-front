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
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([]); 
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

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

  const handleInputChange = () => {
    const input = inputRef.current?.value;
    if (input && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions({ input }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setAutocompleteResults(predictions);
        }
      });
    }
  };

  const onPlaceSelect = (placeId: string) => {
    if (placesServiceRef.current) {
      placesServiceRef.current.getDetails({ placeId }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setSelectedLocation({ lat, lng });
          setCurrentAddress(place.formatted_address || '');
  
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(15);
          }

          setAutocompleteResults([]); 
        }
      });
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
    autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
    placesServiceRef.current = new window.google.maps.places.PlacesService(map);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && autocompleteResults.length > 0) {
      onPlaceSelect(autocompleteResults[0].place_id); 
      event.preventDefault();  
    }
  };

  return (
<div className="mt-[80px]">
  <button
    onClick={() => setModalIsOpen(true)}
    className="w-full h-[4rem] rounded-[8px] border border-[#cfcfcf] flex items-center pl-[1.4rem] pr-3 py-2 text-neutral-500 text-lg shadow-sm hover:bg-gray-100 transition"
  >
    <div className="flex-1 text-left text-[#cfcfcf]">{selectedLocationName || '위치 선택'}</div>
    <img src={SearchIcon.src} alt="Search Icon" className="w-[24px] h-[24px] mr-1" />
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
      <Modal.Title id="contained-modal-title-vcenter">위치 선택</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="relative w-full h-[30rem] sm-700:h-[50rem] sm-700:py-[2rem]"> {/* 모바일에서 높이 조정 */}
        {isLoaded ? (
          <>
            <input
              ref={inputRef}
              type="text"
              placeholder="장소를 검색하세요"
              className="absolute z-10 top-4 left-1/2 transform -translate-x-1/2 w-[80%] p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            {/* 검색 결과를 보여주는 리스트 */}
            {autocompleteResults.length > 0 && (
              <ul className="absolute z-10 w-[80%] top-[4.7rem] pl-0 left-1/2 transform -translate-x-1/2 bg-white shadow-lg border rounded-lg">
                {autocompleteResults.map((result) => (
                  <li
                    key={result.place_id}
                    className="p-3 hover:bg-gray-200 cursor-pointer"
                    onClick={() => onPlaceSelect(result.place_id)}
                  >
                    {result.description}
                  </li>
                ))}
              </ul>
            )}
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={selectedLocation}
              zoom={12}
              onClick={onMapClick}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
              }}
              onLoad={onMapLoad}
            >
              <Marker position={selectedLocation} draggable={true} onDragEnd={onMapClick} />
            </GoogleMap>
          </>
        ) : (
          <div></div>
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