import React, { useState, useEffect } from 'react';

const SkeletonOotdDetailRecommend: React.FC = () => {
  const getItemCount = (width: number) => {
    if (width < 550) {
      return 2;
    } else if (width < 1000) {
      return 3;
    } else {
      return 4;
    }
  };

  const [itemCount, setItemCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return getItemCount(window.innerWidth);
    }
    return 4; // 서버 측에서는 기본값을 반환
  });

  const updateItemCount = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      setItemCount(getItemCount(width));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateItemCount(); // 처음 페이지 로드 시 실행
      window.addEventListener('resize', updateItemCount); // 창 크기 변경 시 실행
      return () => window.removeEventListener('resize', updateItemCount); // 이벤트 리스너 제거
    }
  }, []);

  return (
    <div className="relative w-[90%] sm-700:w-[66%] sm-700:max-w-7xl mx-auto pt-[2rem] overflow-visible">
      <h2 className="font-bold text-2xl mb-4 animate-pulse bg-gray-300 w-[300px] h-8 rounded-md"></h2>
      {/* 스켈레톤 슬라이드 */}
      <div className="relative mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(itemCount)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="w-[158px] h-[100px] bg-gray-200 rounded-[8px] animate-pulse mb-4"></div>
              <div className="bg-gray-300 w-[100px] h-6 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonOotdDetailRecommend;