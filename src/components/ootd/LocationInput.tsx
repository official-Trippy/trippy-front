import React from 'react';
import Select from 'react-select';
import { LOCATIONS, LocationKey } from '@/constants/locations';

const LOCATION_OPTIONS = Object.values(LOCATIONS).map(location => ({
  value: location.value,
  label: location.label
}));

interface LocationInputProps {
  onLocationChange: (location: LocationKey | '') => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationChange }) => {
  const handleChange = (selectedOption: { value: string; label: string } | null) => {
    if (selectedOption) {
      onLocationChange(selectedOption.value as LocationKey);
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
