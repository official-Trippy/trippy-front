"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const NaverCallback = () => {
  const router = useRouter();
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;
    executedRef.current = true;
    const handleNaverCallback = async () => {
      // 해시 부분에서 access_token 추출
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const state = params.get("state");

      if (accessToken && state) {
        try {
          console.log(accessToken);
          console.log("Access token received:", accessToken);

          const socialName = "naver";
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
          console.log(roleRes.data);
          if (role === "MEMBER") {
            router.push("/");
          } else if (role === "GUEST") {
            router.push("/blogRegister");
          }
        } catch (error) {
          console.error("Naver login failed:", error);
          router.push("/");
        }
      }
    };

    handleNaverCallback();
  }, [router]);

  return <div>네이버 로그인 처리 중...</div>;
};

export default NaverCallback;
