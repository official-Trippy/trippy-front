"use client";

import { useRouter } from "next/navigation";
import axios from "axios";

const SocialLoginForm = () => {
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
  return (
    <div className="flex flex-col my-10 items-center">
      <div
        className="social-login-btn bg-kakao-btn text-black px-4 rounded-md my-2 w-[320px] h-[44px] flex items-center justify-center"
        onClick={() => handleSocialLogin("kakao")}
      >
        카카오 로그인
      </div>
      <div
        className="social-login-btn bg-naver-btn text-white px-4 rounded-md my-2 w-[320px] h-[44px] flex items-center justify-center"
        onClick={() => handleSocialLogin("naver")}
      >
        네이버 로그인
      </div>
      <div
        className="social-login-btn bg-google-btn text-black px-4 rounded-md my-2 w-[320px] h-[44px] flex items-center justify-center"
        onClick={() => handleSocialLogin("google")}
      >
        Google 로그인
      </div>
    </div>
  );
};

export default SocialLoginForm;
