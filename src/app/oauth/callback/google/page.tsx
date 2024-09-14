"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import LogoMain from "../../../../../public/LogoMain.svg";
import Cookies from "js-cookie";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function GoogleLogin() {
  const router = useRouter();
  const executedRef = useRef(false);
  useEffect(() => {
    if (executedRef.current) return; // If already executed, return
    executedRef.current = true;
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    console.log("authCode :", authCode);

    const loginHandler = async (code: string | string[]) => {
      try {
        const res = await axios.post(`/api/oauth/callback/google?code=${code}`);
        const Data = res.data;
        const accessToken = res.data.data.access_token;
        console.log("Access token received:", accessToken);
        console.log("data returned from api: ", Data); // 데이터 잘 받아오는지 확인용 로그
        const socialName = "google";

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
        console.log(roleRes.data);
        console.log("User role received:", role);
        if (role === "MEMBER") {
          router.push("/");
        } else if (role === "GUEST") {
          router.push("/blogRegister");
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    if (authCode) {
      loginHandler(authCode);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] text-center">
      <div className="mb-4">
        <Image src={LogoMain} alt="Logo" width={300} height={300} />
      </div>
      <div className="text-[2rem] font-medium">
        로그인중입니다.
        <span className="inline-block ml-2 animate-dots">...</span>
      </div>
    </div>
  );
}
