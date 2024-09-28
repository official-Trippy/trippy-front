"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LogoHeader from "../../../../public/LogoHeader.svg";
import AlertImg from "../../../../public/AlertImg.png";
import DefaultImage from "../../../../public/defaultImage.svg";
import searchIconMobile from "../../../../public/search_icon_mobile.svg"; // Mobile search icon
import alertIconMobile from "../../../../public/alert_icon_mobile.svg"; // Mobile alert icon
import UserModal from "@/components/userInfo/userModal";
import { useUserStore } from "@/store/useUserStore";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import SearchBar from "@/components/search/searchBar";
import NotificationComponent from "@/components/notification/notificationComponent"; // Import NotificationComponent
import SearchBarMobileBar from "@/components/search/searchMobileBar";
import postwriteImg from "@/dummy/postwrite.svg";

const Header = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false); // New state for notifications
  const [isLoading, setIsLoading] = useState(true);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

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

  //수정 고려중
  // useEffect(() => {
  //   const EventSource = EventSourcePolyfill || NativeEventSource;
  //   const eventSource = new EventSource(
  //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notify/subscribe`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       heartbeatTimeout: 86400000,
  //     }
  //   );

  //   eventSource.addEventListener("connect", (event: any) => {
  //     const { data: receivedConnectData } = event;
  //     console.log(receivedConnectData, "받아온 데이터임");
  //     if (receivedConnectData === "SSE 연결이 완료되었습니다.") {
  //       console.log("SSE CONNECTED");
  //     } else {
  //       console.log("연결 안됨요~~!!");
  //     }
  //   });
  //   eventSource.addEventListener("message", (event) => {
  //     console.log("Received message:", event.data);
  //   });
  // });

  const onClickLogin = () => {
    router.push("/login");
  };

  const handleModalToggle = () => {
    setModalVisible(!modalVisible);
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
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
      <div className="hidden mt-[20px] mb-[20px] sm-700:flex sm-700:justify-between sm-700:items-center sm-700:w-[80%] sm-700:mx-auto sm-700:relative">
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
                className={`text-gray-800 no-underline ${pathname === "/" ? "font-bold" : ""}`}
                style={{ fontSize: "1.4rem" }}
              >
                HOME
              </div>
            </Link>
            <Link href="/ootd">
              <div
                className={`text-gray-800 pl-8 no-underline ${pathname === "/ootd" ? "font-bold" : ""}`}
                style={{ fontSize: "1.4rem" }}
              >
                OOTD
              </div>
            </Link>
          </div>
        </div>

        <div className="flex items-center flex-grow max-w-[90%]">
          <div className="flex mx-auto w-full">
            <SearchBar />
          </div>

          {/* <div className="ml-auto mr-4 md-850:hidden">

            <Image
              src={searchIconMobile}
              alt="Search"
              width={24}
              height={24}
              className="cursor-pointer"
            />

          </div> */}

          {!loading && !isGuest && (
            <>
              {userInfo && accessToken ? (
                <div className="flex relative items-center gap-8">
                  <div className="w-[18px] h-[18px] relative">
                    <Image
                      src={alertIconMobile}
                      alt="alert"
                      width={18}
                      height={18}
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
                    <div onClick={() => { handleModalToggle(); setIsDropdownOpen(false); }}>
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
                          src={userInfo.profileImageUrl || DefaultImage}
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
                        bottom: "-200px",
                        left: "-210px",
                      }}
                      handleLogout={async () => {
                        Cookies.remove("accessToken");
                        Cookies.remove("refreshToken");
                        await router.push("/login");
                      }}
                    />
                  </div>
                  {isDropdownOpen && (
                    <div

                      className="absolute w-[27rem] mt-[1rem] ml-[1rem] top-[3.6rem] rounded-[0.8rem] bg-white shadowalltop rounded-lg animate-dropdown z-20"
                      style={{ opacity: 0, transform: 'translateY(-10px)' }}
                      onMouseEnter={() => {
                        setIsDropdownOpen(true);

                      }} // 드롭다운에 마우스가 올라가면 열려있도록 유지

                      onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                      <Link href="/post">
                        <div className="px-[1rem] pt-[1.4rem] rounded-lg border-b border-white">
                          <div className="hover:bg-gray-200 px-[1.3rem] py-[1.2rem]">
                            <div className="flex items-start">
                              <Image
                                className="mr-[1.7rem] mt-[0.5rem]"
                                src={postwriteImg}
                                width={24}
                                height={24}
                                alt=""
                              />
                              <div>

                                <h1 className="text-[1.6rem] font-medium text-black">블로그 티켓 글쓰기</h1>
                                <span className="text-[0.9rem] font-normal text-[#9D9D9D]">여행에서 겪었던 이야기를 기록해 보세요.</span>

                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/write">
                        <div className="px-[1rem] pb-[1.4rem] rounded-lg border-b border-white">
                          <div className="hover:bg-gray-200 px-[1.3rem] py-[1.2rem]">
                            <div className="flex items-start">
                              <Image
                                className="mr-[1.7rem] mt-[0.5rem]"
                                src={postwriteImg}
                                width={24}
                                height={24}
                                alt=""
                              />
                              <div>

                                <h1 className="text-[1.6rem] font-medium text-black">OOTD 글쓰기</h1>
                                <span className="text-[0.9rem] font-normal text-[#9D9D9D]">여행 중 나의 특별한 OOTD를 공유해보세요.</span>

                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}
                  <button
                    className="w-[8.6rem] h-[32px] bg-btn-color text-white text-2xl rounded-[8px] ml-4 font-semibold"
                    onMouseEnter={() => { setIsDropdownOpen(true); setModalVisible(false); }}
                  >
                    글쓰기
                  </button>
                </div>
              ) : (
                <div>
                  <Link href="/login">
                    <button className="w-[8.6rem] h-[32px] bg-btn-color text-white text-2xl rounded-[8px] font-semibold">
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
                <button className="w-[8.6rem] h-[32px] bg-btn-color text-white text-2xl rounded-[8px] font-semibold">
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
            onClick={() => setSearchModalVisible(true)}
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
        {searchModalVisible && (
          <div className="fixed inset-0 z-50 bg-white flex flex-col items-center pt-2">
            {" "}
            {/* pt-8로 상단에 적당히 여백을 줌 */}
            <div className="w-full max-w-[600px] flex justify-between items-center mb-4 px-4 py-2">
              {/* <Image
                src={LogoHeader}
                alt="Logo"
                className="w-[110px] h-[34px] object-contain"
              /> */}
            </div>
            <div className="w-full max-w-[600px] px-4">
              <SearchBarMobileBar
                setSearchModalVisible={setSearchModalVisible}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
