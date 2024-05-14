'use client'

import React, { useState } from "react";
import Image from "next/image";
import useUserInfo from "@/hooks/useUserInfo";
import LogoMain from "../../../public/LogoMain.svg";
import Link from "next/link";

const Account = () => {
  const [nickname, setNickname] = useState("");

  const isNicknameValid = () => {
    return /^[A-Za-z]{4,}$/.test(nickname) || /^[가-힣]{2,}$/.test(nickname);
  };

  const isNextButtonDisabled = () => {
    return !isNicknameValid();
  };
  
  const handleNicknameChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setNickname(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center w-[80%] mx-auto mt-[19rem]">
      <Image src={LogoMain} alt="Logo" className="w-[16.4rem] mx-auto" />
      <div className="flex flex-col mt-[6rem]">
        <div className="text-center text-zinc-800 text-4xl font-semibold font-['Pretendard']">계정 찾기</div>
        <div className="text-center text-neutral-400 text-2xl text-base font-normal font-['Pretendard'] mt-[1rem]">계정에 등록된 닉네임을 입력해주세요.</div>
      </div>
      <div className="mt-[6rem] w-full">
        <input
          type="text"
          placeholder="가입 시 입력했던 닉네임을 입력해주세요."
          value={nickname}
          onChange={handleNicknameChange}
          className={`w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none ${
            isNicknameValid() ? "bg-white" : "bg-gray-100"
          }`}
          style={{ fontSize: "1.5rem" }}
        />
      </div>
      <Link href="/findAccountResponse">
        <button
          className={`mx-auto mt-[8rem] mb-[10rem] w-[22rem] h-[6rem] text-white py-2 rounded-2xl focus:outline-none text-center ${
            isNextButtonDisabled() ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400" : "bg-btn-color hover:bg-[#FB3463]"
          }`}
          style={{ fontSize: "1.6rem" }}
          disabled={isNextButtonDisabled()}
        >
          다음
        </button>
      </Link>
    </div>
  );
};

export default Account;
