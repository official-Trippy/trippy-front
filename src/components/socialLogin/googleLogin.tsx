"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import google from "../../../public/google.svg";

const GoogleLoginButton = () => {
  const router = useRouter();

  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_REDIRECT_URI;

    // const url =
    //   `https://accounts.google.com/o/oauth2/auth?` +
    //   `client_id=${clientId}&` +
    //   `redirect_uri=${redirectUri}&` +
    //   `response_type=code&` +
    //   `scope= email profile`;
    // router.push(url);
    window.location.href =
      `https://accounts.google.com/o/oauth2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
  };

  return (
    <div className="flex flex-col my-1 items-center cursor-pointer">
      <div
        className="text-neutral-900 dark:text-white  px-4 rounded-md my-2 w-[330px] h-[44px] flex items-center justify-center hidden"
        onClick={handleGoogleLogin}
      >
        <Image src={google} alt="kakao" width={330} height={44} />
      </div>
    </div>
  );
};

export default GoogleLoginButton;
