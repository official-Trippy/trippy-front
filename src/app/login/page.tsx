'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginPage = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState('');

  const handleSocialLogin = async (providerType: string) => {
    try {
      const redirectUri = window.location.href;
      const response = await fetch(`http://localhost:8080/oauth2/authorize/${providerType}?redirect_uri=${redirectUri}`);
      const data = await response.json();
      const receivedAccessToken = data.accessToken;
      setAccessToken(receivedAccessToken);
      router.push('/user/profile');
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
