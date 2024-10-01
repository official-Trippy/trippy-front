import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

interface SearchMobileBarProps {
  setSearchModalVisible: (visible: boolean) => void; // 모달 상태를 제어하기 위한 props
}

const SearchMobileBar: React.FC<SearchMobileBarProps> = ({
  setSearchModalVisible,
}) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/search/${encodeURIComponent(query)}`);
      setSearchModalVisible(false); // 모달 닫기
    }
  };

  const handleClearInput = () => {
    setQuery("");
  };

  return (
    <div className="w-full flex items-center justify-between px-4 mx-auto">
      {/* 왼쪽 뒤로가기 버튼 */}
      <IoIosArrowBack
        className="text-gray-600 cursor-pointer mr-4"
        size={24}
        onClick={() => setSearchModalVisible(false)} // 모달 닫기
      />

      {/* 검색어 입력 필드와 아이콘들 */}
      <div className="relative flex items-center w-full mx-auto max-w-[600px] min-w-[100px]">
        {/* 검색어 입력 필드 */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="찾으시는 게시물을 입력하세요"
          className="w-full h-[32px] pl-12 pr-10 text-gray-800 border-none rounded-[16px] outline-none focus:ring-2 focus:ring-gray-300"
          style={{
            backgroundColor: "#F5F5F5",
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault(); // 기본 동작 방지
              handleSearch(); // 검색 수행 및 모달 닫기
            }
          }}
        />

        {/* X 버튼 (검색어 초기화) */}
        {query && (
          <FaTimes
            className="absolute right-5 text-gray-600 cursor-pointer"
            onClick={handleClearInput}
            style={{
              color: "#6B6B6B",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SearchMobileBar;
