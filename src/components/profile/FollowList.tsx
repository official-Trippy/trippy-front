import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  showFollows,
  showFollowings,
  unfollow,
  doFollow,
} from "@/services/follow";
import { useUserStore } from "@/store/useUserStore";
import { ACCESS_TOKEN } from "@/constants/general";
import DefaultImage from "../../../public/defaultImage.svg";
import axios from "@/app/api/axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const FollowList: React.FC<{
  memberId: string;
  type: "follower" | "following";
}> = ({ memberId, type }) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string>("");
  const [userData, setUserData] = useState<any[]>([]);
  const [myFollowings, setMyFollowings] = useState<string[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(true);

  const currentUser = useUserStore((state) => state.userInfo);
  const currentUserId = currentUser?.memberId;

  const isCurrentUserInList = userData.some(
    (user) => user.memberId === currentUserId
  );

  const filteredUserData = isCurrentUserInList
    ? userData.filter((user) => user.memberId !== currentUserId)
    : userData;

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

  useEffect(() => {
    if (currentUserId) {
      showFollowings(currentUserId, ACCESS_TOKEN).then((response) => {
        const myFollowingList = response.result.followings.map(
          (user: any) => user.memberId
        );
        setMyFollowings(myFollowingList);
      });
    }
  }, [currentUserId]);

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

  const handleUnfollow = async (userId: string) => {
    const result = await Swal.fire({
      title: "정말로 팔로우를 취소하시겠습니까?",
      text: "팔로우를 취소해도 상대방에게 알림이 가지 않아요.",
      icon: "warning",
      iconColor: "#FB3463",
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
        Swal.fire("팔로우 취소", "상대방에게 알림이 가지 않습니다.", "success");
      } catch (error) {
        console.error("Error unfollowing:", error);
        Swal.fire("실패", "팔로우 취소 중 문제가 발생했습니다.", "error");
      }
    } else {
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await doFollow(userId);
      setMyFollowings((prev) => [...prev, userId]); // 팔로우한 사용자 추가
      Swal.fire("팔로우 성공", "이웃을 팔로우했습니다.", "success");
    } catch (error) {
      console.error("Error following:", error);
      Swal.fire("실패", "팔로우 중 문제가 발생했습니다.", "error");
    }
  };

  const router = useRouter();
  const goUserPage = (memberId: string) => {
    router.push(`/user/${memberId}`);
  };

  const followCnt = userData.length;

  // 로딩 상태를 고려한 처리
  if (isLoading || isCheckingAvailability) {
    return <div></div>;
  }

  if (error) {
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  if (isAvailable === false) {
    return <div>{availabilityMessage || "비공개 계정입니다."}</div>;
  }

  return (
    <div className="h-[400px]">
      <h3 className="text-2xl font-bold my-12">
        {type === "follower" ? "팔로워" : "팔로잉"}
        <span className="text-[#FB3463]"> {filteredUserData.length}</span>
      </h3>
      <div>
        {isCurrentUserInList && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={currentUser.profileImageUrl || DefaultImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4">
                <p className="text-lg font-bold">{currentUser.nickName}</p>
                <p className="text-gray-600">{currentUserId}</p>
              </div>
            </div>
          </div>
        )}
        {filteredUserData.length === 0 ? (
          <div className="text-left my-12 text-3xl"></div>
        ) : (
          filteredUserData.map((user) => (
            <div
              key={user.memberId}
              className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer"
            >
              <div
                className="flex items-center"
                onClick={() => {
                  goUserPage(user.memberId);
                }}
              >
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

              {user.memberId !== currentUserId && ( // Hide button for current user
                <button
                  className={`px-4 py-2 rounded-lg w-[51px]  text-sm ${
                    myFollowings.includes(user.memberId)
                      ? "bg-[#F5F5F5] text-gray-700"
                      : "bg-[#FB3463] text-white"
                  }`}
                  onClick={() =>
                    myFollowings.includes(user.memberId)
                      ? handleUnfollow(user.memberId)
                      : handleFollow(user.memberId)
                  }
                >
                  {myFollowings.includes(user.memberId) ? "팔로잉" : "팔로우"}
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
