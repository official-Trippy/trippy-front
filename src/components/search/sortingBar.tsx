// components/SortingBar.tsx

import React from "react";

interface SortingBarProps {
  selectedPostType: string;
  onSelectPostType: (postType: string) => void;
  selectedSortOrder: string;
  onSelectSortOrder: (sortOrder: string) => void;
}

const SortingBar: React.FC<SortingBarProps> = ({
  selectedPostType,
  onSelectPostType,
  selectedSortOrder,
  onSelectSortOrder,
}) => {
  const postTypes = [
    { label: "게시글", value: "POST" },
    { label: "OOTD", value: "OOTD" },
    { label: "사용자 닉네임", value: "USER" },
  ];

  const sortOrders = [
    { label: "최신순", value: "newest" },
    { label: "인기순", value: "popular" },
  ];

  return (
    <div className="flex justify-between items-center mb-4 mr-[320px] mb-[50px] mt-[30px]">
      <div className="flex space-x-4">
        {postTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onSelectPostType(type.value)}
            className={`px-4 py-2 rounded ${
              selectedPostType === type.value
                ? "bg-[#FB3463] text-white"
                : "bg-white text-gray-700"
            } hover:bg-gray-200 transition`}
            style={{
              fontFamily: "Pretendard, sans-serif",
              fontSize: "18px",
              fontWeight: "400",
              lineHeight: "normal",
            }}
          >
            {type.label}
          </button>
        ))}
      </div>
      <div>
        <select
          value={selectedSortOrder}
          onChange={(e) => onSelectSortOrder(e.target.value)}
          className="px-4 py-2 rounded bg-white border border-gray-300"
          style={{
            fontFamily: "Pretendard, sans-serif",
            fontSize: "18px",
            fontWeight: "400",
            lineHeight: "normal",
          }}
        >
          {sortOrders.map((order) => (
            <option key={order.value} value={order.value}>
              {order.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortingBar;
