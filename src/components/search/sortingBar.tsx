"use client";
import React from "react";
import SearchBar from "./searchBar"; // searchBar 컴포넌트 가져오기
import { useRouter } from "next/navigation";
import CustomSelect from "../pages/ootd/CustomSelect";
import { useState, useEffect } from "react";
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

  const [mobileCheck, setMobileCheck] = useState(false);
  const [page, setPage] = useState(0);
  const handleOrderTypeChange = (value: string) => {
    setOrderType(value);
    setPage(0);
  };
  const router = useRouter();
  const [orderType, setOrderType] = useState("LATEST");

  useEffect(() => {
    const handleResize = () => {
      setMobileCheck(window.innerWidth <= 1050); // 640px corresponds to Tailwind's `sm` breakpoint
    };

    // Set initial value based on current window size
    handleResize();

    // Add event listener to update on resize
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between md:hidden mb-4">
        {/* <button
          className="text-gray-700 bg-white px-4 py-2"
          onClick={() => history.go(-1)}
        >
          ←
        </button> */}
        {/* <div className="w-full pl-4">
          <SearchBar />
        </div> */}
      </div>

      {/* 검색 타입 버튼 */}
      {mobileCheck ? (
        <div className="grid-cols-2 gap-2 sm-700:w-[100%] pt-[2rem]  w-[100%]">
          {searchTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onSelectSearchType(type.value)}
              className={`pr-4 py-1 sm-700:pr-8 sm-700:py-2 rounded ${
                selectedSearchType === type.value
                  ? "bg-white text-[#FB3463] font-bold"
                  : "bg-white text-gray-700"
              }  transition`}
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: "14px", // 모바일 글씨 크기 조정
                lineHeight: "normal",
              }}
            >
              {type.label}
            </button>
          ))}
          <div className="flex justify-end  md:mt-0 mt-2">
            <CustomSelect
              orderType={orderType}
              onOrderTypeChange={handleOrderTypeChange}
            />
          </div>
        </div>
      ) : (
        <div className="grid-cols-2 gap-2 sm-700:w-[79%] pt-[2rem]  w-[100%]">
          {searchTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => onSelectSearchType(type.value)}
              className={`pr-4 py-1 sm-700:pr-8 sm-700:py-2 rounded ${
                selectedSearchType === type.value
                  ? "bg-white text-[#FB3463] font-bold"
                  : "bg-white text-gray-700"
              }  transition`}
              style={{
                fontFamily: "Pretendard, sans-serif",
                fontSize: "14px", // 모바일 글씨 크기 조정
                lineHeight: "normal",
              }}
            >
              {type.label}
            </button>
          ))}
          <div className="flex justify-end  md:mt-0 mt-2">
            <CustomSelect
              orderType={orderType}
              onOrderTypeChange={handleOrderTypeChange}
            />
          </div>
        </div>
      )}

      {/* 정렬 방식 선택 */}
    </div>
  );
};

export default SortingBar;
