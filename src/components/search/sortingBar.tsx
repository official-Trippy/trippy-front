import React from "react";
import SearchBar from "./searchBar"; // searchBar 컴포넌트 가져오기
import { useRouter } from "next/navigation";
import CustomSelect from "../pages/ootd/CustomSelect";
import { useState } from "react";
interface SortingBarProps {
  selectedSearchType: string;
  onSelectSearchType: (searchType: string) => void;

  selectedSortOrder: string;
  onSelectSortOrder: (sortOrder: string) => void;
}

const SortingBar: React.FC<SortingBarProps> = ({
  selectedSearchType,
  onSelectSearchType,
  selectedSortOrder,
  onSelectSortOrder,
}) => {
  const searchTypes = [
    { label: "게시글", value: "POST" },
    { label: "OOTD", value: "OOTD" },
    { label: "사용자 이름", value: "NICKNAME" },
    { label: "블로그 이름", value: "BLOG" },
  ];

  const sortOrders = [
    { label: "최신순", value: "newest" },
    { label: "인기순", value: "popular" },
  ];
  const [page, setPage] = useState(0);
  const handleOrderTypeChange = (value: string) => {
    setOrderType(value);
    setPage(0);
  };
  const router = useRouter();
  const [orderType, setOrderType] = useState("LATEST");

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between md:hidden mb-4">
        <button
          className="text-gray-700 bg-white px-4 py-2"
          onClick={() => history.go(-1)}
        >
          ←
        </button>
        <div className="w-full pl-4">
          <SearchBar />
        </div>
      </div>

      {/* 검색 타입 버튼 */}
      <div className="grid-cols-2 gap-2 md:flex md:w-[789px] pt-[2rem]">
        {searchTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onSelectSearchType(type.value)}
            className={`px-2 py-1 sm-700:px-4 sm-700:py-2 rounded ${
              selectedSearchType === type.value
                ? "bg-[#FB3463] text-white"
                : "bg-white text-gray-700"
            } hover:bg-gray-200 transition`}
            style={{
              fontFamily: "Pretendard, sans-serif",
              fontSize: "14px", // 모바일 글씨 크기 조정
              fontWeight: "400",
              lineHeight: "normal",
            }}
          >
            {type.label}
          </button>
        ))}
        <div className="flex md:ml-auto mt-2 md:mt-0">
          <CustomSelect
            orderType={orderType}
            onOrderTypeChange={handleOrderTypeChange}
          />
        </div>
      </div>

      {/* 정렬 방식 선택 */}
    </div>
  );
};

export default SortingBar;
