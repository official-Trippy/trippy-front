'use client';

import axios from 'axios'; 
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const frontendUrl = 'http://localhost:3000'; // 프론트엔드 도메인 URL
const backendUrl = 'http://localhost:8080'; // 백엔드 서버 URL

const LoginPage = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState('');

  const handleSocialLogin = async (providerType: string) => {
    const redirectUri = `${frontendUrl}/login`; // 로그인 후 리다이렉트할 주소
    try {
      const response = await axios.get(`${backendUrl}/oauth2/authorize/${providerType}?redirect_uri=${redirectUri}`);
      const { accessToken } = response.data;
      setAccessToken(accessToken);
      console.log(response.data);
      console.log(response);
      console.log(response.data.result);
      console.log(accessToken);
      router.push('/login');
      console.log('Redirecting to login page...');
    } catch (error) {
      console.error('Error during social login:', error);
    }
  };

  const handleLogout = () => {
    setAccessToken('');
  };

  return (
    <div>
      {accessToken ? (
        <div>
          <p>Welcome, User!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <a href={`${backendUrl}/oauth2/authorize/kakao?redirect_uri=${frontendUrl}/login`} onClick={() => handleSocialLogin('google')}>Login with Google</a>
          <a href={`${backendUrl}/oauth2/authorize/kakao?redirect_uri=${frontendUrl}/login`} onClick={() => handleSocialLogin('kakao')}>Login with Kakao</a>
          <a href={`${backendUrl}/oauth2/authorize/kakao?redirect_uri=${frontendUrl}/login`} onClick={() => handleSocialLogin('naver')}>Login with Naver</a>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
