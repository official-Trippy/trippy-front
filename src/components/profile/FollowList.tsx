import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { showFollows, showFollowings } from "@/services/follow";
import { useUserStore } from "@/store/useUserStore";
import { unfollow } from "@/services/follow";
import { ACCESS_TOKEN } from "@/constants/general";
import DefaultImage from '../../../public/defaultImage.svg';
import axios from "@/app/api/axios";
import Swal from "sweetalert2";


const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const FollowList: React.FC<{
  memberId: string;
  type: "follower" | "following";
}> = ({ memberId, type }) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string>("");
  const [userData, setUserData] = useState<any[]>([]); // 팔로우/팔로잉 데이터를 관리하는 state 추가

  const currentUser = useUserStore((state) => state.userInfo);
  const currentUserId = currentUser?.memberId;

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
        const { available, message } = response.data.result;
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

    onSuccess: (data) => {
      setUserData(
        type === "follower" ? data.result.followers : data.result.followings
      ); // 초기 팔로워/팔로잉 데이터를 state에 저장
    },

    onError: (error) => {
      console.error(error);
    },
  });

  if (isLoading) return null;
  if (error)
    return <div className="text-2xl font-bold my-12">Error loading data</div>;
  console.log("가능?", isAvailable);

  if (isAvailable === false) {
    return (
      <div className="text-2xl font-bold my-12">
        {availabilityMessage + " 계정입니다." || "비공개 계정입니다."}
      </div>
    );
  }

  // const handleUnfollow = async (userId: string) => {
  //   try {
  //     await unfollow(userId);
  //     // 언팔로우 성공 시 해당 유저를 목록에서 제거
  //     setUserData((prevData) =>
  //       prevData.filter((user) => user.memberId !== userId)
  //     );
  //     console.log("Unfollow", userId);
  //   } catch (error) {
  //     console.error("Error unfollowing:", error);
  //   }
  // };

  const handleAlert = async (userId: string) => {
    const result = await Swal.fire({
      title: "정말로 팔로우를 취소하시겠습니까?",
      text: "팔로우를 취소하면 사용자의 비공개 게시물을 볼 수 없습니다.",
      icon: "warning",
      showCancelButton: true, // 취소 버튼 추가
      confirmButtonColor: "#FB3463",
      cancelButtonColor: "#6B6B6B",
      confirmButtonText: "네, 팔로우 취소할래요",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      try {
        await unfollow(userId);
        // 언팔로우 성공 시 해당 유저를 목록에서 제거
        setUserData((prevData) =>
          prevData.filter((user) => user.memberId !== userId)
        );
        Swal.fire(
          "팔로우 취소",
          "상대방에게 알림이 가지는 않습니다.",
          "success"
        );
      } catch (error) {
        console.error("Error unfollowing:", error);
        Swal.fire("실패", "팔로우 취소 중 문제가 발생했습니다.", "error");
      }
    }
  };

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
                      src={user.profileImageUrl || DefaultImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-bold">{user.nickName}</p>
                    <p className="text-gray-600">{user.memberId}</p>
                  </div>
                </div>
                {currentUserId === memberId && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded rounded-lg"
                    onClick={() => handleAlert(user.memberId)}
                  >
                    {type === "follower" ? "팔로우 삭제" : "팔로우 취소"}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowList;
