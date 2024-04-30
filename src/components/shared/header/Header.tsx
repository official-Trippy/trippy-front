'use client'

import LogoButton from '../../../../public/LogoButton.png';
import AlertImg from '../../../../public/AlertImg.png';
import Profile from '../../../../public/Profile.png';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { isLoggedIn } from '@/services/auth';
import Cookies from 'js-cookie';

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setAccessToken(Cookies.get('accessToken') || '');
  }, [Cookies.get('accessToken')]); // accessToken이 변경될 때마다 useEffect 실행

  return (
    <>
      <header className="flex justify-between items-center px-4 py-8 w-[80%] mx-auto">
        <div className="flex items-center">
          <div className="mr-4">
            <Image src={LogoButton} alt="Logo" />
          </div>
          <div className="flex space-x-4 text-lg">
            <Link href="/home">
              <div className="text-gray-800 px-10">홈</div>
            </Link>
            <Link href="/ootd">
              <div className="text-gray-800">OOTD</div>
            </Link>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mr-4">
            {/* 검색창 컴포넌트 */}
          </div>
          {accessToken ? (
            <div className='flex'>
              <Link href="/write">
                <button className="bg-btn-color text-white px-7 py-2 rounded-lg mr-8">글쓰기</button>
              </Link>
              <div className="mr-8 w-[24px] my-auto">
                <Image src={AlertImg} alt="alert" />
              </div>
              <div className="w-[32px] my-auto">
              <Link href="/myPage">
                <Image src={Profile} alt="profile" />
              </Link>
              </div>
            </div>
          ) : (
            <div>
              <Link href="/login">
                <button className="bg-btn-color text-white px-6 py-2 rounded-lg">로그인</button>
              </Link>
            </div>
          )}
        </div>
      </header>
      <div className="my-[1%] border-[1px] border-lightGray/30"></div>
    </>
  );
}
