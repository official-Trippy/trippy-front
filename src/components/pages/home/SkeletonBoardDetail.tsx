import { useEffect, useState } from "react";

const SkeletonBoardDetail: React.FC = () => {

    // const [itemCount, setItemCount] = useState<number>(() => {
    //     if (typeof window !== 'undefined') {
    //         return getItemCount(window.innerWidth);
    //     }
    //     return 1; // 서버 측에서는 기본값을 반환
    // });

    // const updateItemCount = () => {
    //     if (typeof window !== 'undefined') {
    //         const width = window.innerWidth;
    //         setItemCount(getItemCount(width));
    //     }
    // };

    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         updateItemCount(); // 처음 페이지 로드 시 실행
    //         window.addEventListener('resize', updateItemCount); // 창 크기 변경 시 실행
    //         return () => window.removeEventListener('resize', updateItemCount); // 이벤트 리스너 제거
    //     }
    // }, []);

    return (
        <div className="relative w-[90%] sm-700:w-[66%] sm-700:max-w-7xl xl:w-full mx-auto pt-[2rem] overflow-visible">
            <h2 className="font-bold h-[2rem] text-2xl mb-4 animate-pulse bg-gray-300 w-full mt-[2rem] sm-700:mt-[2rem] lg:mt-[7rem] mb-10 rounded-md"></h2>
            {/* 스켈레톤 슬라이드 */}
            <div className="relative mx-auto">
                <div className="">
                    <div
                        className="flex flex-col items-center justify-center text-center"
                    >
                        <div className="bg-gray-300 w-full h-[5rem] rounded-md animate-pulse mb-10"></div>
                        <div className="w-full h-[8rem] bg-gray-200 rounded-[8px] animate-pulse mb-10"></div>
                        <div className="w-full h-[25rem] bg-gray-200 rounded-[8px] animate-pulse mb-10"></div>
                        <div className="w-full h-screen bg-gray-200 rounded-[8px] animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonBoardDetail;