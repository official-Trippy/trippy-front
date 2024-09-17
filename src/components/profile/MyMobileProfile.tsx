import React, { useEffect } from "react";
import Image from "next/image";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { doFollow } from "@/services/follow";

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
  });

  const handleEditProfile = () => {
    router.push("/editProfile");
  };

  if (isLoading) return <div></div>;
  if (error) return <div></div>;

  const userData = data?.result;

  useEffect(() => {
    if (!accessToken) {
      router.refresh();
      router.push('/login');
    }
  }, [router]);


  return (
    <div className="w-full mx-auto flex flex-col items-center relative z-[9999]">
      <div className="relative">
        <div className="absolute top-[-240px] left-1/2 transform -translate-x-1/2 w-[200px] h-[200px] px-8 py-4 flex flex-col items-center">
        <h1 className="text-4xl text-white font-bold mt-2">{userData?.blogName}</h1>
          <div className="relative my-4">
            <Image
              src={userData?.profileImageUrl}
              alt="Profile"
              width={80}
              height={80}
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <h1 className="text-2xl text-white font-bold">{userData?.nickName}</h1>
          <span className="text-xl text-white text-gray-600 mt-[2px]">{userData?.blogIntroduce}</span>
          {/* <span
            style={{
              overflowWrap: 'break-word',
              wordBreak: 'break-word'
            }}
            className="text-xl text-gray-600 mt-[5px] text-center"
          >
            {userData?.email}
          </span> */}
           <div className="flex items-center mt-[10px]">
            <button
            className="bg-[#FB3463] text-white text-base text-white px-[2rem] py-[0.5rem] rounded-lg"
            onClick={handleEditProfile}
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
          {/* <button
            className="w-full mt-[10px] pl-[20px] pr-[20px] py-[7px] text-base border border-[#cfcfcf] text-[#6b6b6b] rounded-2xl justify-center items-center inline-flex"
            onClick={handleEditProfile}
          >
            내 정보 수정
          </button> */}
          {/* <button
            className="mt-[20px] pl-[20px] pr-[20px] py-2 bg-neutral-100 rounded-lg justify-center items-center inline-flex"
            onClick={() => doFollow(userData?.memberId)}
          >
            팔로우
          </button> */}     
        </div>
      </div>
    </div>
  );
};

export default MyMobileProfile;
