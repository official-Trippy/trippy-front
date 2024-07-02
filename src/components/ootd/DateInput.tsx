'use client';

import React from 'react';

interface DateInputProps {
  onDateChange: (date: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ onDateChange }) => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(event.target.value);
  };

  return (
    <div className="space-y-2">
      <input
        type="date"
        placeholder="날짜 입력"
        className="w-full border p-2 rounded"
        onChange={handleDateChange}
      />
    </div>
  );
};

export default DateInput;
