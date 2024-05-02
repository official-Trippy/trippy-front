'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import LogoMain from '../../../public/LogoMain.svg';
import Image from 'next/image';
import { useEffect } from 'react';
import { Login } from '@/services/auth';
import Cookies from 'js-cookie';
import { useSetRecoilState } from 'recoil';
import { loginState } from '@/atoms/user';
import { useRecoilState } from 'recoil';


const LoginPage = () => {
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [login, setLogin] = useRecoilState(loginState);
  const { isLoggedIn } = login;

  const handleLogin = async () => {
    try {
      const response = await Login(memberId, password);
      console.log(response);
      const { accessToken, refreshToken } = response.result;

      Cookies.set('accessToken', accessToken);
      Cookies.set('refreshToken', refreshToken);

      setLogin({
        isLoggedIn: true,
        accessToken,
        refreshToken,
      });
      router.push("/home");
      router.refresh();
    } catch (error) {
      console.error('Error during login:', error);
    }
  };


  const handleSocialLogin = async (socialName: string) => {
    try {
      const response = await axios.get(`${process.env.BACKEND_URL}/api/member/login/oauth2/${socialName}`);
      const { accessToken } = response.data;
      console.log(response.data);
      console.log(response);
      console.log(response.data.result);
      console.log(accessToken);
      router.push('/');
      console.log('Redirecting to login page...');
    } catch (error) {
      console.error('Error during social login:', error);
    }
  };

  return (
    <div className="flex flex-col items-center pt-20">
      <div className="mb-8">
        <Image src={LogoMain} alt="Logo" />
      </div>

    <div className="mb-4">
      <label htmlFor="email" className="block mb-2">이메일</label>
      <input type="email" id="email" onChange={(e) => setMemberId(e.target.value)} placeholder="trippy@trippy.co.kr" className="border-b border-gray-300 rounded-none py-2 w-[320px]" />
    </div>

    <div className="mb-4">
      <label htmlFor="password" className="block mb-2">비밀번호</label>
      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-b border-gray-300 rounded-none py-2 w-[320px]" />
    </div>

      <button onClick={handleLogin} className="bg-btn-color text-white px-4 rounded-md my-4 w-[320px] h-[44px]">로그인</button>

      <div className="flex justify-center">
        <a href="#" className="mx-4 text-[#9D9D9D]">계정 찾기</a>
        <a href="#" className="mx-4 text-[#9D9D9D]">비밀번호 찾기</a>
        <a href="/register" className="mx-4 text-[#9D9D9D]">회원가입하기</a>
      </div>
      <div className="flex flex-col my-10 items-center">
        <div className="bg-kakao-btn text-black px-4 rounded-md my-2 w-[320px] h-[44px] flex items-center justify-center" onClick={() => handleSocialLogin('kakao')}>
          카카오로 계속하기
        </div>
        <div className="bg-naver-btn text-white px-4 rounded-md my-2 w-[320px] h-[44px] flex items-center justify-center" onClick={() => handleSocialLogin('naver')}>
          네이버로 계속하기
        </div>
        <div className="bg-google-btn text-black px-4 rounded-md my-2 w-[320px] h-[44px] flex items-center justify-center" onClick={() => handleSocialLogin('google')}>
          구글로 계속하기
        </div>
      </div>
    </div>
  );
};

export default LoginPage;