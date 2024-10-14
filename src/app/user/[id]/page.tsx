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
import backgroundImg from "../../../../public/DefaultBlogImg.svg";
import {
  fetchUserProfile,
  getUserTotalOotdCount,
} from "@/services/ootd.ts/ootdGet";
import FollowList from "@/components/profile/FollowList";
import { getUserTotalBoardCount } from "@/services/board/get/getBoard";
import UserMobileProfile from "@/components/user/UserMobileProfile";

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
  // console.log("id param", decodedId);
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTab = sessionStorage.getItem(`activeTab_${decodedId}`);
      return savedTab ? savedTab : TABS.TICKET;
    }
    return TABS.TICKET;
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

  // console.log("유저아이디", decodedId);
  // console.log("데이터", data);

  const emailData = data && data.result.email;

  const { data: userBoardCount } = useQuery({
    queryKey: ["userBoardCount", decodedId],
    queryFn: () => getUserTotalBoardCount(decodedId),
    enabled: !!data,
  });

  const { data: userOotdCount } = useQuery({
    queryKey: ["userOotdCount", decodedId],
    queryFn: () => getUserTotalOotdCount(decodedId),
    enabled: !!data,
  });

  useEffect(() => {
    if (decodedId) {
      refetch();
    }
  }, [decodedId, refetch]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`activeTab_${decodedId}`, activeTab);
    }
  }, [activeTab, id]);

  if (isLoading) {
    return null;
  }

  if (error) {
    return null;
  }

  const userData = data && data.result;
  // console.log('유저데이터', userData);
  const memberEmail = userData?.email;
  const userBlogImg = userData?.blogTitleImgUrl;

  // console.log(userBoardCount)
  return (
    <>
      {/* <Header /> */}
      <div className="relative w-full h-[240px]">
        <Image
          src={userBlogImg || backgroundImg}
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-10 z-10" />
      </div>
      <div className="hidden sm-700:flex w-[66%] mx-auto p-4 z-20">
        <div className="w-[250px] mb-4">
          <UserProfile memberId={decodedId} setActiveTab={setActiveTab} />
        </div>
        <div className="w-[100%] ml-[50px]">

          <h1 className="absolute ml-[20px] text-left top-[230px] text-white text-4xl font-bold">
            {userData && userData.blogName}
          </h1>
          <div className="absolute ml-[20px] text-left top-[270px] text-white text-xl font-normal font-['Pretendard']">
            {userData && userData.blogIntroduce}
          </div>

          <div className="flex justify-between mb-4 ml-4 text-2xl">
            <div className="flex space-x-4">
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${activeTab === TABS.TICKET
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
                <span className="text-[#fa3463] ml-1">{userBoardCount}</span>
              </button>
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${activeTab === TABS.OOTD
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
                <span className="text-[#fa3463] ml-1">{userOotdCount}</span>
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
              {/* <button
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
              </button> */}
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

      <div className="w-full mx-auto mb-[90px] sm-700:hidden">
        <div className="hidden sm-700:relative z-[9999]">
          <div className="absolute top-[-300px] left-1/2 transform -translate-x-1/2 w-[200px] h-[300px] px-8 py-4 flex flex-col items-center">
            <h1 className="text-white text-4xl font-bold mt-[20px]">
              {userData && userData.blogName}
            </h1>
          </div>
        </div>
        <UserMobileProfile memberId={decodedId} setActiveTab={setActiveTab} />
        <div className="flex w-[100%] justify-center my-4 text-2xl gap-10">
          <div className="flex flex-col space-x-4">
            <div className="flex flex-row gap-10">
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${activeTab === TABS.TICKET
                  ? "bg-[#ffe3ea] border-2 border-[#fa3463]"
                  : "border border-[#cfcfcf]"
                  }`}
                onClick={() => setActiveTab(TABS.TICKET)}
              >
                <span
                  className={activeTab === TABS.TICKET ? "text-[#fa3463]" : ""}
                >
                  티켓
                  <span className="text-[#fa3463] ml-1">{userBoardCount}</span>
                </span>
              </button>
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${activeTab === TABS.OOTD
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
                <span className="text-[#fa3463] ml-1">{userOotdCount}</span>
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
