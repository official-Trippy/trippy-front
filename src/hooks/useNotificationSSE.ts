import { useEffect, useState } from "react";

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
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notify/subscribe`
    );

    eventSource.onmessage = (event) => {
      const newNotification: Notification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
      setLoading(false); // Stop loading when data is received
    };

    eventSource.onerror = (err) => {
      setError("서버와의 연결에 오류가 있습니다.");
      setLoading(false); // Stop loading when an error occurs
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { notifications, error, loading };
};
