"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { useRouter } from "next/navigation";

interface INotification {
  notifyId: number;
  title: string;
  senderProfileImgUri: string | null;
  senderNickName: string;
  createdAt: string;
  read: boolean;
  senderMemberId: string;
  postId: number;
  postType: string;
}

dayjs.extend(relativeTime);
dayjs.locale("ko");

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가
  const accessToken = Cookies.get("accessToken");
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/notify`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setNotifications(response.data.result.notifyInfoList);
      } catch (e) {
        console.error("Failed to fetch notifications:", e);
      } finally {
        setLoading(false); // 데이터가 로드되면 로딩 상태를 false로 설정
      }
    };
    fetchNotifications();
  }, [accessToken]);

  console.log("전체알림 정보", notifications);

  const handleDeleteNotification = async (notifyId: number) => {
    try {
      await axios.delete(`${backendUrl}/api/notify/${notifyId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.notifyId !== notifyId
        )
      );
    } catch (e) {
      console.error("Failed to delete notification:", e);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await axios.delete(`${backendUrl}/api/notify/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setNotifications([]);
    } catch (e) {
      console.error("Failed to delete all notifications:", e);
    }
  };

  const notificationCount = notifications.length;

  const goUserPage = (
    postType: string | null,
    postId: number,
    senderMemberId: string
  ) => {
    if (postType) {
      router.push(`/${postType.toLowerCase()}/${postId}`);
    } else {
      router.push(`/user/${senderMemberId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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

  return (
    <div>
      <div className="header flex justify-between w-[90%] items-center sm-700:w-[50%] max-w-[800px] mx-auto relative">
        <h1 className="text-4xl font-bold">알림</h1>
      </div>

      {/* 총 알림 개수 표시 */}
      <div className="sm-700:w-[50%] w-[90%] max-w-[800px] mx-auto my-4">
        {notificationCount > 0 ? (
          <h2 className="text-3xl font-semibold">
            <span className="text-[#FB3463]">{notificationCount}</span>
            개의 새로운 알림
          </h2>
        ) : (
          <h2 className="text-2xl font-semibold">새로운 알림이 없습니다.</h2>
        )}
      </div>

      {/* 알림 리스트 표시 영역 */}
      <div className="sm-700:w-[50%] sm-700:mb-0 w-[90%] max-w-[800px] mx-auto my-8 flex justify-start mb-[80px]">
        {notificationCount === 0 ? (
          <div className="text-2xl text-center py-16"></div>
        ) : (
          <div className="flex flex-col space-y-4 w-full">
            {notifications.map((notification) => (
              <div
                key={notification.notifyId}
                className="cursor-pointer flex items-center p-4 border rounded-lg shadow-sm bg-white w-full"
                onClick={() =>
                  goUserPage(
                    notification.postType,
                    notification.postId,
                    notification.senderMemberId
                  )
                }
              >
                {/* 프로필 이미지 */}
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={
                      notification.senderProfileImgUri || "/default-image.png"
                    }
                    alt={notification.senderNickName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 알림 내용 */}
                <div className="ml-4 flex-1">
                  <p className="text-lg font-semibold">{notification.title}</p>
                  <p className="text-gray-500 text-sm">
                    {dayjs(notification.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
