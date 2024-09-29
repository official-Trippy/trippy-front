import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { showFollows, showFollowings } from "@/services/follow";
import { useUserStore } from "@/store/useUserStore";
import { unfollow } from "@/services/follow";
import { ACCESS_TOKEN } from "@/constants/general";
import DefaultImage from "../../../public/defaultImage.svg";
import axios from "@/app/api/axios";
import Swal from "sweetalert2";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const FollowList: React.FC<{
  memberId: string;
  type: "follower" | "following";
}> = ({ memberId, type }) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string>("");
  const [userData, setUserData] = useState<any[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(true); // 팔로우 가능 여부 체크 로딩 상태 추가

  const currentUser = useUserStore((state) => state.userInfo);
  const currentUserId = currentUser?.memberId;

  // 계정의 공개 여부 확인
  useEffect(() => {
    const checkAvailability = async () => {
      setIsCheckingAvailability(true);
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
      } catch (error) {
        console.error("Error checking availability:", error);
        setIsAvailable(false);
      } finally {
        setIsCheckingAvailability(false);
      }
    };
    checkAvailability();
  }, [memberId]);

  // 팔로워/팔로잉 데이터 조회
  const { data, error, isLoading } = useQuery({
    queryKey: [type, memberId],
    queryFn:
      type === "follower"
        ? () => showFollows(memberId, ACCESS_TOKEN)
        : () => showFollowings(memberId, ACCESS_TOKEN),
    onSuccess: (data) => {
      setUserData(
        type === "follower" ? data.result.followers : data.result.followings
      );
    },
    onError: (error) => {
      console.error(error);
    },
  });

  // 언팔로우 처리 함수
  const handleAlert = async (userId: string) => {
    const result = await Swal.fire({
      title: "정말로 팔로우를 취소하시겠습니까?",
      text: "팔로우를 취소해도 상대방에게 알림이 가지 않아요.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FB3463",
      cancelButtonColor: "#CFCFCF",
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    });

    if (result.isConfirmed) {
      try {
        await unfollow(userId);
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

  // 모든 로딩 상태를 고려한 조건 처리
  if (isLoading || isCheckingAvailability) {
    return (
      <div className="flex justify-center items-center my-12">
        <svg
          aria-hidden="true"
          className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );
  }

  // 데이터 오류 발생 시 처리
  if (error) {
    return (
      <div className="text-2xl font-bold my-12">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  // 비공개 계정 또는 접근 불가능한 경우
  if (isAvailable === false) {
    return (
      <div className="text-2xl font-bold my-12">
        {availabilityMessage || "비공개 계정입니다."}
      </div>
    );
  }

  return (
    <div className="h-[400px]">
      <h3 className="text-2xl font-bold my-12">
        {type === "follower" ? "팔로워 목록" : "팔로잉 목록"}
      </h3>
      <div>
        {!userData || userData.length === 0 ? (
          <div className="text-left my-12 text-3xl">
            {type === "follower"
              ? "아직 팔로워가 없습니다. 가장 먼저 팔로우 해주세요!"
              : "아직 팔로잉이 없습니다. 친해지고 싶은 이웃을 팔로우 해보세요!"}
          </div>
        ) : (
          userData.map((user) => (
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
                  className="bg-[#FB3463] text-white px-4 py-2 rounded-lg max-w-[200px] text-sm"
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
  );
};

export default FollowList;
