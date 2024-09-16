import React from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import { fetchUserProfile } from "@/services/ootd.ts/ootdGet";
import { UserProfileResponse } from "@/types/ootd";
import { useUserStore } from "@/store/useUserStore";
import FollowButton from "../followControl/followButton";

const TABS = {
  FOLLOWER: "FOLLOWER",
  FOLLOWING: "FOLLOWING",
};

interface UserProfileProps {
  memberId: string;
  setActiveTab: (tab: string) => void;
}

const UserMobileProfle: React.FC<UserProfileProps> = ({
  memberId,
  setActiveTab,
}) => {
  const { data, isLoading, error } = useQuery<UserProfileResponse>(
    ["userProfile", memberId],
    () => fetchUserProfile(memberId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
  const userInfo = useUserStore((state) => state.userInfo);
  

  const targetMemberId = data?.result?.email; 
  const userMemberId = userInfo?.memberId;
  console.log(targetMemberId);
  console.log(userMemberId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!data) return null;

  const {
    nickName,
    profileImageUrl,
    blogName,
    blogIntroduce,
    followerCnt,
    followingCnt,
    email,
  } = data.result;

  return (
<div className="w-full mx-auto flex flex-col items-center relative z-[9999]">
  <div className="relative">
    <div className="absolute top-[-240px] left-1/2 transform -translate-x-1/2 w-[200px] h-[200px] px-8 py-4 flex flex-col items-center">
    <h1 className="text-4xl text-white font-bold mt-2">{blogName}</h1>
      <div className="relative mt-4 mb-4">
        <Image
          src={profileImageUrl}
          alt="Profile"
          width={48}
          height={48}
          style={{
            width: "48px",
            height: "48px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </div>
      <h1 className="text-2xl text-white font-bold">{nickName}</h1>
      <span className="text-xl text-white text-gray-600 mt-[2px]">{blogIntroduce}</span>
      <div className="ml-auto flex items-center mt-[10px] mr-[50px]">
        {targetMemberId &&
          userMemberId && ( 
            <FollowButton
              postMemberId={targetMemberId}
              userMemberId={userMemberId}
            />
          )}
      </div>
      <div className="flex px-4 gap-12 text-center mt-2">
        <div className="flex flex-col flex-1">
          <span
            className="text-white text-base cursor-pointer"
            onClick={() => setActiveTab(TABS.FOLLOWER)}
          >
            팔로워 
          </span>
          <span className="text-white"> {followerCnt}</span>
        </div>
        <div className="flex flex-col flex-1">
          <span
            className="text-base text-white cursor-pointer"
            onClick={() => setActiveTab(TABS.FOLLOWING)}
          >
            팔로잉 
          </span>
          <span className="text-white"> {followingCnt}</span>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default UserMobileProfle;
