"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";

import kakao from "../../../public/kakao.svg";
import naver from "../../../public/naver.svg";
import google from "../../../public/google.svg";
import { socialSignUp } from "@/services/auth";

const SocialLoginForm = () => {
  const { data: session } = useSession();

  useEffect(() => {
    // 세션 값이 로그인 상태인 경우
    if (session) {
      // 여기에 사용자를 구별하고 필요한 작업을 수행하는 코드 작성
      console.log("사용자 정보:", session.user);
      // console.log("사용자 정보:", session.user?.email);
    }
  }, [session]);
  const router = useRouter();

  const handleSocialLogin = async (socialName: string) => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL}/api/member/login/oauth2/${socialName}`
      );
      const { accessToken } = response.data;
      console.log(response.data);
      console.log(response);
      console.log(response.data.result);
      console.log(accessToken);
      router.push("/");
      console.log("Redirecting to login page...");
    } catch (error) {
      console.error("Error during social login:", error);
    }
  };

  const handleSocial = async (name: string) => {
    if (name === "kakao") {
      await signIn("kakao", {
        redirect: true,
        callbackUrl: "/checkResister",
      });
    } else if (name === "naver") {
      await signIn("naver", {
        redirect: true,
        callbackUrl: "/blogRegister",
      });
    } else {
      await signIn("google", {
        redirect: true,
        callbackUrl: "/blogRegister",
      });
    }
  };
  return (
    <div className="flex flex-col my-10 items-center">
      <div
        className="bg-kakao-btn text-black px-4 rounded-md my-2 w-[320px] h-[44px] flex items-center justify-center"
        onClick={() => {
          handleSocial("kakao");
        }}
      >
        <Image src={kakao} alt="kakao" width={330} height={44} />
      </div>
      <div
        className="bg-naver-btn text-white px-4 rounded-md my-2 w-[320px] h-[44px] flex items-center justify-center"
        onClick={() => {
          handleSocial("naver");
        }}
      >
        <Image src={naver} alt="naver" width={330} height={44}></Image>
      </div>
      <div
        onClick={() => {
          handleSocial("google");
        }}
      >
        <Image src={google} width={340} height={44} alt="google"></Image>
      </div>
    </div>
  );
};

export default SocialLoginForm;
