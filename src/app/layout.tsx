import { Inter } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/shared/header/Header";
import FallingContainer from '@/components/falling/FallingContainer';
import '@/styles/globals.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="flex flex-col">
          {children}
          <FallingContainer/>
      </body>
    </html>
  );
}