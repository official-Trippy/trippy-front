
import React from 'react';

interface DateInputProps {
  onDateChange: (date: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ onDateChange }) => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedDate = value.replace(/\D/g, '');
    onDateChange(formattedDate);
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="날짜 입력 (YYYYMMDD)"
        className="w-full border p-2 rounded"
        onChange={handleDateChange}
      />
    </div>
  );
};

export default DateInput;
