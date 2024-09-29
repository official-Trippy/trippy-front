"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import Header from "@/components/shared/header/Header";
import FallingContainer from "@/components/falling/FallingContainer";

interface INotification {
  notifyId: number;
  title: string;
  senderProfileImgUri: string | null;
  senderNickName: string;
  createdAt: string;
  read: boolean;
}

dayjs.extend(relativeTime);
dayjs.locale("ko");

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const accessToken = Cookies.get("accessToken");

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
      }
    };
    fetchNotifications();
  }, [accessToken]);

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

  return (
    <div>
      <Header />
      <FallingContainer />
      <div className="header flex justify-between items-center w-[50%] mx-auto relative">
        <h1 className="text-5xl">알림</h1>
        {/* 전체 삭제 버튼 */}
        {notificationCount > 0 && (
          <button
            onClick={handleDeleteAllNotifications}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            전체 삭제
          </button>
        )}
      </div>

      {/* 총 알림 개수 표시 */}
      <div className="w-[50%] mx-auto my-4">
        <h2 className="text-3xl font-semibold">
          {notificationCount > 0 ? (
            <>
              <span className="text-[#FB3463]">{notificationCount}</span>
              개의 새로운 알림
            </>
          ) : (
            "새로운 알림이 없습니다"
          )}
        </h2>
      </div>

      {/* 알림 리스트 표시 영역 */}
      <div className="w-[50%] mx-auto my-8 flex justify-start">
        {notifications.length === 0 ? (
          <div className="text-2xl text-center py-16">알림이 없습니다</div>
        ) : (
          <div className="flex flex-col space-y-4 w-full">
            {notifications.map((notification) => (
              <div
                key={notification.notifyId}
                className="flex items-center p-4 border rounded-lg shadow-sm bg-white w-full"
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
                {/* 개별 삭제 버튼 */}
                <button
                  onClick={() =>
                    handleDeleteNotification(notification.notifyId)
                  }
                  className="text-red-500 hover:text-red-700 px-2 py-1"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
