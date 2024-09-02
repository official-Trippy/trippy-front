import React, { useState } from 'react';
import Image from 'next/image';
import UpIcon from '../../../../public/arrow_up.svg';
import DownIcon from '../../../../public/arrow_down.svg';

const CustomSelect: React.FC<{ orderType: string; onOrderTypeChange: (value: string) => void }> = ({
  orderType,
  onOrderTypeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: 'LATEST', label: '최신순' },
    { value: 'LIKE', label: '인기순' },
    { value: 'VIEW', label: '조회순' },
  ];

  const handleSelectOption = (value: string) => {
    onOrderTypeChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className={`w-40 rounded-lg shadow-lg text-[#6b6b6b] text-base focus:outline-none cursor-pointer ${
          isOpen ? 'border border-[#FB3463]' : ''
        }`} 
        style={{
          borderRadius: "8px",
          height: "3rem",
          padding: "0.5rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find(option => option.value === orderType)?.label}
        {isOpen ? (
          <Image src={UpIcon} alt="upIcon" width={16} height={28} />
        ) : (
          <Image src={DownIcon} alt="downIcon" width={16} height={28} />
        )}
      </div>

      {isOpen && (
        <div
          className="absolute mt-1 w-full rounded-lg shadow-lg bg-white"
          style={{ zIndex: 10 }}
        >
          {options.map(option => (
            <div
              key={option.value}
              className="px-4 py-3 cursor-pointer hover:bg-neutral-100 text-[#6b6b6b] text-base"
              onClick={() => handleSelectOption(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
