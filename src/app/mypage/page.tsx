"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/shared/header/Header";
import UserInformation from "@/components/profile/UserInformation";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import MyTicket from "@/components/profile/MyTicket";
import MyOotd from "@/components/profile/MyOotd";
import MyBadge from "@/components/profile/MyBadge";
import MyBookmark from "@/components/profile/MyBookmark";
import FollowList from "@/components/profile/FollowList";
import Image from "next/image";
import backgroundImg from "../../../public/DefaultBackground.svg";
import { fetchOotdPostCount } from "@/services/ootd.ts/ootdGet";
import { getTotalBoardCount } from "@/services/board/get/getBoard";
import { fetchBookmarkCount } from "@/services/bookmark/bookmark";
import MyMobileProfile from "@/components/profile/MyMobileProfile";

const TABS = {
  ALL: "ALL",
  TICKET: "TICKET",
  OOTD: "OOTD",
  BADGE: "BADGE",
  BOOKMARK: "BOOKMARK",
  FOLLOWER: "FOLLOWER",
  FOLLOWING: "FOLLOWING",
};

const MyPage = () => {
  const accessToken = Cookies.get("accessToken");

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') { 
      const savedTab = sessionStorage.getItem("activeTab");
      return savedTab ? savedTab : TABS.TICKET;
    }
    return TABS.TICKET;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') { 
      sessionStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["member", accessToken],
    queryFn: () => MemberInfo(accessToken),
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    refetch();
  }, [accessToken, refetch]);

  const { data: totalOotdCount } = useQuery<number>(
    "ootdPostCount",
    fetchOotdPostCount,
    { enabled: !!accessToken }
  );

  const { data: totalBoardCount } = useQuery({
    queryKey: ["boardPostCount"],
    queryFn: () => getTotalBoardCount(),
    enabled: !!accessToken,
  });

  const { data: bookmarkCounts } = useQuery({
    queryKey: ["bookmarkCounts"],
    queryFn: fetchBookmarkCount,
    enabled: !!accessToken,
  });

  if (isLoading) {
    return <div></div>;
  }

  if (error) {
    return <div></div>;
  }

  const userData = data && data.result;
  const member = userData?.memberId;

  return (
    <>
      <Header />
      <div className="relative w-full h-[240px]">
        <Image
          src={userData?.blogTitleImgUrl || backgroundImg}
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="hidden sm-700:flex w-[75%] mx-auto p-4">
        <div className="w-[250px] mb-4">
          <UserInformation setActiveTab={setActiveTab} />
        </div>
        <div className="w-[100%] ml-[50px]">
        <h1 className="absolute ml-[20px] text-left top-[230px] text-white text-4xl font-bold">
          {userData && userData.blogName}
        </h1>
        <div className="absolute ml-[20px] text-left top-[260px] text-white text-xl font-normal font-['Pretendard']">
          {userData && userData.blogIntroduce}
        </div>
          <div className="flex justify-between mb-4 ml-4 text-2xl">
            <div className="flex space-x-4">
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${activeTab === TABS.TICKET ? "bg-[#ffe3ea] border-2 border-[#fa3463]" : "border border-[#cfcfcf]"}`}
                onClick={() => setActiveTab(TABS.TICKET)}
              >
                <span
                  className={activeTab === TABS.TICKET ? "text-[#fa3463]" : ""}
                >
                  티켓
                </span>
                <span className="text-[#fa3463] ml-1">{totalBoardCount}</span>
              </button>
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${activeTab === TABS.OOTD ? "bg-[#ffe3ea] border-2 border-[#fa3463]" : "border border-[#cfcfcf]"}`}
                onClick={() => setActiveTab(TABS.OOTD)}
              >
                <span
                  className={activeTab === TABS.OOTD ? "text-[#fa3463]" : ""}
                >
                  OOTD
                </span>
                <span className="text-[#fa3463] ml-1">{totalOotdCount}</span>
              </button>
              {/* <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${activeTab === TABS.BADGE ? "bg-[#ffe3ea] border-2 border-[#fa3463]" : "border border-[#cfcfcf]"}`}
                onClick={() => setActiveTab(TABS.BADGE)}
              >
                <span
                  className={activeTab === TABS.BADGE ? "text-[#fa3463]" : ""}
                >
                  뱃지
                </span>
                <span className="text-[#fa3463] ml-1">{totalOotdCount}</span>
              </button> */}
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${activeTab === TABS.BOOKMARK ? "bg-[#ffe3ea] border-2 border-[#fa3463]" : "border border-[#cfcfcf]"}`}
                onClick={() => setActiveTab(TABS.BOOKMARK)}
              >
                <span
                  className={
                    activeTab === TABS.BOOKMARK ? "text-[#fa3463]" : ""
                  }
                >
                  북마크
                </span>
                <span className="text-[#fa3463] ml-1">{bookmarkCounts?.totalCount}</span>
              </button>
            </div>
          </div>
          <hr className="mb-4 w-full h-[1px]" />

          <div className="w-full ml-4">
            {activeTab === TABS.ALL && (
              <>
                <MyTicket totalBoardCount={totalBoardCount} />
                <MyOotd userInfo={userData} />
                <MyBadge />
                <MyBookmark />
              </>
            )}
            {activeTab === TABS.TICKET && (
              <MyTicket totalBoardCount={totalBoardCount} />
            )}
            {activeTab === TABS.OOTD && <MyOotd userInfo={userData} />}
            {activeTab === TABS.BADGE && <MyBadge />}
            {activeTab === TABS.BOOKMARK && <MyBookmark />}
            {activeTab === TABS.FOLLOWER && (
              <FollowList memberId={member} type="follower" />
            )}
            {activeTab === TABS.FOLLOWING && (
              <FollowList memberId={member} type="following" />
            )}
          </div>
        </div>
      </div>

      <div className="w-full mx-auto mb-[90px] sm-700:hidden">
        <div className="hidden sm-700:relative z-[9999]">
          <div className="absolute top-[-300px] left-1/2 transform -translate-x-1/2 w-[200px] h-[300px] px-8 py-4 flex flex-col items-center">
            <h1 className="text-white text-4xl font-bold mt-[20px]">
              {userData && userData.blogName}
            </h1>
          </div>
        </div>
        <MyMobileProfile setActiveTab={setActiveTab}/>
        <div className="flex w-[100%] justify-center my-4 text-2xl gap-10">
            <div className="flex flex-col space-x-4">
              <div className="flex flex-row gap-10">
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${
                  activeTab === TABS.TICKET
                    ? "bg-[#ffe3ea] border-2 border-[#fa3463]"
                    : "border border-[#cfcfcf]"
                }`}
                onClick={() => setActiveTab(TABS.TICKET)}
              >
                <span
                  className={activeTab === TABS.TICKET ? "text-[#fa3463]" : ""}
                >
                  티켓
                </span>
                <span className="text-[#fa3463] ml-1">{totalBoardCount}</span>
              </button>
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${
                  activeTab === TABS.OOTD
                    ? "bg-[#ffe3ea] border-2 border-[#fa3463]"
                    : "border border-[#cfcfcf]"
                }`}
                onClick={() => setActiveTab(TABS.OOTD)}
              >
                <span
                  className={activeTab === TABS.OOTD ? "text-[#fa3463]" : ""}
                >
                  OOTD
                </span>
                 <span className="text-[#fa3463] ml-1">{totalOotdCount}</span>
              </button>
              
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${
                  activeTab === TABS.BOOKMARK
                    ? "bg-[#ffe3ea] border-2 border-[#fa3463]"
                    : "border border-[#cfcfcf]"
                }`}
                onClick={() => setActiveTab(TABS.BOOKMARK)}
              >
                <span
                  className={activeTab === TABS.BOOKMARK ? "text-[#fa3463]" : ""}
                >
                  북마크
                </span>
                 <span className="text-[#fa3463] ml-1">{bookmarkCounts?.totalCount}</span>
              </button>
              {/* <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${
                  activeTab === TABS.BADGE
                    ? "bg-[#ffe3ea] border-2 border-[#fa3463]"
                    : "border border-[#cfcfcf]"
                }`}
                onClick={() => setActiveTab(TABS.BADGE)}
              >
                <span
                  className={activeTab === TABS.BADGE ? "text-[#fa3463]" : ""}
                >
                  뱃지
                </span>
              </button> */}
              </div>
            </div>
          </div>
          <div className="w-full mx-auto mt-8">
          <div className="w-[90%] mx-auto">
            {activeTab === TABS.TICKET && (
              <MyTicket totalBoardCount={totalBoardCount} />
            )}
            {activeTab === TABS.OOTD && <MyOotd userInfo={userData} />}
            {activeTab === TABS.BADGE && <MyBadge />}
            {activeTab === TABS.BOOKMARK && <MyBookmark />}
            {activeTab === TABS.FOLLOWER && (
               <FollowList memberId={member} type="follower" />
            )}
            {activeTab === TABS.FOLLOWING && (
              <FollowList memberId={member} type="following" />
            )}
          </div>
          </div>
      </div>
    </>
  );
};

export default MyPage;
