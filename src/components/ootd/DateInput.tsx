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
  const [inputValue, setInputValue] = useState<string>(''); // 입력된 값 관리

  useEffect(() => {
    if (initialDate) {
      const parsedDate = parse(initialDate, 'yyyyMMdd', new Date());
      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
        setInputValue(initialDate); // 초기 날짜 값 설정
      } else {
        console.error('Invalid date format:', initialDate);
      }
    }
  }, [initialDate]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = format(date, 'yyyyMMdd');
      setSelectedDate(date);
      setInputValue(formattedDate); // 입력 필드에 포맷된 날짜 설정
      onDateChange(formattedDate); // 상위 컴포넌트에 변경된 날짜 전달
      setIsModalOpen(false); // 날짜 선택 후 모달 닫기
    }
  };

  const handleCalendarClick = () => {
    setIsModalOpen(true); // 모달 열기
  };

  // 사용자가 직접 입력할 때 8자리 유효성 검사 및 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // 숫자만 입력 가능하고 최대 8자리로 제한
    if (/^\d{0,8}$/.test(input)) {
      setInputValue(input);

      if (input.length === 8) {
        const parsedDate = parse(input, 'yyyyMMdd', new Date());
        if (isValid(parsedDate)) {
          setSelectedDate(parsedDate);
          onDateChange(input); // 유효한 8자리 날짜를 상위 컴포넌트에 전달
        } else {
          console.error('Invalid date entered:', input);
        }
      }
    }
  };

  return (
    <div className="relative w-full h-[4rem] rounded-[8px] border border-[#cfcfcf] flex items-center text-lg">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange} // 입력 변경 핸들러
        maxLength={8} // 최대 8자리 입력
        className="datepicker-input h-full py-0 px-4 border-none text-[#cfcfcf] rounded-[8px] placeholder:text-[#cfcfcf]"
        placeholder="날짜 선택 (YYYYMMDD)"
      />
      <Image
        src={CalendarIcon}
        alt="Calendar Icon"
        className="absolute right-4 cursor-pointer"
        onClick={handleCalendarClick} // 달력 아이콘 클릭 시 모달 열기
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