'use client'

import LogoHeader from '../../../../public/LogoHeader.svg';
import AlertImg from '../../../../public/AlertImg.png';
import Profile from '../../../../public/Profile.png';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { loginState } from '@/atoms/user';
import Cookies from 'js-cookie';

export default function Header() {

  const { isLoggedIn } = useRecoilValue(loginState);
  const [, setLogin] = useRecoilState(loginState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoginState = async () => {
      try {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');
        if (accessToken && refreshToken) {
          setLogin({
            isLoggedIn: true,
            accessToken,
            refreshToken,
          });
        }
      } catch (error) {
        console.error('Error fetching login state:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoginState();
  }, []);

  return (
    <>
      <header className="header flex justify-between items-center w-[80%] mx-auto">
        <div className="flex items-center">
          <div className="mr-4">
            <Link href="/">
                <Image src={LogoHeader} alt="Logo" />
            </Link>
          </div>
          <div className="flex space-x-4 text-lg">
            <Link href="/home">
              <div className="text-gray-800 px-10" style={{fontSize: '1.4rem'}}>홈</div>
            </Link>
            <Link href="/ootd">
              <div className="text-gray-800" style={{fontSize: '1.4rem'}}>OOTD</div>
            </Link>
          </div>
        </div>

        <div className="flex items-center">
          <div className="mr-4">
            {/* 검색창 컴포넌트 */}
          </div>
          {loading ? null : (
             <>
          {isLoggedIn ? (
            <div className='flex'>
              <Link href="/write">
                <button className="-[8.6rem] h-[3.5rem] bg-btn-color text-white px-7 py-2 rounded-lg mr-8" style={{fontSize: '1.6rem'}}>글쓰기</button>
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
                <button className="w-[8.6rem] h-[3.5rem] bg-btn-color text-white px-6 py-2 rounded-lg" style={{fontSize: '1.6rem'}}>로그인</button>
              </Link>
            </div>
          )}
          </>
           )}
        </div>
      </header>
      {/* <div className="border-[0.5px] border-lightGray/30"></div> */}
    </>
  );
}
