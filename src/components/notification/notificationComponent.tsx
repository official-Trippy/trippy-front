import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useNotificationSSE } from "@/hooks/useNotificationSSE";

const NotificationComponent = () => {
  const { notifications, error, loading } = useNotificationSSE();

  // Determine content based on states
  const renderContent = () => {
    // if (loading) {
    //   return <div className="p-4 text-gray-700">알림 기능 연결중</div>;
    // }

    // if (error) {
    //   return <div className="p-4 text-red-500">{error}</div>;
    // }

    // if (notifications.length === 0) {
    //   return <div className="p-4 text-gray-700"></div>;
    // }

    return (
      <div className="p-4 ">
        {notifications.map((notification) => (
          <div
            key={notification.notifyId}
            className="mb-4 p-4 bg-gray-100 rounded-lg"
          >
            <div className="flex items-center">
              <Image
                src={
                  notification.senderProfileImgAccessUri ||
                  "/default-profile.png"
                }
                alt="Sender Profile"
                width={40}
                height={40}
                className="rounded-full mr-4"
              />
              <div>
                <p className="text-black">
                  {notification.notificationType === "LIKE" &&
                    `${notification.senderNickName}님이 회원님의 게시물에 좋아요를 눌렀습니다.`}
                  {notification.notificationType === "COMMENT" &&
                    `${notification.senderNickName}님이 회원님의 게시물에 댓글을 달았습니다.`}
                  {notification.notificationType === "FOLLOW" &&
                    `${notification.senderNickName}님이 회원님을 팔로우했습니다.`}
                </p>
                {notification.content && (
                  <p className="text-gray-600 text-sm">
                    {notification.content.length > 30
                      ? `${notification.content.substring(0, 30)}...`
                      : notification.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        <Link href="/notifications">
          <button className="text-blue-500">전체 알림보기</button>
        </Link>
      </div>
    );
  };

  return (
    <div className="fixed top-0 right-0 mt-16 mr-4 z-50 bg-white shadow-lg rounded-lg">
      {renderContent()}
    </div>
  );
};

export default NotificationComponent;
