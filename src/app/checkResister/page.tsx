"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { checkSocial, signUp } from '@/utils/socialAuth';

const CheckUserRegistration: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRouterReady] = useState(true);

  useEffect(() => {
    if (isRouterReady) {
      const password = "1004";
      const email = session?.user?.email;

      if (status === "authenticated" && email) {
        const checkUser = async () => {
          try {
            const isNewMember = await checkSocial(email);
            if (isNewMember) {
              // 신규 사용자
              await signUp({ memberId: email, email, password });
              router.push("/detailregister");
            } else {
              // 기존 사용자
              router.push("/home");
            }
          } catch (error) {
            console.error("Error checking user:", error);
          }
        };
        checkUser();
      } else {
        console.error("User is not authenticated or email is missing");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRouterReady, session, status]);

  return (
    <div>
      {status === "loading" && <p>Loading...</p>}
      {status === "authenticated" && <p>Authenticated</p>}
      {status === "unauthenticated" && <p>Not Authenticated</p>}
    </div>
  );
};

export default CheckUserRegistration;
