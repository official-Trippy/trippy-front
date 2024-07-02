'use client';

import React from 'react';

interface LocationInputProps {
  onLocationChange: (location: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationChange }) => {
  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onLocationChange(event.target.value);
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="위치 추가"
        className="w-full border p-2 rounded"
        onChange={handleLocationChange}
      />
    </div>
  );
};

export default LocationInput;
