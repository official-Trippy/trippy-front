'use client';

import { RecoilRoot } from 'recoil';
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/shared/header/Header";
import { QueryClient, QueryClientProvider } from 'react-query';

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <Header />
            {children}
          </RecoilRoot>
        </QueryClientProvider>
      </body>
    </html>
  );
}