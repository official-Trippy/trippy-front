"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoHeader from "../../../../public/LogoHeader.svg";
import AlertImg from "../../../../public/AlertImg.png";
import Profile from "../../../../public/Profile.png";
import searchIconMobile from "../../../../public/search_icon_mobile.svg"; // Mobile search icon
import alertIconMobile from "../../../../public/alert_icon_mobile.svg";  // Mobile alert icon
import UserModal from "@/components/userInfo/userModal";
import { useUserStore } from "@/store/useUserStore";
import { useRouter, usePathname } from "next/navigation";
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
    <header className="relative">
      {/* Desktop Layout */}
      <div className="hidden mt-[20px] mb-[20px] sm-700:flex sm-700:justify-between sm-700:items-center sm-700:w-[90%] sm-700:mx-auto sm-700:relative">
        <div className="flex items-center gap-10">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src={LogoHeader}
                alt="Logo"
                className="w-[110px] h-[34px] object-contain"
              />
            </Link>
          </div>
          <div className="flex text-lg">
            <Link href="/">
              <div
                className={`text-gray-800 ${pathname === "/" ? "font-bold" : ""}`}
                style={{ fontSize: "1.4rem" }}
              >
                홈
              </div>
            </Link>
            <Link href="/ootd">
              <div
                className={`text-gray-800 pl-8 ${pathname === "/ootd" ? "font-bold" : ""}`}
                style={{ fontSize: "1.4rem" }}
              >
                OOTD
              </div>
            </Link>
          </div>
        </div>

        <div className="flex items-center flex-grow">
          <div className="ml-auto flex-grow max-w-[600px] min-w-[200px]">
            <SearchBar />
          </div>
          {!loading && !isGuest && (
            <>
              {userInfo && accessToken ? (
                <div className="flex relative items-center gap-8">
                  <div className="w-[20px] h-[20px] relative">
                    <Image
                      src={AlertImg}
                      alt="alert"
                      width={20}
                      height={20}
                      onClick={handleNotificationsToggle}
                      className="cursor-pointer"
                    />
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
                    className="w-[8.6rem] bg-btn-color text-white px-7 py-2 rounded-lg"
                    style={{ fontSize: "1.4rem" }}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                  >
                    글쓰기
                  </button>
                </div>
              ) : (
                <div>
                  <Link href="/login">
                    <button
                      className="w-[8.6rem] bg-btn-color text-white px-6 py-2 rounded-lg"
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
                  className="w-[8.6rem] bg-btn-color text-white px-6 py-2 rounded-lg"
                  style={{ fontSize: "1.6rem" }}
                >
                  로그인
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    
      {/* Mobile Layout */}
      <div className="flex mt-[20px] mb-[20px] sm-700:hidden sm-700:justify-between sm-700:items-center w-[90%] mx-auto">
      <div className="flex-shrink-0">
        <Link href="/">
          <Image
            src={LogoHeader}
            alt="Logo"
            className="w-[110px] h-[34px] object-contain"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <Image
          src={searchIconMobile}
          alt="Search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Image
          src={alertIconMobile}
          alt="Notifications"
          width={24}
          height={24}
          onClick={handleNotificationsToggle}
          className="cursor-pointer"
        />
      </div>
    </div>
    </header>
  );
};

export default Header;
