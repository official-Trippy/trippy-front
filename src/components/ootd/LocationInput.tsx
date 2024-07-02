import React from 'react';
import Select from 'react-select';
import * as locations from '@/constants/locations';

const LOCATION_OPTIONS = [
  locations.SEOUL, locations.BUSAN, locations.INCHEON, locations.DAEGU,
  locations.GWANGJU, locations.DAEJEON, locations.ULSAN, locations.SEJONG,
  locations.GYEONGGI, locations.GANGWON, locations.CHUNGBUK, locations.CHUNGNAM,
  locations.JEONBUK, locations.JEONNAM, locations.GYEONGBUK, locations.GYEONGNAM,
  locations.JEJU
];

interface LocationInputProps {
  onLocationChange: (location: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationChange }) => {
  const handleChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      onLocationChange(selectedOption.value);
    } else {
      onLocationChange('');
    }
  };

  return (
    <div className="space-y-2">
      <Select
        options={LOCATION_OPTIONS}
        onChange={handleChange}
        placeholder="지역 선택"
        className="w-full"
      />
    </div>
  );
};

export default LocationInput;
