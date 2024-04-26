'use client';

import axios from 'axios'; 
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const frontendUrl = 'http://localhost:3000'; // 프론트엔드 도메인 URL
const backendUrl = 'http://localhost:8080'; // 백엔드 서버 URL

// const instance = axios.create({
//   baseURL: backendUrl, // 백엔드 서버 URL 설정
//   withCredentials: true, // CORS 정책 우회를 위해 withCredentials 옵션 true로 설정
// });

const LoginPage = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState('');

  const handleSocialLogin = async (providerType: string) => {
    const redirectUri = `${frontendUrl}/login`; // 로그인 후 리다이렉트할 주소
    try {
      const response = await axios.get(`http://localhost:8080/oauth2/authorize/${providerType}?redirect_uri=${redirectUri}`);
      const { accessToken } = response.data;
      setAccessToken(accessToken);
      console.log(response.data);
      console.log(response);
      console.log(response.data.result);
      console.log(accessToken);
      router.push('/login');
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
          <button onClick={() => handleSocialLogin('google')}>Login with Google</button>
          <button onClick={() => handleSocialLogin('kakao')}>Login with Kakao</button>
          <button onClick={() => handleSocialLogin('naver')}>Login with Naver</button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
