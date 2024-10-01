"use client";
import React, { useEffect, useState } from "react";

interface PopularSearchesProps {
  popularSearches: string[];
}

const MobilePopularSearch: React.FC<PopularSearchesProps> = ({
  popularSearches,
}) => {
  // 현재 보여줄 검색어의 인덱스를 관리하는 상태
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 3초마다 currentIndex를 증가시키는 타이머 설정
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % popularSearches.length);
    }, 3000);

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearInterval(intervalId);
  }, [popularSearches.length]);

  return (
    <div className="flex items-center justify-end w-full w-[300px] mb-[15px]">
      {/* 타이틀 */}
      <h2 className="text-[1.125rem] font-semibold mr-4">인기 검색어</h2>

      {/* 순차적으로 하나씩 검색어 표시 */}
      <ul className="h-[40px] flex items-center justify-start">
        {popularSearches.map((term, index) => (
          <li
            key={index}
            className={`transition-opacity duration-300 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              position: index === currentIndex ? "relative" : "absolute",
              color: "#9D9D9D",
              fontFamily: "Pretendard, sans-serif",
              fontSize: "14px", // 글씨 크기 조정
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            <span
              style={{
                color: "#FB3463",
                marginRight: "8px",
                fontSize: "14px", // 번호도 글씨 크기 조정
              }}
            >
              {index + 1}.
            </span>
            {term}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MobilePopularSearch;
