"use client";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/shared/header/Header";
import FallingContainer from "@/components/falling/FallingContainer";
import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "react-query";
import Script from "next/script";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { usePathname } from "next/navigation";  // 경로를 확인하는 훅
import NotificationComponent from "@/components/notification/notificationComponent";
import MobileFooter from "@/components/shared/mobile/MobileFooter";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();
const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ID || "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();  // 현재 페이지 경로 가져오기

  // 특정 페이지에서만 Header를 숨기기 (예시: "/login"과 "/signup"에서 Header 숨김)
  const hideHeaderPages = ["/login", "/signUp", "/blogRegister" ,"/blogRegister2", "/blogRegister3", , "/findAccount", , "/findPassword", , "/privacy"];
  const shouldShowHeader = !hideHeaderPages.includes(pathname);

  return (
    <html lang="en">
      <head>
        {/* 사이트 제목 및 설명 설정 */}
        <title>Trippy</title>
        <meta name="description" content="트리피를 통해 여행기를 공유하고 여행지를 찾아보세요!" />

        {/* Open Graph (OG) 메타 태그: 소셜 미디어 미리보기 정보 설정 */}
        <meta property="og:title" content="Trippy" />
        <meta property="og:description" content="트리피를 통해 여행기를 공유하고 여행지를 찾아보세요!" />
        <meta property="og:image" content="/LogoMain.svg" /> {/* 미리보기 이미지 경로 설정 */}
        <meta property="og:url" content="https://www.trippy.or.kr" />

        {/* Twitter 카드 메타 태그 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trippy" />
        <meta name="twitter:description" content="트리피를 통해 여행기를 공유하고 여행지를 찾아보세요!" />
        <meta name="twitter:image" content="/LogoMain.svg" />

        {/* 기타 스크립트 */}
        <Script
          src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"
          strategy="beforeInteractive"
        />
        <Script
          src="http://code.jquery.com/jquery-1.11.3.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="flex flex-col">
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId={clientId}>
            <NotificationComponent />

            {/* 조건에 따라 Header 표시 */}
            {shouldShowHeader && <Header />}

            {children}
            <MobileFooter />
          </GoogleOAuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}