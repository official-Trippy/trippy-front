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
    <div className="flex flex-col items-center justify-center w-[80%] mx-auto mt-[15rem]">
      <Image src={BlogStep3} alt="Logo" className="w-[47.7rem] mx-auto" />
      <Image src={CheckIcon} alt="checkLogo" className="mx-auto mt-[10.9rem] w-[10.3rem] h-[10.3rem]" />
      <div className="sign-up-complete mt-[3.6rem] text-center">회원가입 완료</div>
      <div className="sign-up-complete2 mt-[3.9rem] text-center">
        <div>{userInfo.nickName}님의 회원가입이 완료되었습니다.</div>
        <div>다양한 여행 이야기를 둘러보세요!</div>
      </div>
      <Link href='/home'>
        <button
          className="mx-auto bg-btn-color mt-[8rem] mb-[10rem] w-[22rem] h-[6rem] text-white py-2 rounded-2xl focus:outline-none text-center"
          style={{ fontSize: "1.6rem" }}
        >
          다음
        </button>
      </Link>
    </div>
  );
};

export default BlogRegisterThird;
