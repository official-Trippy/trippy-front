import React from 'react';
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

    if (formattedDate.length === 8) {
      const year = parseInt(formattedDate.slice(0, 4), 10);
      const month = parseInt(formattedDate.slice(4, 6), 10) - 1;
      const day = parseInt(formattedDate.slice(6, 8), 10);
      const dateObj = new Date(year, month, day);

      if (
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() !== month ||
        dateObj.getDate() !== day
      ) {
        Swal.fire({
          icon: 'error',
          title: '날짜 입력 오류',
          text: '존재하지 않는 날짜입니다. 올바른 날짜를 입력해주세요.',
        });
        return;
      }
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
