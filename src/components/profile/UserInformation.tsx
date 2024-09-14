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
    <div className="w-full flex flex-col relative">
      <div className="w-[80%]">
        <div className="absolute top-[-150px] w-[200px] h-auto bg-white px-8 py-6 rounded-lg shadow-lg flex flex-col items-center">
          <div className="relative my-4">
            <Image
              src={userData?.profileImageUrl}
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
          <h1 className="text-4xl font-bold mt-[10px]">{userData?.nickName}</h1>
          <span
            style={{
              overflowWrap: 'break-word',
              wordBreak: 'break-word'
            }}
            className="text-xl text-gray-600 mt-[5px] text-center"
          >
            {userData?.email}
          </span>
          <div className="mt-[10px] flex px-4">
            <span className="text-base text-[#9d9d9d] cursor-pointer" onClick={() => setActiveTab(TABS.FOLLOWER)}>
              팔로워 
              <span className="text-[#6b6b6b]"> {userData?.followerCnt}</span>
            </span>
            <span className="text-base text-[#9d9d9d]">&ensp;|&ensp;</span>
            <span className="text-base text-[#9d9d9d] cursor-pointer" onClick={() => setActiveTab(TABS.FOLLOWING)}>
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
    </div>
  );
};

export default UserInformation;
