"use client";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/shared/header/Header";
import FallingContainer from "@/components/falling/FallingContainer";
import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "react-query";
import Script from "next/script";
import { GoogleOAuthProvider } from "@react-oauth/google";

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
  return (
    <html lang="en">
      <head>
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
            {/* <FallingContainer /> */}
            {children}
            <MobileFooter />
          </GoogleOAuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
