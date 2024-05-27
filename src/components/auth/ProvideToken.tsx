import axios from "axios";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const SendSessionToServer = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const sendSessionInfoToServer = async () => {
        try {
          const accessToken = user?.accessToken;

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

          console.log("세션 정보 전송 완료", response.data);
        } catch (error) {
          console.error("세션 정보 전송 실패:", error);
        }
      };

      sendSessionInfoToServer();
    }
  }, [session, status]);
  return <></>;
};
