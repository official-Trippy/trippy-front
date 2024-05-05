"use client";

import { signUp } from "@/services/auth";
import SignUpForm from "@/components/auth/SignUpForm";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const router = useRouter();
  const handleSubmit = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      await signUp({ email, password });
      alert(
        "회원가입이 성공적으로 완료되었습니다. 블로그 설정 페이지로 이동합니다."
      );
      router.push("/blogRegister");
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div>
      <SignUpForm onSubmit={handleSubmit} />
    </div>
  );
};

export default SignUpPage;