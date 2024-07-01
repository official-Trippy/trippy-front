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
import Image from "next/image";
import backgroundImg from "../../../public/DefaultBackground.svg";
import EditInfo from "@/components/profile/EditInfo";


const EditProfile = () => {

  return (
    <>
      <Header />
      <div className="relative w-full h-[300px]">
        <Image src={backgroundImg} alt="Background" layout="fill" objectFit="cover" />
      </div>
      <EditInfo/>
    </>
  );
};

export default EditProfile;
