'use client'

import React, { useState } from "react";
import Image from "next/image";
import LogoMain from "../../../public/LogoMain.svg";
import Link from "next/link";

const AccountResponse = () => {

  return (
    <div className="flex flex-col items-center justify-center w-[80%] mx-auto mt-[19rem]">
      <Image src={LogoMain} alt="Logo" className="w-[16.4rem] mx-auto" />
      <div className="flex flex-col mt-[6rem]">
        <div className="text-center text-zinc-800 text-4xl font-semibold font-['Pretendard']">계정 찾기</div>
        <div className="text-center text-neutral-400 text-2xl text-base font-normal font-['Pretendard'] mt-[1rem]">해당 닉네임으로 가입한 이메일 정보입니다.</div>
      </div>
      <div className="mt-[6rem] w-full">
        
      </div>
      <Link href="/login">
        <button
          className="mx-auto mt-[8rem] mb-[10rem] w-[22rem] h-[6rem] text-white py-2 rounded-2xl focus:outline-none text-center bg-btn-color hover:bg-[#FB3463]"
          style={{ fontSize: "1.6rem" }}
        >
          로그인 하러가기
        </button>
      </Link>
    </div>
  );
};

export default AccountResponse;
