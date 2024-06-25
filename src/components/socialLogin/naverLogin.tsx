"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import kakao from "../../../public/naver.svg";

const NaverLogin = () => {
  const naverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { naver } = window as any;

      if (naver) {
        const naverLogin = new naver.LoginWithNaverId({
          clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
          callbackUrl: process.env.NEXT_PUBLIC_NAVER_LOGIN_REDIRECT_URI,
          isPopup: false,
          loginButton: { color: "green", type: 3, height: 5 }, // 이 버튼은 보이지 않지만 여전히 필요합니다.
        });

        naverLogin.init();
      } else {
        console.error("Naver SDK를 로드할 수 없습니다.");
      }
    }
  }, []);

  const userAccessToken = () => {
    window.location.href.includes("access_token") && getToken();
  };

  const getToken = () => {
    const token = window.location.href.split("=")[1].split("&")[0];
    // 여기서 토큰을 처리합니다.
  };

  useEffect(() => {
    userAccessToken();
  }, []);

  const handleCustomButtonClick = () => {
    if (naverRef.current) {
      const naverButton = naverRef.current.querySelector("a") as HTMLElement;
      if (naverButton) {
        naverButton.click();
      }
    }
  };

  return (
    <div className="flex flex-col my-0 items-center">
      <div
        id="naverIdLogin"
        className="hidden" // 기본 버튼을 숨깁니다.
        ref={naverRef}
      ></div>
      <div
        className="bg-naver-btn text-white px-4 rounded-md my-2 w-[310px] h-[44px] flex items-center justify-center cursor-pointer"
        onClick={handleCustomButtonClick}
      >
        <Image src={kakao} alt="kakao" width={330} height={15} />
      </div>
    </div>
  );
};

export default NaverLogin;
