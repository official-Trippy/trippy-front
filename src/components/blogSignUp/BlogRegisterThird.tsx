'use client'

import React from "react";
import Image from "next/image";
import useUserInfo from "@/hooks/useUserInfo";
import BlogStep3 from "../../../public/BlogStep3.svg";
import CheckIcon from "../../../public/CheckIcon.svg";
import TrippyImage from "../../../public/TrippyImage.svg";
import AirplaneIcon from "../../../public/TrippyAirplane.svg";
import Link from "next/link";

const BlogRegisterThird = () => {
  const { userInfo } = useUserInfo();

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
      <Link href='/'>
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
