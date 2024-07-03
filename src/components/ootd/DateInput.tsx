import React, { useState } from 'react';
import Swal from 'sweetalert2';

interface DateInputProps {
  onDateChange: (date: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ onDateChange }) => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedDate = value.replace(/\D/g, '');

    if (formattedDate.length > 8) {
      Swal.fire({
        icon: 'error',
        title: '날짜 형식 오류',
        text: '날짜는 YYYYMMDD 형식으로 입력해주세요.',
      });
      return;
    }

    onDateChange(formattedDate);
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="날짜 입력 (YYYYMMDD)"
        className="w-full border p-2 rounded"
        onChange={handleDateChange}
        maxLength={8}
      />
    </div>
  );
};

export default DateInput;
