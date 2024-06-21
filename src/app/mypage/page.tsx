'use client'

import React from "react";
import Header from "@/components/shared/header/Header";
import UserInformation from "@/components/profile/UserInformation";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import MyTicket from "@/components/profile/MyTicket";
import MyOotd from "@/components/profile/MyOotd";
import MyBadge from "@/components/profile/MyBadge";
import MyBookmark from "@/components/profile/MyBookmark";

const MyPage = () => {
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user information</div>;

  return (
    <>
      <Header />
      <UserInformation userData={memberData.result} />
      <div className="flex justify-center mt-4 space-x-4">
        <MyTicket />
        <MyOotd />
        <MyBadge />
        <MyBookmark />
      </div>
    </>
  );
};

export default MyPage;
