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
  const [isMobile, setIsMobile] = useState(false); // 모바일 화면 여부를 관리하는 상태
  const queryClient = useQueryClient();
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

        const newNotification: INotification = data;
        setNotifications((prev) => [...prev, newNotification]);
        setShowNotification(true);

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

  if (!showNotification || notifications.length === 0) return null;

  const latestNotification = notifications[notifications.length - 1];

  const router = useRouter();

  if (isMobile) {
    return (
      <div
        className="fixed top-[7.4rem] left-[50%] translate-x-[-50%] bg-[rgba(49,49,49,0.95)] rounded-[10px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.08)] inline-flex items-center gap-[9px] px-[12px] py-[13px] w-[90%] h-[45px] z-50"
        onClick={() => {
          router.push("/notifications");
        }}
      >
        <img
          className="w-[35px] h-[35px] rounded-full"
          src={latestNotification.senderProfileImgUri || "/default-image.png"}
          alt={latestNotification.senderNickName}
        />
        <div className="flex-1 text-sm font-medium text-white">
          {latestNotification.title}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-[6.5rem] right-[16rem] z-50 w-[390px] h-[300px] bg-white shadow-lg rounded-lg p-[28px] flex flex-col">
      {/* 상단 중앙 제목 */}
      <div className="text-center text-lg font-semibold text-gray-900 mb-4">
        알림
      </div>

      {/* 알림 목록 */}
      <div
        className="flex flex-col space-y-2 overflow-auto"
        style={{ maxHeight: "calc(100% - 80px)" }}
      >
        {notifications.slice(0, 4).map((notification) => (
          <div
            key={notification.notifyId}
            className="w-[337px] h-[60px] bg-gray-100 rounded-lg flex items-center p-4"
          >
            <img
              className="w-[60px] h-[60px] rounded-full flex-shrink-0"
              src={notification.senderProfileImgUri || "/default-image.png"}
              alt={notification.senderNickName}
            />
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {formatTimeAgo(notification.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          className="p-2 bg-[#F5F5F5] text-black rounded-lg"
          onClick={() => {
            router.push("/notifications");
          }}
        >
          더보기
        </button>
      </div>
    </div>
  );
};

export default Notification;
