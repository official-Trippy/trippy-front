import React from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import { fetchRecommendedSpots } from "@/services/ootd.ts/ootdGet";

interface RecommendedSpotProps {
  postId: number;
}

const RecommendedSpot: React.FC<RecommendedSpotProps> = ({ postId }) => {
  const { data: recommendedSpots, isLoading } = useQuery(
    ['recommendedSpots', postId],
    () => fetchRecommendedSpots(postId),
    {
      enabled: !!postId, // postId가 존재할 때만 호출되도록 설정
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="w-[90%] sm-700:w-[66%] sm-700:max-w-7xl mx-auto">
      <h2 className="font-bold text-2xl">추천 장소</h2>
      {isLoading && <p>추천 장소를 불러오는 중입니다...</p>}

      {recommendedSpots?.result && recommendedSpots.result.length > 0 ? (
        <ul className="mt-4">
          {recommendedSpots.result.map((spot: any, index: number) => (
            <li key={index} className="mb-2">
              <p className="text-xl font-medium">{spot.title}</p>
              <p className="text-gray-600">{spot.content}</p>
              {/* 추천 장소 이미지가 필요하면 아래 코드 주석 해제 */}
              {spot.imgUrl && spot.imgUrl.length > 0 && (
                <Image
                  src={spot.imgUrl[0].imgUrl}
                  alt={spot.title}
                  width={spot.imgUrl[0].width}
                  height={spot.imgUrl[0].height}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>추천 장소가 없습니다.</p>
      )}
    </div>
  );
};

export default RecommendedSpot;