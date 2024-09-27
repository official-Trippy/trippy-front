'use client';

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LogoMain from "../../../public/LogoMain.svg";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { Login } from "@/services/auth";
import Swal from 'sweetalert2';
import { useUserStore } from "@/store/useUserStore"; // 전역 상태 import

const LoginForm = () => {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  
  // 전역 상태에서 fetchUserInfo 호출하기 위해 상태 불러오기
  const { fetchUserInfo } = useUserStore();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    const role = Cookies.get("role");

    if (role) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove('role');
      router.push("/");
      router.refresh();
    }
    if (accessToken && refreshToken) {
      router.push("/");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await Login(memberId, password);
      console.log(response);
      const { accessToken, refreshToken, role } = response.result;

      if (role === "GUEST") {
        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);
        Cookies.set("role", response.result.role);

        Swal.fire({
          icon: 'error',
          iconColor: '#FB3463',
          title: '기존에 회원가입을 \n완료하지 않았습니다.',
          text: '블로그 설정 페이지로 이동합니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463', 
        }).then(() => {
          router.push("/blogRegister");
        });
      } else if (role === "MEMBER" || role === "ADMIN") {
        // accessToken과 refreshToken을 쿠키에 저장
        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);

        // 전역 상태에 유저 정보 저장
        await fetchUserInfo(); // 전역 상태에 유저 정보를 업데이트

        router.push("/");
      }
      router.refresh();
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("이메일이 올바르지 않거나 비밀번호가 틀렸습니다");
    }
  };

  return (
    <div className="mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <Link href="/">
          <Image src={LogoMain} alt="Logo" className=""/>
        </Link>
        <div className="flex flex-col mt-[6rem]">
          <label htmlFor="email" className="login-info mb-2">
            이메일
          </label>
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
          <label htmlFor="password" className="login-info mb-2">
            비밀번호
          </label>
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