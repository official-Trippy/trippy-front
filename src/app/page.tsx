import Image from "next/image";
import Header from "@/components/shared/header/Header";
import FallingContainer from "@/components/falling/FallingContainer";
import AuthSession from "@/components/AuthSession";

export default function Home() {
  return (
    <AuthSession>
      <Header />
    </AuthSession>
  );
}
