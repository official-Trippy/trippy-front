"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoMain from "../../../public/LogoMain.svg";
import Image from "next/image";
import { loginState } from "@/atoms/user";
import { useRecoilState } from "recoil";

interface LoginFormProps {
  onSubmit: (data: { memberId: string; password: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [login, setLogin] = useRecoilState(loginState);
  const { isLoggedIn } = login;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ memberId, password });
  };

  return (
    <div className="w-[80%] mx-auto mt-[9.5rem]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center pt-20"
      >
        <div className="mb-8">
          <Image src={LogoMain} alt="Logo" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">
            이메일
          </label>
          <input
            type="email"
            id="email"
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="trippy@trippy.co.kr"
            className="border-b border-gray-300 rounded-none py-2 w-[320px]"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-b border-gray-300 rounded-none py-2 w-[320px]"
          />
        </div>
        <button className="bg-btn-color text-white px-4 rounded-md my-4 w-[320px] h-[44px]">
          로그인
        </button>
      </form>
      <div className="flex justify-center">
        <a href="#" className="mx-4 text-[#9D9D9D]">
          계정 찾기
        </a>
        <a href="#" className="mx-4 text-[#9D9D9D]">
          비밀번호 찾기
        </a>
        <a href="/register" className="mx-4 text-[#9D9D9D]">
          회원가입하기
        </a>
      </div>
    </div>
  );
};

export default LoginForm;
