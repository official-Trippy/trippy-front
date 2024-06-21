'use client'

import React, { useState } from "react";
import Header from "@/components/shared/header/Header";
import UserInformation from "@/components/profile/UserInformation";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import MyTicket from "@/components/profile/MyTicket";
import MyOotd from "@/components/profile/MyOotd";
import MyBadge from "@/components/profile/MyBadge";
import MyBookmark from "@/components/profile/MyBookmark";

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

  const {
    data: memberData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["member", accessToken],
    queryFn: () => MemberInfo(accessToken),
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <>
      <Header />
      <UserInformation />
      
      <div className="w-[65%] ml-[450px] flex flex-start space-x-4 my-[20px] text-2xl">
        <button
          className={`pr-4 py-2 ${activeTab === TABS.ALL ? "text-rose-500 font-blod" : "bg-white"}`}
          onClick={() => setActiveTab(TABS.ALL)}
        >
          모두 보기
        </button>
        <button
          className={`px-4 py-2 ${activeTab === TABS.TICKET ? "text-rose-500 font-blod" : "bg-white"}`}
          onClick={() => setActiveTab(TABS.TICKET)}
        >
          티켓
        </button>
        <button
          className={`px-4 py-2 ${activeTab === TABS.OOTD ? "text-rose-500 font-blod" : "bg-white"}`}
          onClick={() => setActiveTab(TABS.OOTD)}
        >
          OOTD
        </button>
        <button
          className={`px-4 py-2 ${activeTab === TABS.BADGE ? "text-rose-500 font-blod" : "bg-white"}`}
          onClick={() => setActiveTab(TABS.BADGE)}
        >
          뱃지
        </button>
        <button
          className={`px-4 py-2 ${activeTab === TABS.BOOKMARK ? "text-rose-500 font-blod" : "bg-white"}`}
          onClick={() => setActiveTab(TABS.BOOKMARK)}
        >
          북마크
        </button>
      </div>
      <hr className="mb-[20px] w-[70%] ml-[420px] h-[1px]"></hr>

      <div className="w-[65%] ml-[450px] flex flex-col justify-center mt-4">
        {activeTab === TABS.ALL && (
          <>
            <MyTicket />
            <MyOotd />
            <MyBadge />
            <MyBookmark />
          </>
        )}
        {activeTab === TABS.TICKET && <MyTicket />}
        {activeTab === TABS.OOTD && <MyOotd />}
        {activeTab === TABS.BADGE && <MyBadge />}
        {activeTab === TABS.BOOKMARK && <MyBookmark />}
      </div>
    </>
  );
};

export default MyPage;
