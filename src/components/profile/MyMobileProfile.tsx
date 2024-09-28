import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import DefaultImage from '../../../public/defaultImage.svg';
import ImageModal from "@/utils/ImageModal"; // ImageModal 임포트

const TABS = {
  ALL: "ALL",
  TICKET: "TICKET",
  OOTD: "OOTD",
  BADGE: "BADGE",
  BOOKMARK: "BOOKMARK",
  FOLLOWER: "FOLLOWER",
  FOLLOWING: "FOLLOWING",
};

const MyMobileProfile: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const accessToken = Cookies.get("accessToken");
  const router = useRouter();

  const { data, error, isLoading } = useQuery({
    queryKey: ["member", accessToken],
    queryFn: () => MemberInfo(accessToken),
    onError: (error) => {
      console.error(error);
    },
    enabled: !!accessToken, // accessToken이 있을 때만 쿼리 실행
  });

  // 이미지 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true); // 이미지 클릭 시 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, [accessToken, router]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred.</div>;

  const userData = data?.result;

  return (
    <div className="w-full mx-auto flex flex-col items-center relative z-[9989]">
      <div className="relative w-full">
        <div className="absolute top-[-240px] left-1/2 transform -translate-x-1/2 w-full h-[240px] px-8 py-4 flex flex-col items-center">
          <h1 className="text-4xl text-white font-bold mt-2">{userData?.blogName}</h1>
          <div className="relative my-4">
            <Image
              src={userData?.profileImageUrl || DefaultImage}
              alt="Profile"
              width={48}
              height={48}
              className="cursor-pointer rounded-full object-cover" // 커서 포인터 추가
              onClick={handleImageClick} // 이미지 클릭 시 모달 열림
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
              }}
            />
          </div>
          <h1 className="text-2xl text-white font-bold">{userData?.nickName}</h1>
          <span className="text-xl text-white text-gray-600 mt-[2px]">{userData?.blogIntroduce}</span>
          <div className="flex items-center mt-[10px]">
            <button
              className="bg-[#FB3463] text-white text-base font-semibold px-[2rem] py-[0.5rem] rounded-[8px]"
              onClick={() => router.push("/editProfile")}
            >
              내 정보 수정
            </button>
          </div>
          <div className="flex px-4 gap-12 text-center mt-2">
            <div className="flex flex-col flex-1">
              <span
                className="text-white text-base cursor-pointer"
                onClick={() => setActiveTab(TABS.FOLLOWER)}
              >
                팔로워
              </span>
              <span className="text-white"> {userData?.followerCnt}</span>
            </div>
            <div className="flex flex-col flex-1">
              <span
                className="text-base text-white cursor-pointer"
                onClick={() => setActiveTab(TABS.FOLLOWING)}
              >
                팔로잉
              </span>
              <span className="text-white"> {userData?.followingCnt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 모달 추가 */}
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={userData?.profileImageUrl || DefaultImage}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default MyMobileProfile;