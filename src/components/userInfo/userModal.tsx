import React from "react";
import Cookies from "js-cookie";
import { UserModalProps } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";

import Image from "next/image";
import NaverLogo from "../../../public/NaverLogo1.svg";
import KakaoLogo from "../../../public/KakaoLogo.svg";
import GoogleLogo from "../../../public/GoogleLogo.svg";
import { useUserStore } from "@/store/useUserStore";
import Swal from "sweetalert2";

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
  const { resetUserInfo } = useUserStore(); 

  const handleMyPage = () => {
    onClose();
    router.push("/mypage");
  };

  const handleLogoutClick = async () => {
    const result = await Swal.fire({
      title: '정말 로그아웃 하시겠습니까?',
      icon: 'warning',
      iconColor: '#FB3463',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니오',
      confirmButtonColor: '#FB3463',
      customClass: {
        popup: 'swal-custom-popup custom-swal-zindex', // custom-swal-zindex 클래스 추가
        icon: 'swal-custom-icon',
      },
    });
  
    if (result.isConfirmed) {
      try {
        // 로그아웃 처리
        Cookies.remove("accessToken");
        resetUserInfo();
  
        const successResult = await Swal.fire({
          icon: 'success',
          title: '성공적으로 로그아웃되었습니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463',
          customClass: {
            popup: 'swal-custom-popup',
            icon: 'swal-custom-icon',
          },
        });
    
        // 확인 버튼을 눌렀을 때만 리다이렉트
        if (successResult.isConfirmed) {
          onClose();
          router.push("/login");
        }
        
      } catch (error) {
        console.error("로그아웃 중 오류 발생:", error);
        await Swal.fire(
          '오류 발생',
          '로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.',
          'error'
        );
      }
    }
  };
  if (!isOpen || !userInfo) return null;

  return (
    <div className="relative w-[24rem] bg-white rounded-lg shadow z-50" style={style}>
  <div className="px-[2rem] pt-[1rem] pb-[1rem]">
    <div className="flex-col justify-center items-start gap-3 inline-flex">
      <div className="self-stretch justify-start items-center inline-flex gap-12 max-w-[170px]">
        <div className="flex-col justify-start items-start gap-2 inline-flex">
          {/* 닉네임에 max-width 설정 및 줄바꿈 처리 */}
          <div className="text-zinc-800 text-2xl font-bold font-Pretendard break-words" style={{ overflowWrap: 'break-word' }}>
            {userInfo.nickName}
          </div>
          <div className="flex-col justify-start items-start gap-2 flex">
            <div className="text-neutral-400 text-xl font-normal font-Pretendard max-w-[170px] overflow-hidden whitespace-nowrap text-ellipsis">
              {userInfo.email}
            </div>
            <div className="justify-start items-center gap-[9px] inline-flex">
              <div className="justify-start items-start gap-1 flex">
                <div className="text-center text-neutral-400 font-normal font-Pretendard">
                  팔로워 {userData?.followerCnt}
                </div>
                <div className="text-center text-neutral-500 font-semibold font-Pretendard"></div>
              </div>
              <div className="justify-start items-start gap-1 flex">
                <div className="text-center text-neutral-400 font-normal font-Pretendard">
                  팔로잉 {userData?.followingCnt}
                </div>
                <div className="text-center text-neutral-500 font-semibold font-Pretendard"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 소셜 로그인 아이콘을 절대적으로 위치 고정 */}
        <div className="absolute top-5 right-5">
          {userData?.socialType === "naver" && (
            <Image
              src={NaverLogo}
              alt="Naver Logo"
              width={46}
              height={46}
            />
          )}
          {userData?.socialType === "kakao" && (
            <Image
              src={KakaoLogo}
              alt="Kakao Logo"
              width={46}
              height={46}
            />
          )}
          {userData?.socialType === "google" && (
            <Image
              src={GoogleLogo}
              alt="Google Logo"
              width={46}
              height={46}
            />
          )}
        </div>
      </div>
      <div>
        <span className="text-neutral-500 text-lg font-normal font-Pretendard cursor-pointer" onClick={handleMyPage}>
          마이페이지
        </span>
        <span className="text-rose-500 text-lg font-normal font-Pretendard cursor-pointer ml-[10px]" onClick={handleLogoutClick}>
          로그아웃
        </span>
      </div>
    </div>
  </div>
  <hr className="border-CFCFCF mb-[1px]" />
  <div className="pt-[1rem] px-[2rem] pb-[1rem]">
    <div className="flex-col justify-center items-start inline-flex w-full">
      <div className="text-zinc-800 text-2xl font-bold font-Pretendard">
        {userInfo.blogName}
      </div>
      <div className="text-neutral-400 text-lg font-normal font-Pretendard pt-[2px]">
        {userInfo.blogIntroduce}
      </div>
    </div>
  </div>
</div>
  );
};

export default UserModal;
