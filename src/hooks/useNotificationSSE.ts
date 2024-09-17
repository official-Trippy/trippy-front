import { useEffect, useState } from "react";
import axios from "axios";

interface Notification {
  notifyId: number;
  title: string;
  content: string | null;
  senderProfileImgAccessUri: string;
  senderNickName: string;
  notificationType: "LIKE" | "COMMENT" | "FOLLOW";
  createdAt: string;
  read: boolean;
}

export const useNotificationSSE = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 토큰을 localStorage 혹은 다른 방식으로 가져온다고 가정
    let accessToken = "";

    // axios로 먼저 구독 요청 (토큰 포함)
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notify/subscribe`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        // 구독 성공 후 EventSource 시작
        const eventSource = new EventSource(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notify/subscribe?token=${accessToken}`
        );

        eventSource.onmessage = (event) => {
          const newNotification: Notification = JSON.parse(event.data);
          setNotifications((prev) => [newNotification, ...prev]);
          setLoading(false); // Stop loading when data is received
        };

        eventSource.onerror = (err) => {
          setError("error");
          setLoading(false); // Stop loading when an error occurs
          eventSource.close();
        };

        return () => {
          eventSource.close();
        };
      })
      .catch((error) => {
        setError("Subscription failed");
        setLoading(false);
      });
  }, []);

  return { notifications, error, loading };
};
