import React, { useState, useEffect } from 'react';
import { format, parse, isValid } from 'date-fns';
import Image from 'next/image';
import CalendarIcon from '../../../public/icon_calendar.svg';
import CalendarModal from './CalendarModal';

interface DateInputProps {
  onDateChange: (date: string) => void;
  initialDate?: string; // 초기 date를 받을 수 있도록 추가
}

const DateInput: React.FC<DateInputProps> = ({ onDateChange, initialDate }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  useEffect(() => {
    if (initialDate) {
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
      onDateChange(formattedDate); // 상위 컴포넌트에 변경된 날짜 전달
      setIsModalOpen(false); // 날짜 선택 후 모달 닫기
    }
  };

  const handleCalendarClick = () => {
    setIsModalOpen(true); // 모달 열기
  };

  return (
    <div className="relative w-full h-[4rem] rounded-[8px] border border-[#cfcfcf] flex items-center text-lg">
      <input
        type="text"
        value={selectedDate ? format(selectedDate, 'yyyyMMdd') : ''}
        readOnly
        className="datepicker-input h-full py-0 px-4 border-none text-[#cfcfcf] rounded-[8px] placeholder:text-[#cfcfcf]"
        placeholder="날짜 선택"
      />
      <Image
        src={CalendarIcon}
        alt="Calendar Icon"
        className="absolute right-4 cursor-pointer"
        onClick={handleCalendarClick} 
      />

      {/* 모달 컴포넌트 */}
      <CalendarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
    </div>
  );
};

export default DateInput;