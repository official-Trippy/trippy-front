import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';

const useRoleCheck = (requiredRole: string, redirectTo: string) => {

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/api/member/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const { role } = response.data.result;

        if (role !== requiredRole) {
          router.push(redirectTo);
        }
      } catch (error) {
        console.error("Error checking role:", error);
        router.push("/login");
      }
    };

    checkRole();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, requiredRole, redirectTo]);
};

export default useRoleCheck;
