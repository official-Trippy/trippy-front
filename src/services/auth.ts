import axios from 'axios';
import Cookies from 'js-cookie';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

let accessToken = '';

export async function signUp(formData: any) {
  try {
    const response = await axios.post(`${backendUrl}/api/member/signup`, formData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Error during signup: ${error}`);
  }
};

export async function Login(memberId: string, password: string) {
  try {
    const response = await axios.post(`${backendUrl}/api/member/login`, { memberId, password });
    accessToken = response.data.result.accessToken;
    return response.data;
  } catch (error) {
    throw new Error(`Error during login: ${error}`);
  }
};

export async function MemberInfo(accessToken: any, refreshToken: any) {
  try {
    const res = await axios.get(`${backendUrl}/api/member`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Authorization-refresh': `Bearer ${refreshToken}`
      }
    });
    return res
  } catch (e) {
    return null;
  }
}

export const isLoggedIn = () => {
  const accessToken = Cookies.get('accessToken');
  const refreshToken = Cookies.get('refreshToken');
  return !!accessToken && !!refreshToken;
};

// Axios 설정: 헤더에 accessToken 추가
axios.interceptors.request.use(
  async (config) => {
    if (isLoggedIn()) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);