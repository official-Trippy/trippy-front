import React, { useState, useEffect } from 'react';

const SkeletonBoard: React.FC = () => {
    const getItemCount = (width: number) => {
        if (width < 700) {
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

    // 화면 크기에 따라 표시할 아이템 수를 설정하는 함수
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
        <div className="relative w-[90%] sm-700:w-[66%] mx-auto pt-[6rem] overflow-visible">
            <h1 className="flex items-center justify-center px-6 py-2 rounded-[20px] text-[12px] bg-gray-300 w-[300px] h-8 animate-pulse mb-4"></h1>
            <div className="flex items-center my-12 relative">
                <div className="overflow-hidden w-full cursor-pointer">
                    <div className="flex flex-col space-x-4 transition-transform duration-300 flex-shrink-0 mr-auto justify-between sm-700:flex-row sm-700:mx-auto sm-700:items-center">
                        <h1 className="flex items-center justify-center px-6 py-2 rounded-[20px] text-[12px] bg-gray-300 w-[500px] h-8 animate-pulse mb-4"></h1>
                    </div>
                </div>
            </div>

            {/* 스켈레톤 카드들 */}
            <div className="relative mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
                    {[...Array(itemCount)].map((_, index) => (
                        <div key={index} className="relative bg-gray-200 rounded-xl w-full h-80 animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkeletonBoard;