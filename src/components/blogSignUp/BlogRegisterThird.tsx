'use client';

import React, { useEffect } from "react";
import Image from "next/image";
import useUserInfo from "@/hooks/useUserInfo";
import BlogStep3 from "../../../public/BlogStep3.svg";
import TrippyImage from "../../../public/TrippyImage.svg";
import Link from "next/link";
import Cookies from "js-cookie";  
import { useRouter } from "next/navigation";

const BlogRegisterThird = () => {
  const { userInfo } = useUserInfo();
  const router = useRouter();

  useEffect(() => {
    // 페이지 진입 시 로그인 상태 및 role 값을 확인
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    const role = Cookies.get("role");

    // 로그인이 된 상태에서 role이 GUEST일 경우, 회원가입 페이지에 머물도록 함
    if (accessToken && refreshToken && role === "GUEST") {
      // GUEST 사용자이므로 회원가입 페이지에 머물게 합니다.
      return;
    }

    // // 로그인이 되었지만 role이 MEMBER 또는 ADMIN인 경우 리다이렉트
    if (role === "MEMBER" || role === "ADMIN") {
      router.push("/");
      return;
    }

    // 로그인하지 않은 사용자는 이 페이지에 접근할 수 있도록 허용
  };

  // 홈으로 버튼 클릭 시 쿠키 업데이트 로직
  const handleHomeClick = () => {
    const role = Cookies.get("role");
    // Cookies.set("role", "MEMBER");
    // role이 GUEST이면 MEMBER로 업데이트
    if (role === "GUEST") {
      Cookies.set("role", "MEMBER");
    }
  };

  return (
    <div className="min-h-[calc(100dvh-60px)] flex flex-col justify-between flex-col-reverse mb-[60px] sm:flex-col sm-700:min-h-[100vh] sm-700:justify-center sm-700:mb-0 items-center w-full">
      <div className="w-[90%] max-w-[400px] mx-auto">
        <div className="w-full flex justify-center mt-[20px]">
          <Image src={BlogStep3} alt="Logo" className="w-[30rem]" />
        </div>
      </div>
      <div className="w-[90%] max-w-[400px] mx-auto my-auto sm-700:my-0 sm-700:mt-[4rem]">
        <Image src={TrippyImage} alt="checkLogo" className="mx-auto" />
        <div className="sign-up-complete mt-[3.6rem] text-center">회원가입 완료</div>
        <div className="sign-up-complete2 mt-[3.9rem] text-center">
          <div>{userInfo.nickName}님의 회원가입이 완료되었습니다.</div>
          <div>다양한 여행 이야기를 둘러보세요!</div>
        </div>
      </div>
      <div className="w-[90%] max-w-[400px] mx-auto mt-auto sm-700:mt-0">
        <Link href="/" onClick={handleHomeClick}>
          <button
            className="mx-auto w-full sm-700:w-[150px] h-[44px] mt-[2rem] mb-[2rem] text-white py-2 rounded-xl flex justify-center items-center bg-btn-color"
            style={{ fontSize: "1.2rem" }}
          >
            홈으로
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BlogRegisterThird;