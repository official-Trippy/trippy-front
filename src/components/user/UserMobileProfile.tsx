import React, { useState } from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import { fetchUserProfile } from "@/services/ootd.ts/ootdGet";
import { UserProfileResponse } from "@/types/ootd";
import { useUserStore } from "@/store/useUserStore";
import FollowButton from "../followControl/followButton";
import DefaultImage from "../../../public/defaultImage.svg";;
import ImageModal from "@/utils/ImageModal";

const TABS = {
  FOLLOWER: "FOLLOWER",
  FOLLOWING: "FOLLOWING",
};

interface UserProfileProps {
  memberId: string;
  setActiveTab: (tab: string) => void;
}

const UserMobileProfile: React.FC<UserProfileProps> = ({
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <div></div>;
  if (error) return <div></div>;
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
    <div className="w-full mx-auto flex flex-col items-center relative z-[9989]">
      <div className="relative w-full">
        <div className="absolute top-[-240px] left-1/2 transform -translate-x-1/2 w-full h-[240px] px-8 py-4 flex flex-col items-center">
          <h1 className="text-4xl text-white font-bold mt-2">{blogName}</h1>
          <div className="relative my-4">
            <Image
              src={profileImageUrl || DefaultImage}
              alt="Profile"
              width={48}
              height={48}
              onClick={handleImageClick} // 이미지 클릭 이벤트 추가
              className="cursor-pointer rounded-full"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
          <h1 className="text-2xl text-white font-bold">{nickName}</h1>
          <span className="text-xl text-white text-gray-600 mt-[2px]">
            {blogIntroduce}
          </span>
          <div className="flex items-center mt-[10px]">
            {data.result.email && userInfo?.memberId && (
              <FollowButton postMemberId={data.result.email} userMemberId={userInfo.memberId} />
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

      {/* 모달 컴포넌트 호출 */}
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={profileImageUrl || DefaultImage}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default UserMobileProfile;