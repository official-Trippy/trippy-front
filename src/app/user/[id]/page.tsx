"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Header from "@/components/shared/header/Header";
import UserProfile from "@/components/user/UserProfile";
import UserOotd from "@/components/user/UserOotd";
import UserTicket from "@/components/user/UserTicket";
import UserBadge from "@/components/user/UserBadge";
import UserBookmark from "@/components/user/UserBookmark";
import Image from "next/image";
import backgroundImg from "../../../../public/DefaultBackground.svg";
import { fetchUserProfile } from "@/services/ootd.ts/ootdGet";
import FollowList from "@/components/profile/FollowList";
import { getUserTotalBoardCount } from "@/services/board/get/getBoard";

const TABS = {
  TICKET: "TICKET",
  OOTD: "OOTD",
  BADGE: "BADGE",
  BOOKMARK: "BOOKMARK",
  FOLLOWER: "FOLLOWER",
  FOLLOWING: "FOLLOWING",
};

const UserPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const decodedId = decodeURIComponent(params.id);
  const [activeTab, setActiveTab] = useState(() => {

    const savedTab = sessionStorage.getItem(`activeTab_${decodedId}`);
    return savedTab ? savedTab : TABS.TICKET;
  });
  const [userMeberId, setUserMemberId] = useState("");

  useEffect(() => {
    const extractUserId = () => {
      const currentUrl = window.location.href;
      const urlObj = new URL(currentUrl);
      const pathname = urlObj.pathname;
      const pathSegments = pathname.split("/");
      const userId = pathSegments[pathSegments.length - 1];
      setUserMemberId(userId);
    };

    extractUserId();
  }, []);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["userProfile", decodedId],
    queryFn: () => fetchUserProfile(decodedId),
    onError: (error) => {
      console.error(error);
    },
  });

  console.log('유저아이디', decodedId);
  console.log('데이터', data);

  const emailData = data && data.result.email;
  const { data: userBoardCount } = useQuery({
    queryKey: ["userBoardCount", decodedId],
    queryFn: () => getUserTotalBoardCount(decodedId),
    enabled: !!data,
  });

  useEffect(() => {
    if (decodedId) {
      refetch();
    }
  }, [decodedId, refetch]);

  useEffect(() => {
  
    sessionStorage.setItem(`activeTab_${decodedId}`, activeTab);
  }, [activeTab, id]);

  if (isLoading) {
    return null;
  }

  if (error) {
    return null;
  }

  const userData = data && data.result;
  const memberEmail = userData?.email;

  return (
    <>
      <Header />
      <div className="relative w-full h-[300px]">
        <Image
          src={backgroundImg}
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="w-[66%] mx-auto">
      <h1 className="w-[66%] absolute ml-[240px] text-left top-[320px] text-white text-4xl font-bold">
          {userData && userData.blogName}
        </h1>
        <div className="w-[66%] absolute ml-[240px] text-left top-[350px] text-white text-xl font-normal font-['Pretendard']">
          {userData && userData.blogIntroduce}
        </div>
      </div>
      <div className="w-[66%] mx-auto flex p-4">
        <div className="w-[250px] mb-4">
          <UserProfile memberId={decodedId} setActiveTab={setActiveTab} />
        </div>
        <div className="w-[100%] ml-[50px]">
          <div className="flex justify-between mb-4 ml-4 text-2xl">
            <div className="flex space-x-4">
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
              </button>
              <button
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
                  className={
                    activeTab === TABS.BOOKMARK ? "text-[#fa3463]" : ""
                  }
                >
                  북마크
                </span>
              </button>
            </div>
          </div>
          <hr className="mb-4 w-full h-[1px]" />

          <div className="w-full ml-4">
            {activeTab === TABS.TICKET && (
              <UserTicket
                userBoardCount={userBoardCount}
                memberEmail={decodedId}
              />
            )}
            {activeTab === TABS.OOTD && <UserOotd memberId={decodedId} />}
            {activeTab === TABS.BADGE && <UserBadge />}
            {activeTab === TABS.BOOKMARK && <UserBookmark />}
            {activeTab === TABS.FOLLOWER && (
              <FollowList memberId={userMeberId} type="follower" />
            )}
            {activeTab === TABS.FOLLOWING && (
              <FollowList memberId={userMeberId} type="following" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
