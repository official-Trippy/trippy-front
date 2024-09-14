'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useUserStore } from '@/store/useUserStore';
import HomeIcon from '../../../../public/mobile_home_active.svg';
import HomeActiveIcon from '../../../../public/mobile_home_inactive.svg';
import OotdIcon from '../../../../public/mobile_ootd_active.svg';
import OotdActiveIcon from '../../../../public/mobile_ootd_inactive.svg';
import EditorIcon from '../../../../public/mobile_editor_inactive.svg';
import EditorActiveIcon from '../../../../public/mobile_editor_inactive.svg';
import MyIcon from '../../../../public/mobile_my_inactive.svg';
import MyActiveIcon from '../../../../public/mobile_my_inactive.svg';

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
      <div className="sm-700:hidden z-[9999] fixed bottom-0 pt-[14px] pb-[18px] px-[6px] flex items-center bg-black border-t border-gray100 bg-white w-full">
        <div
          onClick={() => router.push('/')}
          className="flex-1 flex flex-col gap-1 items-center">
          <div>
            <Image
              src={pathname === '/' ? HomeIcon : HomeActiveIcon}
              alt="홈"
              width={40}
              height={40}
            />
          </div>
        </div>
        <div
          onClick={() => router.push('/ootd')}
          className="flex-1 flex flex-col gap-1 items-center">
          <div>
            <Image
              src={pathname.includes('/ootd') ? OotdIcon : OotdActiveIcon}
              alt="OOTD"
              width={40}
              height={40}
            />
          </div>
        </div>
        <div
          onClick={handleWriteClick}
          className="flex-1 flex flex-col gap-1 items-center">
          <div>
            <Image
              src={pathname.includes('/write') ? EditorIcon : EditorActiveIcon}
              alt="글쓰기"
              width={40}
              height={40}
            />
          </div>
        </div>
        <div
          onClick={handleMyPageClick}
          className="flex-1 flex flex-col gap-1 items-center">
          <div>
            <Image
              src={pathname.includes('/mypage') ? MyIcon : MyActiveIcon}
              alt="마이페이지"
              width={40}
              height={40}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <div className="w-[200px] bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col gap-4">
              <button
                onClick={handlePostClick}
                className="py-2 px-4 bg-blue-500 text-white rounded-lg">
                게시글 작성
              </button>
              <button
                onClick={handleOotdClick}
                className="py-2 px-4 bg-pink-500 text-white rounded-lg">
                OOTD 작성
              </button>
            </div>
            <div className="flex justify-end mt-4">
            <button
                onClick={handleModalClose}
                className="py-2 px-4 bg-gray-300 rounded-lg">
                닫기
            </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFooter;
