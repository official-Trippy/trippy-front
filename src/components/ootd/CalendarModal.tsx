import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onDateChange,
}) => {
  if (!isOpen) return null;

  const today = new Date(); // 오늘 날짜를 기준으로

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-[300px]">
      <DatePicker
  selected={selectedDate}
  onChange={onDateChange}
  maxDate={today} // 오늘 날짜까지만 선택 가능
  locale={ko} // 한글 로케일 설정
  inline
  dayClassName={(date) => {
    // 선택된 날짜에만 스타일 적용
    return selectedDate && date.getTime() === selectedDate.getTime()
      ? 'react-datepicker__day--selected-custom'
      : '';
  }}
  renderCustomHeader={({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    // 다음 달로 넘어갈 수 없도록 제어
    const isNextMonthDisabled =
      date.getMonth() >= today.getMonth() &&
      date.getFullYear() >= today.getFullYear();

    return (
      <div className="w-full text-center">
        <div className="flex items-center justify-center px-2 py-1">
          <button
            className={`mr-[15px] ${
              prevMonthButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-gray-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="text-black/opacity-70 text-base font-semibold leading-normal">
            {date.getFullYear()}. {String(date.getMonth() + 1).padStart(2, '0')}
          </div>

          <button
            className={`ml-[15px] ${
              isNextMonthDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={increaseMonth}
            disabled={isNextMonthDisabled} // 다음 달로 넘어갈 수 없도록 설정
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-gray-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }}
/>
        <button
          className="mt-4 w-full bg-btn-color text-white py-2 rounded-lg"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default CalendarModal;