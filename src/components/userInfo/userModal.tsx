import React from "react";
import Cookies from "js-cookie";
import { UserModalProps } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";

import Image from "next/image";
import NaverLogo from "../../../public/NaverLogo.png";
import KakaoLogo from "../../../public/KakaoLogo.svg";
import GoogleLogo from "../../../public/GoogleLogo.svg";
import { useUserStore } from "@/store/useUserStore";

const UserModal: React.FC<
  UserModalProps & {
    style: React.CSSProperties;
    handleLogout: () => Promise<void>;
  }
> = ({ isOpen, onClose, userInfo, style, handleLogout }) => {
  const accessToken = Cookies.get("accessToken");

  const { data, error, isLoading } = useQuery({
    queryKey: ["member", accessToken],
    queryFn: () => MemberInfo(accessToken),
    onError: (error) => {
      console.error(error);
    },
  });

  const userData = data?.result;
  console.log("user Data", userData);
  const router = useRouter();
  const { resetUserInfo } = useUserStore(); // 전역 상태 초기화 함수 가져오기

  const handleMyPage = () => {
    router.push("/mypage");
  };

  // 로그아웃 로직
  const handleLogoutClick = async () => {
    // 쿠키에서 accessToken 제거
    Cookies.remove("accessToken");

    // 전역 상태 초기화
    resetUserInfo();

    // 로그아웃 후 원하는 페이지로 리디렉션 (예: 로그인 페이지)
    router.push("/login");
  };

  
  if (!isOpen || !userInfo) return null;

  return (
    <div
      className="w-[32rem] h-[25.4rem] relative bg-white rounded-lg shadow z-[50]"
      style={style}
    >
      <div className="px-[2rem] pt-[2rem] py-[1rem]">
        <div className="flex-col justify-center items-start gap-3 inline-flex">
          <div className="self-stretch justify-start items-center gap-20 inline-flex">
            <div className="flex-col justify-start items-start gap-2 inline-flex">
              <div className="text-zinc-800 text-4xl font-bold font-Pretendard">
                {userInfo.nickName}
              </div>
              <div className="flex-col justify-start items-start gap-1 flex">
                <div className="text-neutral-400 text-2xl font-normal font-Pretendard">
                  {userInfo.email}
                </div>
                <div className="justify-start items-center gap-[9px] inline-flex">
                  <div className="justify-start items-start gap-1 flex">
                    <div className="text-center text-neutral-400 text-2xl font-normal font-Pretendard">
                      팔로워 {userData?.followerCnt}
                    </div>
                    <div className="text-center text-neutral-500 text-2xl font-semibold font-Pretendard"></div>
                  </div>
                  <div className="justify-start items-start gap-1 flex">
                    <div className="text-center text-neutral-400 text-2xl font-normal font-Pretendard">
                      팔로잉 {userData?.followingCnt}
                    </div>
                    <div className="text-center text-neutral-500 text-2xl font-semibold font-Pretendard"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[46.61px] h-[46.61px]">
              {userInfo.socialType === "naver" && (
                <Image
                  src={NaverLogo}
                  alt="Naver Logo"
                  width={46}
                  height={46}
                />
              )}
              {userInfo.socialType === "kakao" && (
                <Image
                  src={NaverLogo}
                  alt="Kakao Logo"
                  width={46}
                  height={46}
                />
              )}
              {userInfo.socialType === "google" && (
                <Image
                  src={NaverLogo}
                  alt="Google Logo"
                  width={46}
                  height={46}
                />
              )}
            </div>
          </div>
          <div className="mt-[0.8rem]">
            <span
              className="text-neutral-500 text-2xl font-normal font-Pretendard cursor-pointer"
              onClick={handleMyPage}
            >
              마이페이지
            </span>
            <span
              className="text-rose-500 text-2xl font-normal font-Pretendard cursor-pointer ml-[10px]"
              onClick={handleLogoutClick}
            >
              로그아웃
            </span>
          </div>
        </div>
      </div>
      <hr className="border-CFCFCF mb-[1px]" />
      <div className="pt-[1rem] px-[2rem]">
        <div className="flex-col justify-center items-start gap-1 inline-flex w-full">
          <div className="text-zinc-800 text-4xl font-bold font-Pretendard">
            {userInfo.blogName}
          </div>
          <div className="mt-[0.4rem] text-neutral-400 text-2xl font-normal font-Pretendard p-1">
            {userInfo.blogIntroduce}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
