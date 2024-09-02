import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { showFollows, showFollowings } from "@/services/follow";
import { useUserStore } from "@/store/useUserStore";
import { unfollow } from "@/services/follow";
import { ACCESS_TOKEN } from "@/constants/general";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const FollowList: React.FC<{
  memberId: string;
  type: "follower" | "following";
}> = ({ memberId, type }) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string>("");

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/member/follow/available?memberId=${memberId}`,
          {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }
        );
        const { available, message, status } = response.data.result;
        setIsAvailable(available);
        setAvailabilityMessage(message);
        console.log("data!!!!", response.data.result);
      } catch (error) {
        console.error("Error checking availability:", error);
        setIsAvailable(false); // 오류가 발생한 경우 비공개로 처리
      }
    };

    checkAvailability();
  }, [memberId]);

  const { data, error, isLoading } = useQuery({
    queryKey: [type, memberId],
    queryFn:
      type === "follower"
        ? () => showFollows(memberId, ACCESS_TOKEN)
        : () => showFollowings(memberId, ACCESS_TOKEN),

    onError: (error) => {
      console.error(error);
    },
  });

  const followInfo = useUserStore((state) => state.userInfo);
  // console.log(followInfo.followingCnt);
  // console.log(followInfo);

  // const userFollowingCnt = data.result.followingCnt;
  // const userFollowCnt = data.result.followCnt;

  if (isLoading) return null;
  if (error)
    return <div className="text-2xl font-bold my-12">Error loading data</div>;
  console.log("가능?", isAvailable);

  if (isAvailable === false) {
    return (
      <div className="text-2xl font-bold my-12">
        {availabilityMessage || "비공개 계정입니다."}
      </div>
    );
  }

  const userData =
    type === "follower" ? data.result.followers : data.result.followings;

  return (
    <div>
      <div className="h-[400px]">
        <h3 className="text-2xl font-bold my-12">
          {type === "follower" ? <div>팔로워</div> : <div>팔로잉</div>}
        </h3>
        <div>
          {!userData || userData.length === 0 ? (
            <div className="text-left my-12 text-3xl">
              {type === "follower"
                ? "아직 팔로워가 없습니다. 가장 먼저 팔로우 해주세요!"
                : "아직 팔로잉이 없습니다. 친해지고 싶은 이웃을 팔로우 해보세요!"}
            </div>
          ) : (
            userData.map((user: any) => (
              <div
                key={user.idx}
                className="flex items-center justify-between p-4 border-b border-gray-200"
              >
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-bold">{user.nickName}</p>
                    <p className="text-gray-600">{user.memberId}</p>
                  </div>
                </div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded rounded-lg"
                  onClick={() => {
                    unfollow(user.memberId);
                    console.log("Unfollow", user.idx);
                  }}
                >
                  {type === "follower" ? "팔로우 삭제" : "팔로우 취소"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowList;
