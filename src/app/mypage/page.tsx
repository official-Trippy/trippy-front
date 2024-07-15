'use client';

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
import Image from "next/image";
import backgroundImg from "../../../public/DefaultBackground.svg";

const TABS = {
  ALL: 'ALL',
  TICKET: 'TICKET',
  OOTD: 'OOTD',
  BADGE: 'BADGE',
  BOOKMARK: 'BOOKMARK',
};

const MyPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.ALL);
  const accessToken = Cookies.get("accessToken");

  const { data: userData, error, isLoading, refetch } = useQuery(["member", accessToken], () => MemberInfo(accessToken), {
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    refetch(); 
  }, [accessToken, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <>
      <Header />
      <div className="relative w-full h-[300px]">
        <Image src={backgroundImg} alt="Background" layout="fill" objectFit="cover" />
      </div>
      <div className="w-[80%] mx-auto">
        <h1 className="w-[80%] absolute ml-auto text-right top-[320px] text-white text-4xl font-bold">{userData && userData.blogName}</h1>
      </div>
      <div className="w-[80%] mx-auto flex p-4">
        <div className="w-[250px] mb-4">
          <UserInformation />
        </div>
        <div className="w-[100%] ml-[50px]">
          <div className="flex space-x-4 mb-4 ml-4 text-2xl">
            <button
              className={`pr-8 py-2 ${activeTab === TABS.ALL ? "text-rose-500 font-bold" : "bg-white"}`}
              onClick={() => setActiveTab(TABS.ALL)}
            >
              모두 보기
            </button>
            <button
              className={`pr-8 py-2 ${activeTab === TABS.TICKET ? "text-rose-500 font-bold" : "bg-white"}`}
              onClick={() => setActiveTab(TABS.TICKET)}
            >
              티켓
            </button>
            <button
              className={`pr-8 py-2 ${activeTab === TABS.OOTD ? "text-rose-500 font-bold" : "bg-white"}`}
              onClick={() => setActiveTab(TABS.OOTD)}
            >
              OOTD
            </button>
            <button
              className={`pr-8 py-2 ${activeTab === TABS.BADGE ? "text-rose-500 font-bold" : "bg-white"}`}
              onClick={() => setActiveTab(TABS.BADGE)}
            >
              뱃지
            </button>
            <button
              className={`pr-8 py-2 ${activeTab === TABS.BOOKMARK ? "text-rose-500 font-bold" : "bg-white"}`}
              onClick={() => setActiveTab(TABS.BOOKMARK)}
            >
              북마크
            </button>
          </div>
          <hr className="mb-4 w-full h-[1px]" />

          <div className="w-full ml-4">
            {activeTab === TABS.ALL && (
              <>
                <MyTicket />
                <MyOotd userInfo={userData} />
                <MyBadge />
                <MyBookmark />
              </>
            )}
            {activeTab === TABS.TICKET && <MyTicket />}
            {activeTab === TABS.OOTD && <MyOotd userInfo={userData} />}
            {activeTab === TABS.BADGE && <MyBadge />}
            {activeTab === TABS.BOOKMARK && <MyBookmark />}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPage;
