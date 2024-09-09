"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios"; 
import Image from "next/image";
import Cookies from "js-cookie";
import LogoMain from "../../../../../public/LogoMain.svg";
import { RoleResponse } from "@/types/auth";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const NaverCallback = () => {
  const router = useRouter();
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;
    executedRef.current = true;
    const handleNaverCallback = async () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const state = params.get("state");

      if (accessToken && state) {
        try {
          console.log("Access token received:", accessToken);

          const socialName = "naver";
          const roleRes: AxiosResponse<RoleResponse> = await axios.post(
            `${backendUrl}/api/member/login/oauth2/${socialName}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          Cookies.set("accessToken", roleRes.data.result.accessToken);

          const role = roleRes.data.result.role;
          console.log(roleRes.data);
          console.log(roleRes.data.result.accessToken);
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
};

export default NaverCallback;