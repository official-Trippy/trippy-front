import React, { useState } from 'react';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isValid, startOfToday } from 'date-fns';

interface DateInputProps {
  onDateChange: (date: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, 'yyyyMMdd');
      
      if (isValid(date)) {
        setSelectedDate(date);
        onDateChange(formattedDate);
      } else {
        Swal.fire({
          icon: 'error',
          title: '날짜 입력 오류',
          text: '존재하지 않는 날짜입니다. 올바른 날짜를 선택해주세요.',
        });
      }
    }
  };

  return (
    <div className="w-full h-[4rem] rounded border border-[#cfcfcf] flex items-center text-neutral-500 text-lg">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyyMMdd"
        placeholderText="날짜 선택"
        className="w-full h-full py-0 px-2 border-none text-neutral-500"
        maxDate={startOfToday()}
        popperClassName="custom-datepicker-popover"
      />
    </div>
  );
};

export default DateInput;
