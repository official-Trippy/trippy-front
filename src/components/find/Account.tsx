'use client'

import React, { useState } from "react";
import Image from "next/image";
import LogoMain from "../../../public/LogoMain.svg";
import Link from "next/link";
import { findAccount } from "@/services/auth";

const Account = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [accountFound, setAccountFound] = useState(false);
  const [badRequest, setBadRequest] = useState(false);

  const isNicknameValid = () => {
    return /^[A-Za-z]{4,}$/.test(nickname) || /^[가-힣]{2,}$/.test(nickname);
  };

  const isNextButtonDisabled = () => {
    return !isNicknameValid();
  };

  const handleNicknameChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setNickname(e.target.value);
  };

  const handleFindAccount = async () => {
    try {
      const response = await findAccount(nickname);
      if (response.isSuccess) {
        setEmail(response.result.email);
        setAccountFound(true);
        setBadRequest(false);
      } else {
        setBadRequest(true);
        setAccountFound(false);
      }
    } catch (error) {
      console.error("계정 찾기 오류:", error);
      setBadRequest(true);
      setAccountFound(false);
    }
  };

  const handleTryAgain = () => {
    setAccountFound(false);
    setBadRequest(false);
    setEmail("");
    setNickname("");
  };

  return (
    <div className="flex flex-col items-center justify-center w-[80%] mx-auto mt-[19rem]">
      <Image src={LogoMain} alt="Logo" className="w-[16.4rem] mx-auto" />
      <div className="flex flex-col mt-[6rem]">
        <div className="text-center text-zinc-800 text-4xl font-semibold font-['Pretendard']">계정 찾기</div>
        <div className="text-center text-neutral-400 text-2xl text-base font-normal font-['Pretendard'] mt-[1rem]">
          {!accountFound && !badRequest && "계정에 등록된 닉네임을 입력해주세요."}
          {accountFound && '해당 닉네임으로 가입한 이메일 정보입니다.'}
          {accountFound && (
            <>
              <div className="text-center text-black text-xl font-bold font-['Pretendard'] mt-[8.4rem]" style={{ fontSize: "1.6rem" }}>{email}</div>
            </>
          )}
          {badRequest && (
            <>
              <div className="text-center text-black text-xl font-bold font-['Pretendard'] mt-[8.4rem]" style={{ fontSize: "1.6rem" }}>가입된 이력이 없습니다.</div>
            </>
          )}

        </div>
      </div>
      <div className="mt-[6rem] w-full flex flex-col">
        {!accountFound && !badRequest && (
          <>
            <input
              type="text"
              placeholder="가입 시 입력했던 닉네임을 입력해주세요."
              value={nickname}
              onChange={handleNicknameChange}
              className={`w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none ${isNicknameValid() ? "bg-white" : "bg-gray-100"}`}
              style={{ fontSize: "1.5rem" }}
            />
            <button
              onClick={handleFindAccount}
              className={`mx-auto mt-[8rem] mb-[10rem] w-[22rem] h-[6rem] text-white py-2 rounded-2xl focus:outline-none text-center ${isNextButtonDisabled() ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400" : "bg-btn-color hover:bg-[#FB3463]"}`}
              style={{ fontSize: "1.6rem" }}
              disabled={isNextButtonDisabled()}
            >
              다음
            </button>
          </>
        )}
        {badRequest && (
          <button
            onClick={handleTryAgain}
            className={`mx-auto mt-[8rem] mb-[10rem] w-[22rem] h-[6rem] text-white py-2 rounded-2xl focus:outline-none text-center bg-gray-400 hover:bg-gray-500`}
            style={{ fontSize: "1.6rem" }}
          >
            다시 시도하기
          </button>
        )}
        {!badRequest && accountFound && (
          <Link href='/login'>
            <div className="flex">
              <button
                className={`mx-auto mt-[8rem] mb-[10rem] w-[22rem] h-[6rem] text-white py-2 rounded-2xl focus:outline-none text-center bg-btn-color hover:bg-[#FB3463]`}
                style={{ fontSize: "1.6rem" }}
              >
                로그인 하러가기
              </button>
            </div>
          </Link>
        )}

      </div>
    </div>
  );
};

export default Account;