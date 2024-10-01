"use client";

import { useEffect } from "react";
import Image from "next/image";
import kakao from "../../../public/kakao.svg";
import naver from "../../../public/naver.svg";
import google from "../../../public/google.svg";
import NaverLoginHandler from "./naverLogin";
import { useRouter } from "next/navigation";

const kakaoRedirectUri = process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI;

const kakaoScope = [
  "profile_nickname",
  "profile_image",
  "account_email",
  "openid",
].join(",");

export default function KakaoLogin() {
  const router = useRouter();

  useEffect(() => {
    // Kakao SDK 로드 및 초기화
    const Kakao = (window as any)?.Kakao;
    if (Kakao) {
      if (!Kakao.isInitialized()) {
        Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        console.log("Kakao SDK Initialized: ", Kakao.isInitialized());
      }
    }
  }, []);

  useEffect(() => {
    // Kakao SDK 스크립트 추가
    const kakaoSDK = document.createElement("script");
    kakaoSDK.async = false;
    kakaoSDK.src = `https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js`;
    kakaoSDK.integrity = `sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4`;
    kakaoSDK.crossOrigin = `anonymous`;
    document.head.appendChild(kakaoSDK);

    const onLoadKakaoAPI = () => {
      const Kakao = (window as any)?.Kakao;
      if (Kakao && !Kakao.isInitialized()) {
        Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        console.log("Kakao SDK Initialized: ", Kakao.isInitialized());
      }
    };

    kakaoSDK.addEventListener("load", onLoadKakaoAPI);

    return () => {
      kakaoSDK.removeEventListener("load", onLoadKakaoAPI);
    };
  }, []);

  const kakaoLoginHandler = () => {
    const Kakao = (window as any)?.Kakao;
    if (Kakao) {
      Kakao.Auth.authorize({
        redirectUri: kakaoRedirectUri,
        scope: kakaoScope,
      });
      console.log("Kakao Logging in");
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col my-1 items-center">
      <div
        className="bg-kakao-btn text-neutral-900 dark:text-white  px-4 rounded-md my-2 w-[310px] h-[44px] flex items-center justify-center"
        onClick={kakaoLoginHandler}
      >
        <Image src={kakao} alt="kakao" width={330} height={44} />
      </div>
    </div>
  );
}
