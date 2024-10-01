"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";  // AxiosError 추가
import Image from "next/image";
import LogoMain from "../../../../../public/LogoMain.svg";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function KakaoTalk() {
  const router = useRouter();
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return; // 인증 로직이 이미 실행된 경우 중복 실행 방지
    executedRef.current = true;

    const authCode = new URL(window.location.href).searchParams.get("code");
    console.log("authCode :", authCode);

    const loginHandler = async (code: string | string[]) => {
      try {
        const res = await axios.post(`/api/oauth/callback/kakao?code=${code}`);
        const data = res.data;
        const accessToken = res.data.data.access_token;

        console.log("Access token received:", accessToken);
        console.log("data returned from api: ", data); 
        

        const socialName = "kakao";
        const roleRes = await axios.post(
          `${backendUrl}/api/member/login/oauth2/${socialName}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const role = roleRes.data.result.role;
        Cookies.set("accessToken", roleRes.data.result.accessToken);
        Cookies.set("role", role);

        window.history.replaceState(null, "", "/blogRegister");

        console.log("User role received:", role);
        if (role === "MEMBER" || role === "ADMIN") {
          router.push("/");
          router.refresh();
          return;
        } else if (role === "GUEST") {
          router.push("/blogRegister");
        }
      } catch (error) {
        // 타입 가드 추가
        if (error instanceof AxiosError) {
          console.error("Error fetching access token:", error);

          // 401 에러 처리
          if (error.response?.status === 401) {
            Cookies.remove("accessToken");
            Cookies.remove("role");
            router.push("/");
          }
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    if (authCode) {
      loginHandler(authCode);
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div role="status">
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
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}