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
  const [maskedEmail, setMaskedEmail] = useState("");

  const isNicknameValid = () => {
    return /^[A-Za-z0-9]{4,}$/.test(nickname) || /^[가-힣0-9]{2,}$/.test(nickname);
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
        const [username, domain] = response.result.email.split("@");
        const maskedUsername = `${username.substring(0, 3)}***`;
        setMaskedEmail(`${maskedUsername}@${domain}`);
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
    <div className="min-h-[calc(100dvh-60px)] flex flex-col justify-between flex-col-reverse mb-[60px] sm:flex-col sm-700:min-h-[100vh] sm-700:justify-center sm-700:mb-0 items-center w-full">
      <div className="w-[100%] max-w-[400px] mx-auto">
       <div className="w-[90%] max-w-[400px] mx-auto">
       <Image src={LogoMain} alt="Logo" className="mx-auto mt-[2rem]" width={130} height={40}  />
      </div>
      <div className="w-[100%] max-w-[400px] mx-auto flex flex-col justify-between">
  <div className="flex flex-col mt-[200px] sm:h-[300px] sm:mt-0 justify-center">
    <div className="text-center text-zinc-800 text-4xl font-semibold font-['Pretendard']">
      계정 찾기
    </div>
    <div className="w-[90%] max-w-[400px] mx-auto">
    <div className="text-center text-neutral-400 text-2xl text-base font-normal font-['Pretendard'] mt-[1rem] h-[20px]">
      {!accountFound && !badRequest && "계정에 등록된 닉네임을 입력해주세요."}
      {accountFound && '해당 닉네임으로 가입한 이메일 정보입니다.'}
    </div>
    <div>
    <div className="text-center text-neutral-400 text-2xl text-base font-normal font-['Pretendard'] mt-[2rem] mb-2">
      {accountFound && (
        <div className="text-center text-neutral-900 dark:text-white  text-xl font-bold font-['Pretendard']" style={{ fontSize: "1.2rem" }}>
          {maskedEmail}
        </div>
      )}
      {badRequest && (
        <div className="text-center text-neutral-900 dark:text-white  text-xl font-bold font-['Pretendard']" style={{ fontSize: "1.2rem" }}>
          가입된 이력이 없습니다.
        </div>
          )}
        </div>

      {!accountFound && !badRequest && (
        <input
          type="text"
          placeholder="가입 시 입력했던 닉네임을 입력해주세요."
          value={nickname}
          onChange={handleNicknameChange}
          className={`w-full px-4 py-2 h-[4rem] rounded-xl focus:border-[#FB3463] focus:outline-none ${isNicknameValid() ? "bg-gray-100" : "bg-gray-100"}`}
          style={{ fontSize: "1.2rem" }}
        />
      )}
      </div>
      </div>
        </div>
        </div>
        </div>
        <div className="w-[90%] max-w-[400px] mx-auto">
        {!accountFound && !badRequest && (
            <button
            onClick={handleFindAccount}
            className={`mx-auto w-full sm-700:w-[150px] h-[44px] mt-[2rem] mb-[2rem] text-white py-2 rounded-xl flex justify-center items-center ${isNextButtonDisabled() ? "cursor-not-allowed bg-[#cfcfcf] hover:bg-[#cfcfcf]" : "bg-btn-color hover:bg-[#FB3463]"}`}
            style={{ fontSize: "1.2rem" }}
            disabled={isNextButtonDisabled()}
          >
            다음
          </button>
          
            )}
             {badRequest && (
          <button
            onClick={handleTryAgain}
            className={`mx-auto w-full sm-700:w-[150px] h-[44px] mt-[2rem] mb-[2rem] bg-btn-color text-white py-2 rounded-xl flex justify-center items-center bg-[#cfcfcf] hover:bg-[#cfcfcf]`}
            style={{ fontSize: "1.2rem" }}
          >
            다시 시도하기
          </button>
        )}
             {!badRequest && accountFound && (
          <Link href='/login'>
            <div className="w-full">
              <button
                className={`mx-auto w-full sm-700:w-[150px] h-[44px] mt-[2rem] mb-[2rem] bg-btn-color text-white py-2 rounded-xl flex justify-center items-center hover:bg-[#FB3463]`}
                style={{ fontSize: "1.2rem" }}
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