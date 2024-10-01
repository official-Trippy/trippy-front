import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDates: [Date | null, Date | null]; // 시작일과 종료일을 배열로 저장
  onDateChange: (dates: [Date | null, Date | null]) => void; // 날짜 범위를 전달
  startDate: Date | null; // 시작 날짜
  endDate: Date | null; // 종료 날짜
}

const CalendarModal2: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDates,
  onDateChange,
  startDate,
  endDate
}) => {
  if (!isOpen) return null;

  const today = new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-[300px] max-h-[80vh] overflow-y-auto">
        <DatePicker
          selected={startDate} // 시작 날짜 선택
          onChange={(dates) => {
            const [start, end] = dates;
            onDateChange([start, end]); // 선택된 날짜를 상위 컴포넌트로 전달
          }}
          startDate={startDate || undefined} // 시작 날짜
          endDate={endDate || undefined} // 종료 날짜
          selectsRange // 날짜 범위 선택
          inline
          dateFormat="yyyy. MM. dd"
          maxDate={today} // 오늘 날짜 이후 선택 불가
        />

        {/* 선택 및 취소 버튼 */}
        <div className="w-full flex justify-center gap-4 mt-4">
          <button
            className="w-[60px] h-[35px] bg-btn-color text-white py-2 rounded-[6px]"
            onClick={onClose} // 선택 버튼 클릭 시 모달 닫기
          >
            선택
          </button>
          <button
            className="w-[60px] h-[35px] border border-[#CFCFCF] text-[#CFCFCF] py-2 rounded-[6px]"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal2;
