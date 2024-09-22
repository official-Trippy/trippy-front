import React, { useEffect } from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import DefaultImage from '../../../public/defaultImage.svg';

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

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken, router]);

  // 로딩 중일 때와 에러 발생 시 사용자에게 피드백 제공
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred.</div>;

  const userData = data?.result;

  return (
    <div className="w-full mx-auto flex flex-col items-center relative z-[9999]">
      <div className="relative w-full">
        <div className="absolute top-[-240px] left-1/2 transform -translate-x-1/2 w-full h-[240px] px-8 py-4 flex flex-col items-center">
          <h1 className="text-4xl text-white font-bold mt-2">{userData?.blogName}</h1>
          <div className="relative my-4">
            <Image
              src={userData?.profileImageUrl || DefaultImage}
              alt="Profile"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl text-white font-bold">{userData?.nickName}</h1>
          <span className="text-xl text-white text-gray-600 mt-[2px]">{userData?.blogIntroduce}</span>
          <div className="flex items-center mt-[10px]">
            <button
              className="bg-[#FB3463] text-white text-base px-[2rem] py-[0.5rem] rounded-lg"
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
    </div>
  );
};

export default MyMobileProfile;
