import { useEffect } from "react";
import { useRouter } from "next/navigation"; // 여전히 next/navigation 사용
import Cookies from "js-cookie";

const useProtectedRoute = () => {
  const router = useRouter();
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const role = Cookies.get("role");
    const pathname = window.location.pathname;

    if (accessToken && role === "GUEST" && pathname === "/") {
      router.push("/blogRegister");
    } else if (accessToken && role === "MEMBER" && pathname === "/login") {
      router.push("/");
    }
  }, [router]);
};

export default useProtectedRoute;
