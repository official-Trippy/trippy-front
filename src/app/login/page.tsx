import LoginForm from "@/components/auth/LoginForm";
import SocialLoginForm from "@/components/auth/SocialLoginForm";
import FallingContainer from "@/components/falling/FallingContainer";

const LoginPage = () => {
  return (
    <div>
      <FallingContainer/>
      <LoginForm />
      <SocialLoginForm />
    </div>
  );
};

export default LoginPage;
