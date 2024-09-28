import React, { useState } from 'react';
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

  const today = new Date();
  const years = Array.from(new Array(50), (_, i) => today.getFullYear() - i); // 최근 50년간의 연도
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  // 선택된 날짜를 임시로 저장할 상태
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(selectedDate);

  // 날짜를 선택했을 때 tempSelectedDate에 저장
  const handleDateChange = (date: Date | null) => {
    setTempSelectedDate(date);
  };

  // 선택 버튼을 눌렀을 때 모달을 닫고 최종적으로 상위 컴포넌트로 데이터를 전달
  const handleConfirm = () => {
    onDateChange(tempSelectedDate); // 최종 선택된 날짜 전달
    onClose(); // 모달 닫기
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-[300px] max-h-[80vh] overflow-y-auto">
        <DatePicker
          selected={tempSelectedDate} // 현재 선택된 날짜를 tempSelectedDate로 변경
          onChange={handleDateChange} // 선택 시 바로 모달 닫지 않고 임시 저장
          maxDate={today}
          locale={ko}
          inline
          dayClassName={(date) => {
            return tempSelectedDate && date.getTime() === tempSelectedDate.getTime()
              ? 'react-datepicker__day--selected-custom'
              : '';
          }}
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => {
            const isNextMonthDisabled =
              date.getMonth() >= today.getMonth() && date.getFullYear() >= today.getFullYear();

            return (
              <div className="w-full text-center">
                <div className="flex items-center justify-center px-2 py-1">
                  <button
                    className={`mr-[15px] ${prevMonthButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* 커스텀 연도 선택 드롭다운 */}
                  <div className="relative">
                    <button
                      className="mx-2 border border-gray-300 rounded-lg px-2 py-1 font-bold"
                      onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                    >
                      {date.getFullYear()}년
                    </button>
                    {isYearDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto z-10">
                        {years.map((year) => (
                          <div
                            key={year}
                            className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                              setIsYearDropdownOpen(false);
                              changeYear(year); // 여기서 changeYear 호출
                            }}
                          >
                            {year}년
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 커스텀 월 선택 드롭다운 */}
                  <div className="relative">
                    <button
                      className="mx-2 border border-gray-300 rounded-lg px-2 py-1 font-bold"
                      onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                    >
                      {months[date.getMonth()]}
                    </button>
                    {isMonthDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg max-h-40 overflow-y-auto z-10">
                        {months.map((month, index) => (
                          <div
                            key={month}
                            className="px-2 py-1 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                              setIsMonthDropdownOpen(false);
                              changeMonth(index); // 여기서 changeMonth 호출
                            }}
                          >
                            {month}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    className={`ml-[15px] ${isNextMonthDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={increaseMonth}
                    disabled={isNextMonthDisabled}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-800"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          }}
        />
        
        {/* 선택 및 취소 버튼 */}
        <div className="w-full flex justify-around mt-4">
          <button className="w-[115px] bg-btn-color text-white py-2 rounded-[6px]" onClick={handleConfirm}>
            선택
          </button>
          <button className="w-[115px] border border-[#CFCFCF] text-[#CFCFCF] py-2 rounded-[6px]" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;