import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import DefaultImage from "../../../public/defaultImage.svg";
import ImageModal from "@/utils/ImageModal";

const TABS = {
  ALL: "ALL",
  TICKET: "TICKET",
  OOTD: "OOTD",
  BADGE: "BADGE",
  BOOKMARK: "BOOKMARK",
  FOLLOWER: "FOLLOWER",
  FOLLOWING: "FOLLOWING",
};

const UserInformation: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab,
}) => {
  const accessToken = Cookies.get("accessToken");
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, [accessToken, router]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["member", accessToken],
    queryFn: () => MemberInfo(accessToken),
    onError: (error) => {
      console.error(error);
    },
    enabled: !!accessToken, // accessToken이 있을 때만 쿼리 실행
  });

  const handleEditProfile = () => {
    router.push("/editProfile");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true); // 이미지 클릭 시 모달 열기
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  if (isLoading) return <div></div>;
  if (error) return <div></div>;

  const userData = data?.result;

  return (
    <div className="w-full flex flex-col relative z-20">
      <div className="w-[80%]">
        <div className="absolute top-[-150px] w-[200px] h-auto bg-white px-8 py-6 rounded-lg shadow-lg flex flex-col items-center">
          <div className="relative my-4">
            <Image
              src={userData?.profileImageUrl || DefaultImage}
              alt="Profile"
              width={80}
              height={80}
              onClick={handleImageClick}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <h1 className="text-4xl font-bold mt-[10px] text-center">
            {userData?.nickName}
          </h1>
          <span
            style={{
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
            className="text-xl text-gray-600 mt-[5px] text-center"
          >
            {userData?.email}
          </span>
          <div className="mt-[10px] flex px-4">
            <span
              className="text-base text-[#9d9d9d] cursor-pointer"
              onClick={() => setActiveTab(TABS.FOLLOWER)}
            >
              팔로워
              <span className="text-[#6b6b6b]"> {userData?.followerCnt}</span>
            </span>
            <span className="text-base text-[#9d9d9d]">&ensp;|&ensp;</span>
            <span
              className="text-base text-[#9d9d9d] cursor-pointer"
              onClick={() => setActiveTab(TABS.FOLLOWING)}
            >
              팔로잉
              <span className="text-[#6b6b6b]"> {userData?.followingCnt}</span>
            </span>
          </div>
          <button
            className="w-full mt-[10px] pl-[20px] pr-[20px] py-[7px] text-base border border-[#cfcfcf] text-[#6b6b6b] rounded-2xl justify-center items-center inline-flex"
            onClick={handleEditProfile}
          >
            내 정보 수정
          </button>
          {/* <button
            className="mt-[20px] pl-[20px] pr-[20px] py-2 bg-neutral-100 rounded-lg justify-center items-center inline-flex"
            onClick={() => doFollow(userData?.memberId)}
          >
            팔로우
          </button> */}
        </div>
      </div>
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={userData?.profileImageUrl || DefaultImage}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default UserInformation;
