'use client';

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoMain from "../../../public/LogoMain.svg";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { Login } from "@/services/auth";

const LoginForm = () => {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const router = useRouter();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    if (accessToken && refreshToken) {
      router.push("/");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await Login(memberId, password);
      const { accessToken, refreshToken, role } = response.result;
      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);

      if (role === "MEMBER") {
        router.push("/");
      } else if (role === "GUEST") {
        router.push("/blogRegister");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("이메일이 올바르지 않거나 비밀번호가 틀렸습니다");
    }
  };

  return (
    <div className="w-[80%] mx-auto mt-[15rem]">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <Image src={LogoMain} alt="Logo" />
        <div className="flex flex-col mt-[6rem]">
          <label htmlFor="email" className="login-info mb-2">이메일</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="trippy@trippy.co.kr"
            className="border-b border-gray-300 rounded-none py-2 w-[320px]"
            style={{ fontSize: "1.6rem" }}
          />
        </div>
        <div className="flex flex-col mt-[2rem]">
          <label htmlFor="password" className="login-info mb-2">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=".email-input border-b border-gray-300 rounded-none py-2 w-[320px]"
            style={{ fontSize: "1.6rem" }}
          />
        </div>
        {errorMessage && (
          <div className="text-red-500 mt-2" style={{ fontSize: "1.2rem" }}>
            {errorMessage}
          </div>
        )}
        <button className="login-btn bg-btn-color text-white mt-[2.4rem] px-4 rounded-md w-[320px] h-[44px]">
          로그인
        </button>
      </form>
      <div className="flex justify-center mt-[2rem] mb-[4rem]">
        <Link href="/findAccount" className="mx-4 text-[#9D9D9D]" style={{ fontSize: "1.2rem" }}>
          계정 찾기
        </Link>
        <Link href="/findPassword" className="mx-4 text-[#9D9D9D]" style={{ fontSize: "1.2rem" }}>
          비밀번호 찾기
        </Link>
        <Link href="/signUp" className="mx-4 text-[#9D9D9D]" style={{ fontSize: "1.2rem" }}>
          회원가입하기
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
