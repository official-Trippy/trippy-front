"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { useQueryClient } from "react-query";
import { useRouter } from "next/navigation";

interface INotification {
  notifyId: number;
  title: string;
  senderProfileImgUri: string | null;
  senderNickName: string;
  createdAt: string;
  read: boolean;
}

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const queryClient = useQueryClient();
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const EventSource = EventSourcePolyfill || NativeEventSource;
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notify/subscribe`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Connection: "keep-alive",
          Accept: "text/event-stream",
        },
        heartbeatTimeout: 86400000,
      }
    );

    eventSource.addEventListener("sse", (event: any) => {
      try {
        const data = JSON.parse(event.data);
        const handleNotifications = (data: INotification) => {
          setNotifications((prev) => {
            // 이전 알림을 유지하고 새 알림을 추가
            const updatedNotifications = [...prev, data];

            // 4개를 초과하면 가장 오래된 알림을 제거
            return updatedNotifications.length > 4
              ? updatedNotifications.slice(-4)
              : updatedNotifications;
          });
          setShowNotification(true);
        };

        // const newNotification: INotification = data;

        // setNotifications((prev) => [...prev, newNotification]);
        // setShowNotification(true);

        // 알림은 5초 후에 사라지도록 설정
        setTimeout(() => {
          setShowNotification(false);
          setNotifications((prev) => prev.slice(1)); // 오래된 알림 하나씩 제거
        }, 5000);
      } catch (error) {
        console.log("Invalid JSON data:", event.data);
      }
    });

    return () => {
      eventSource.close();
      console.log("SSE CLOSED");
    };
  }, [accessToken]);

  const formatTimeAgo = (createdAt: string) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInSeconds = (now.getTime() - createdDate.getTime()) / 1000;

    if (diffInSeconds < 60) return "방금";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  const router = useRouter();
  const goNotification = () => {
    router.push(`/notifications`);
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {showNotification &&
        notifications.map((notification) => (
          <div
            key={notification.notifyId}
            className="w-[390px] h-[200px] bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden animate-slide-in-down px-[24px] py-[28px]"
          >
            <div className="w-full text-center text-lg font-semibold text-gray-900 mb-4">
              알림
            </div>

            <div className="flex items-center">

              <div className="flex-shrink-0">
                <img
                  className="w-[60px] h-[60px] rounded-full"
                  src={notification.senderProfileImgUri || "/default-image.png"}
                  alt={notification.senderNickName}
                />
              </div>

              <div className="ml-4 w-[325px]">
                <p className="text-base font-medium text-gray-900 leading-6">
                  {notification.senderNickName}님이 {notification.title}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {formatTimeAgo(notification.createdAt)}

                </p>
              </div>
            </div>

            <div className="flex border-l border-gray-200">
              <button
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => {}}
              >
                더보기
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Notification;
