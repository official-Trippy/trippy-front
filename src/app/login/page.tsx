"use client";

import { Login } from "@/services/auth";
import LoginForm from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { loginState } from "@/atoms/user";
import SocialLoginForm from "@/components/auth/SocialLoginForm";

const LoginPage = () => {
  const router = useRouter();
  const [, setLogin] = useRecoilState(loginState);

  const handleSubmit = async ({
    memberId,
    password,
  }: {
    memberId: string;
    password: string;
  }) => {
    try {
      const response = await Login(memberId, password);
      const { accessToken, refreshToken } = response.result;
      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);
      console.log(response);
      setLogin({
        isLoggedIn: true,
        accessToken,
        refreshToken,
      });
      router.push("/home");
      router.refresh();
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleSubmit} />
      <SocialLoginForm />
    </div>
  );
};

export default LoginPage;