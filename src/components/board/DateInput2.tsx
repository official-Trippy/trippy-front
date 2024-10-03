import React, { useState, useEffect } from 'react';
import { format, parse, isValid } from 'date-fns';
import Image from 'next/image';
import CalendarIcon from '../../../public/icon_calendar.svg';
import CalendarModal2 from './CalendarModal2';

interface DateInputProps {
  onDateChange: any; // 날짜 배열 전달
  initialDate?: string; // 초기 date를 받을 수 있도록 추가
  startDate: string; // 시작 날짜
  endDate: string; // 종료 날짜
  setStartDate: any; // 시작 날짜 설정 함수
  setEndDate: any; // 종료 날짜 설정 함수
}

const DateInput2: React.FC<DateInputProps> = ({
  onDateChange,
  initialDate,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [inputValue, setInputValue] = useState<string>(''); // 입력된 값 관리

  useEffect(() => {
    if (initialDate) {
      const parsedDate = parse(initialDate, 'yyyyMMdd', new Date());
      if (isValid(parsedDate)) {
        setSelectedDates([parsedDate, null]); // 시작일만 설정
        setInputValue(initialDate); // 초기 날짜 값 설정
      } else {
        console.error('Invalid date format:', initialDate);
      }
    }
  }, [initialDate]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;

    // 날짜 변경 시 상태 업데이트
    setSelectedDates([start, end]);

    // 시작 날짜와 종료 날짜 설정
    const formattedStart = start ? format(start, 'yyyyMMdd') : null;
    const formattedEnd = end ? format(end, 'yyyyMMdd') : null;

    setStartDate(start);
    setEndDate(end);

    // 입력 값 업데이트
    if (start && end) {
      setInputValue(`${formattedStart} - ${formattedEnd}`);
    } else if (start) {
      setInputValue(String(formattedStart));
    } else if (end) {
      setInputValue(String(formattedEnd));
    } else {
      setInputValue('');
    }

    // 날짜 변경 콜백 호출
    onDateChange([formattedStart, formattedEnd]);

    // 상태 업데이트 후 콘솔 로그
    console.log(formattedStart, formattedEnd);
  };

  const handleCalendarClick = () => {
    setIsModalOpen(true); // 모달 열기
  };

  return (
    <div className="relative ml-[1.7rem] w-fit lg:w-[22rem] sm-700:w-[12rem] h-[1.7rem] lg:h-[4rem] sm-700:h-[1.7rem] rounded-[8px] border border-[#cfcfcf] flex items-center text-[0.8rem] lg:text-lg sm-700:text-[0.8rem] mr-[3rem]">
      <input
        type="text"
        value={inputValue}
        readOnly // 직접 입력을 막기 위해 readOnly로 설정
        className="datepicker-input h-full py-0 px-4 border-none text-[#cfcfcf] rounded-[8px] placeholder:text-[#cfcfcf]"
        placeholder="날짜 선택 (YYYYMMDD)"
      />
      <Image
        src={CalendarIcon}
        alt="Calendar Icon"
        className="absolute right-2 cursor-pointer w-[2rem] lg:w-[4rem] sm-700:w-[2rem]"
        onClick={handleCalendarClick} // 달력 아이콘 클릭 시 모달 열기
      />

      {/* 모달 컴포넌트 */}
      <CalendarModal2
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDates={selectedDates} // 선택된 날짜 전달
        onDateChange={handleDateChange} // 날짜 변경 핸들러 전달
        startDate={selectedDates[0]} // 시작 날짜
        endDate={selectedDates[1]} // 종료 날짜
      />
    </div>
  );
};

export default DateInput2;
