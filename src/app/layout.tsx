'use client';

import { RecoilRoot } from 'recoil';
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/shared/header/Header";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilRoot>
        {pathname !== "/signUp" && pathname !== "/login" && pathname !== "/blogRegister" && pathname !== "/blogRegister2" && <Header />}
          {children}
        </RecoilRoot>
      </body>
    </html>
  );
}