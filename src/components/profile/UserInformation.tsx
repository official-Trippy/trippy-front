import React from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

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

  const { data, error, isLoading } = useQuery({
    queryKey: ["member", accessToken],
    queryFn: () => MemberInfo(accessToken),
    onError: (error) => {
      console.error(error);
    },
  });

  const handleEditProfile = () => {
    router.push("/editProfile");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const userData = data.result;

  return (
    <div className="w-full flex flex-col relative">
      <div className="w-[80%]">
        <div className="absolute top-[-150px] w-[200px] h-[300px] bg-white px-8 py-4 rounded-lg shadow-lg flex flex-col items-center">
          <div className="relative w-40 h-40 rounded-full overflow-hidden my-4">
            <Image
              src={userData.profileImageUrl}
              alt="Profile"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <h1 className="text-4xl font-bold mt-[10px]">{userData.nickName}</h1>
          <span className="text-xl text-gray-600 mt-[5px]">
            {userData.email}
          </span>
          <div className="mt-[10px] flex px-4">
            <span
              className="text-sm text-gray-600 cursor-pointer"
              onClick={() => setActiveTab(TABS.FOLLOWER)}
            >
              팔로워 {userData.followerCnt}
            </span>
            <span className="text-sm text-gray-600">&ensp;|&ensp;</span>
            <span
              className="text-sm text-gray-600 cursor-pointer"
              onClick={() => setActiveTab(TABS.FOLLOWING)}
            >
              팔로윙 {userData.followingCnt}
            </span>
          </div>
          <button
            className="mt-[20px] pl-[20px] pr-[20px] py-2 bg-neutral-100 rounded-lg justify-center items-center inline-flex"
            onClick={handleEditProfile}
          >
            내 정보 수정
          </button>
          <span className="mt-[10px] text-sm text-gray-600">
            {userData.blogIntroduce}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
