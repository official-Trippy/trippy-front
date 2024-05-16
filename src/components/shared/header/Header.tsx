'use client'
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import LogoHeader from "../../../../public/LogoHeader.svg";
import AlertImg from "../../../../public/AlertImg.png";
import Profile from "../../../../public/Profile.png";
import UserModal from "@/components/userInfo/userModal";
import { getMyInfo } from "@/services/auth";
import { UserInfoType } from "@/types/auth";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const checkLoginState = async () => {
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");
      if (accessToken && refreshToken) {
        setIsLoggedIn(true);
      }
      setLoading(false);
    };

    checkLoginState();
  }, []);

  const handleModalToggle = async () => {
    if (!modalVisible) {
      try {
        const userData = await getMyInfo();
        setUserInfo(userData);
      } catch (error) {
        console.error("Error getting user info:", error);
      }
    }
    setModalVisible(!modalVisible);
  };

  return (
    <header className="header flex justify-between items-center w-[80%] mx-auto relative">
      <div className="flex items-center">
        <div className="mr-4">
          <Link href="/">
            <Image src={LogoHeader} alt="Logo" />
          </Link>
        </div>
        <div className="flex space-x-4 text-lg">
          <Link href="/home">
            <div
              className="text-gray-800 px-10"
              style={{ fontSize: "1.4rem" }}
            >
              홈
            </div>
          </Link>
          <Link href="/ootd">
            <div className="text-gray-800" style={{ fontSize: "1.4rem" }}>
              OOTD
            </div>
          </Link>
        </div>
      </div>

      <div className="flex items-center">
        <div className="mr-4">{/* 검색창 컴포넌트 */}</div>
        {!loading && (
          <>
            {isLoggedIn ? (
              <div className="flex">
                <Link href="/write">
                  <button
                    className="-[8.6rem] h-[3.5rem] bg-btn-color text-white px-7 py-2 rounded-lg mr-8"
                    style={{ fontSize: "1.6rem" }}
                  >
                    글쓰기
                  </button>
                </Link>
                <div className="mr-8 w-[24px] my-auto">
                  <Image src={AlertImg} alt="alert" />
                </div>
                <div className="w-[32px] my-auto relative">
                  <div onClick={handleModalToggle}>
                    <Image src={Profile} alt="profile" />
                  </div>
                  <UserModal
                    isOpen={modalVisible}
                    onClose={() => setModalVisible(false)}
                    userInfo={userInfo}
                    style={{
                      position: "absolute",
                      bottom: "-260px", 
                      left: "-290px", 
                    }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <Link href="/login">
                  <button
                    className="w-[8.6rem] h-[3.5rem] bg-btn-color text-white px-6 py-2 rounded-lg"
                    style={{ fontSize: "1.6rem" }}
                  >
                    로그인
                  </button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
