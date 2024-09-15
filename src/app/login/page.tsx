import LoginForm from "@/components/auth/LoginForm";
import FallingContainer from "@/components/falling/FallingContainer";
import GoogleLogin from "@/components/socialLogin/googleLogin";
import KakaoLogin from "@/components/socialLogin/kakaoLogin";
import NaverLogin from "@/components/socialLogin/naverLogin";

const LoginPage = () => {
  return (
    <div className="min-h-[calc(100dvh-75px)] sm-700:min-h-[100vh] flex flex-col justify-center items-center">
      <FallingContainer />
      <LoginForm />
      <KakaoLogin />
      <NaverLogin />
      <GoogleLogin />
    </div>
  );
};

export default LoginPage;
