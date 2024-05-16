"use client"

import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/shared/header/Header";
import FallingContainer from '@/components/falling/FallingContainer';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from "react-query";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="flex flex-col">
        <QueryClientProvider client={queryClient}>
          {children}
          {/* <FallingContainer/> */}
        </QueryClientProvider>
      </body>
    </html>
  );
}