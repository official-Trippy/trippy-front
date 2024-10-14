'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useUserStore } from '@/store/useUserStore';
import HomeIcon from '../../../../public/mobile_home_inactive.svg';
import HomeActiveIcon from '../../../../public/mobile_home_active.svg';
import OotdIcon from '../../../../public/mobile_ootd_inactive.svg';
import OotdActiveIcon from '../../../../public/mobile_ootd_active.svg';
import EditorIcon from '../../../../public/mobile_editor_inactive.svg';
import EditorActiveIcon from '../../../../public/mobile_editor_active.svg';
import MyIcon from '../../../../public/mobile_my_inactive.svg';
import MyActiveIcon from '../../../../public/mobile_my_active.svg';
import postwriteImg from "@/dummy/postwrite.svg";
import TicketInactive from '../../../../public/Ticket3.svg';
import TicketActive from '../../../../public/Ticket2.svg';
import ootdWrite from "../../../../public/ootdWrite.svg"; 


const MobileFooter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useUserStore();
  const accessToken = Cookies.get('accessToken');
  const isGuest = userInfo?.role === 'GUEST';

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMyPageClick = () => {
    if (!accessToken) {
      router.push('/login');
    } else if (isGuest) {
      router.push('/login');
    } else {
      router.push('/mypage');
    }
  };

  const handleWriteClick = () => {
    if (!accessToken) {
      router.push('/login');
    } else if (isGuest) {
      router.push('/login');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePostClick = () => {
    router.push('/post');
    setIsModalOpen(false);
  };

  const handleOotdClick = () => {
    router.push('/write');
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="sm-700:hidden z-[9999] fixed bottom-0 py-[10px] flex items-center bg-black border-t border-gray100 bg-white w-full">
        <div
          onClick={() => router.push('/ootd')}
          className="flex-1 flex flex-col gap-1 items-center">
          <div>
            <Image
              src={pathname === '/ootd' ? OotdActiveIcon : OotdIcon}
              alt="OOTD"
              width={24}
              height={40}
            />
          </div>
        </div>
        <div
          onClick={() => router.push('/')}
          className="flex-1 flex flex-col gap-1 items-center">
          <div>
            <Image
              src={pathname ==='/' ? TicketActive : TicketInactive}
              alt="TICKET"
              width={28}
              height={40}
            />
          </div>
        </div>
        <div
          onClick={handleWriteClick}
          className="flex-1 flex flex-col gap-1 items-center">
          <div>
            <Image
              src={pathname.includes('/write') || pathname.includes('/post') ? EditorActiveIcon : EditorIcon}
              alt="글쓰기"
              width={28}
              height={40}
            />
          </div>
        </div>
        <div
          onClick={handleMyPageClick}
          className="flex-1 flex flex-col gap-1 items-center">
          <div>
            <Image
              src={pathname.includes('/mypage') ? MyActiveIcon : MyIcon}
              alt="마이페이지"
              width={24}
              height={40}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]" 
          onClick={handleModalClose} // 모달 외부를 클릭하면 닫기
        >
          <div 
            className="w-[300px] bg-white p-4 rounded-lg shadow-lg" 
            onClick={(e) => e.stopPropagation()} // 모달 컨텐츠 클릭 시 이벤트 전파 방지
          >
            <div className="flex flex-col gap-4">
              <div className="px-[1rem] pt-[1.4rem] rounded-lg border-b border-white cursor-pointer" onClick={handlePostClick}>
                <div className="hover:bg-gray-200 px-[1.3rem] py-[1.2rem]">
                  <div className="flex items-start">
                    <Image
                      className="mr-[1.7rem] mt-[0.5rem]"
                      src={postwriteImg}
                      width={24}
                      height={24}
                      alt=""
                    />
                    <div>
                      <h1 className="text-[1.6rem] font-medium text-neutral-900 dark:text-white ">블로그 티켓 글쓰기</h1>
                      <span className="text-[0.9rem] font-normal text-[#9D9D9D]">여행에서 겪었던 이야기를 기록해 보세요.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-[1rem] pb-[1.4rem] rounded-lg border-b border-white cursor-pointer" onClick={handleOotdClick}>
                <div className="hover:bg-gray-200 px-[1.3rem] py-[1.2rem]">
                  <div className="flex items-start">
                    <Image
                      className="mr-[1.7rem] mt-[0.5rem]"
                      src={ootdWrite}
                      width={24}
                      height={24}
                      alt=""
                    />
                    <div>
                      <h1 className="text-[1.6rem] font-medium text-neutral-900 dark:text-white ">OOTD 글쓰기</h1>
                      <span className="text-[0.9rem] font-normal text-[#9D9D9D]">여행 중 나의 특별한 OOTD를 공유해보세요.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFooter;