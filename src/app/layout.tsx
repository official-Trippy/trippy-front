"use client";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/shared/header/Header";
import FallingContainer from "@/components/falling/FallingContainer";
import "@/styles/globals.css";
import AuthSession from "@/components/AuthSession";
import { QueryClient, QueryClientProvider } from "react-query";
import '@toast-ui/editor/dist/toastui-editor.css';

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
        <AuthSession>
          <QueryClientProvider client={queryClient}>
            {/* <FallingContainer /> */}
            {children}
          </QueryClientProvider>
        </AuthSession>
      </body>
    </html>
  );
}
