"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoHeader from "../../../../public/LogoHeader.svg";
import AlertImg from "../../../../public/AlertImg.png";
import Profile from "../../../../public/Profile.png";
import UserModal from "@/components/userInfo/userModal";
import { useUserStore } from "@/store/useUserStore";
import { useRouter, usePathname } from "next/navigation";
import postwriteImg from "@/dummy/postwrite.svg";
import postwriteImg2 from "@/dummy/postwrite2.svg";
import Cookies from "js-cookie";
import SearchBar from "@/components/search/searchBar";
import NotificationComponent from "@/components/notification/notificationComponent"; // Import NotificationComponent

const Header = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false); // New state for notifications
  const [isLoading, setIsLoading] = useState(true);

  const { userInfo, loading, fetchUserInfo } = useUserStore();
  const router = useRouter();
  const pathname = usePathname(); 

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const loadUserInfo = async () => {
      await fetchUserInfo();
      setIsLoading(false); 
    };
    loadUserInfo();
  }, [fetchUserInfo]);

  const onClickLogin = () => {
    router.push("/login");
  };

  const handleModalToggle = () => {
    setModalVisible(!modalVisible);
  };

  const handleNotificationsToggle = () => {
    setIsNotificationsVisible(!isNotificationsVisible); // Toggle notifications
  };

  if (isLoading) {
    return null;
  }

  const isGuest = userInfo?.role === "GUEST";

  return (
    <header className="header flex justify-between items-center w-[66%] mx-auto relative">
      <div className="flex items-center">
        <div className="mr-4">
          <Link href="/">
            <Image src={LogoHeader} alt="Logo" />
          </Link>
        </div>
        <div className="flex space-x-4 text-lg">
          <Link href="/">
            <div
              className={`text-gray-800 px-10 ${pathname === "/" ? "font-bold" : ""}`}
              style={{ fontSize: "1.4rem" }}
            >
              홈
            </div>
          </Link>
          <Link href="/ootd">
            <div
              className={`text-gray-800 ${pathname === "/ootd" ? "font-bold" : ""}`}
              style={{ fontSize: "1.4rem" }}
            >
              OOTD
            </div>
          </Link>
        </div>
      </div>

      <div className="flex items-center">
        <div className="ml-5">
          <SearchBar />
        </div>
        {!loading && !isGuest && (
          <>
            {userInfo && accessToken ? (
              <div className="flex relative">
                <div className="mr-12 w-[24px] my-auto relative">
                  <Image
                    src={AlertImg}
                    alt="alert"
                    onClick={handleNotificationsToggle}
                    className="cursor-pointer"
                  />

                  {/* Notification Dropdown */}
                  {isNotificationsVisible && (
                    <div className="absolute right-0 mt-2 w-[350px] bg-white shadow-lg rounded-lg z-50">
                      <NotificationComponent />
                    </div>
                  )}
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
                <button
                  className="w-[8.6rem] h-[3.5rem] bg-btn-color text-white px-7 py-2 rounded-lg ml-16"
                  style={{ fontSize: "1.6rem" }}
                  onMouseEnter={() => setIsDropdownOpen(true)}
                >
                  글쓰기
                </button>
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
        {!loading && isGuest && (
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
      </div>
    </header>
  );
};

export default Header;
