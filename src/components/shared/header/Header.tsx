'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoHeader from "../../../../public/LogoHeader.svg";
import AlertImg from "../../../../public/AlertImg.png";
import Profile from "../../../../public/Profile.png";
import UserModal from "@/components/userInfo/userModal";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Header = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const { userInfo, loading, fetchUserInfo } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const onClickLogin = () => {
    router.push("/login");
  };

  const handleModalToggle = () => {
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
            <div className="text-gray-800 px-10" style={{ fontSize: "1.4rem" }}>
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
            {userInfo ? (
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
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        className="my-auto"
                        src={userInfo.profileImageUrl || Profile}
                        alt="profile"
                        width={32}
                        height={32}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
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
                    handleLogout={async () => {
                      Cookies.remove("accessToken");
                      Cookies.remove("refreshToken");
                      await router.push("/login");
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
};

export default Header;
