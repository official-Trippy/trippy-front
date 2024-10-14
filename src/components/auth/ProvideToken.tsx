import axios from '@/app/api/axios';
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/types/auth";

const SendSessionToServer = () => {
  const { data: session, status } = useSession() as { data: CustomSession | null; status: string };

  useEffect(() => {
    if (status === "authenticated" && session) {
      const sendSessionInfoToServer = async () => {
        try {
          // session 객체에서 accessToken을 가져옵니다.
          const accessToken = session.accessToken;

          const response = await axios.post(
            "http://158.180.85.187:8080/session-info",
            {
              data: {
                user: session.user,
                accessToken: accessToken,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          // console.log("세션 정보 전송 완료", response.data);
        } catch (error) {
          // console.error("세션 정보 전송 실패:", error);
        }
      };

      sendSessionInfoToServer();
    }
  }, [session, status]);

  return <></>;
};

export default SendSessionToServer;
