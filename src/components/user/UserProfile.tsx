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

const UserProfile: React.FC<UserProfileProps> = ({
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

  const targetMemberId = data?.result?.email; // Ensure safe navigation
  const userMemberId = userInfo?.memberId;
  console.log(targetMemberId);
  console.log(userMemberId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!data) return null;

  const {
    nickName,
    profileImageUrl,
    blogIntroduce,
    followerCnt,
    followingCnt,
    email,
  } = data.result;

  return (
    <div className="w-full flex flex-col relative">
      <div className="w-[80%]">
        <div className="absolute top-[-150px] w-[200px] h-[300px] bg-white px-8 py-4 rounded-lg shadow-lg flex flex-col items-center">
          <div className="relative my-4">
            <Image
              src={profileImageUrl}
              alt="Profile"
              width={80}
              height={80}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <h1 className="text-4xl font-bold mt-[10px]">{nickName}</h1>
          <span className="text-xl text-gray-600 mt-[5px]">{email}</span>
          <div className="mt-[10px] flex px-4">
            <span
              className="text-sm text-gray-600 cursor-pointer"
              onClick={() => setActiveTab(TABS.FOLLOWER)}
            >
              팔로워 {followerCnt}
            </span>
            <span className="text-sm text-gray-600">&ensp;|&ensp;</span>
            <span
              className="text-sm text-gray-600 cursor-pointer"
              onClick={() => setActiveTab(TABS.FOLLOWING)}
            >
              팔로잉 {followingCnt}
            </span>
          </div>
          <div className="ml-auto flex items-center mt-[10px] mr-[4rem]">
            {targetMemberId &&
              userMemberId && ( // Check both IDs are available
                <FollowButton
                  postMemberId={targetMemberId}
                  userMemberId={userMemberId}
                />
              )}
          </div>

          <span className="mt-[10px] text-sm text-gray-600">
            {blogIntroduce}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
