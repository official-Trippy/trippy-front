import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isValid, parse } from 'date-fns';
import Image from 'next/image';
import CalendarIcon from '../../../public/icon_calendar.svg';

interface DateInputProps {
  onDateChange: (date: string) => void;
  initialDate?: string; // 초기 date를 받을 수 있도록 추가
}

const DateInput: React.FC<DateInputProps> = ({ onDateChange, initialDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (initialDate) {
      // 'yyyyMMdd' 형식으로 파싱
      const parsedDate = parse(initialDate, 'yyyyMMdd', new Date());
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
      } else {
        console.error('Invalid date format:', initialDate);
      }
    }
  }, [initialDate]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, 'yyyyMMdd');
      setSelectedDate(date);
      onDateChange(formattedDate);
    }
  };

  return (
    <div className="datepicker-container w-full h-[4rem] rounded border border-[#cfcfcf] flex items-center text-neutral-500 text-lg">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyyMMdd"
        placeholderText="날짜 선택"
        className="datepicker-input h-full py-0 px-4 border-none text-neutral-500"
        maxDate={new Date()} 
        popperClassName="custom-datepicker-popover"
      />
      <Image
        src={CalendarIcon}
        alt="Calendar Icon"
        className="datepicker-icon"
        layout="fixed"
      />
    </div>
  );
};

export default DateInput;
