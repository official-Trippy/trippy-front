'use client'

import React from "react";
import Image from "next/image";
import useUserInfo from "@/hooks/useUserInfo";
import BlogStep3 from "../../../public/BlogStep3.svg";
import CheckIcon from "../../../public/CheckIcon.svg";
import Link from "next/link";

const BlogRegisterThird = () => {
  const { userInfo } = useUserInfo();

  return (
    <div className="min-h-[100dvh] flex flex-col justify-between flex-col-reverse sm:flex-col sm:justify-center items-center w-full">
       <div className="w-[90%] max-w-[400px] mx-auto">
      <div className="w-full flex justify-center mt-[20px]">
        <Image src={BlogStep3} alt="Logo" className="w-[30rem]" />
      </div>
      </div>
      <div className="w-[90%] max-w-[400px] mx-auto sm:h-[551px] flex flex-col justify-center">
      <Image src={CheckIcon} alt="checkLogo" className="mx-auto w-[80px] h-[80px]" />
      <div className="sign-up-complete mt-[3.6rem] text-center">회원가입 완료</div>
      <div className="sign-up-complete2 mt-[3.9rem] text-center">
        <div>{userInfo.nickName}님의 회원가입이 완료되었습니다.</div>
        <div>다양한 여행 이야기를 둘러보세요!</div>
      </div>
      </div>
      <div className="w-[90%] max-w-[400px] mx-auto mb-[90px]">
      <Link href='/'>
        <button
          className="mx-auto w-full h-[44px] mt-[2rem] mb-[2rem] bg-btn-color text-white py-2 rounded-xl "
          style={{ fontSize: "1.2rem" }}
        >
          다음
        </button>
      </Link>
      </div>
    </div>
  );
};

export default BlogRegisterThird;
