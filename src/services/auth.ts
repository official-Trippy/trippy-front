import axios from "axios";
import Cookies from "js-cookie";
import { headers } from "next/headers";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

let accessToken = "";

export async function socialSignUp(accessToken: any) {
  try {
    const res = await axios.get(
      `${backendUrl}/api/member/login/oauth2/{socialName}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (e) {
    return null;
  }
}

export async function signUp(formData: any) {
  try {
    const response = await axios.post(
      `${backendUrl}/api/member/signup`,
      formData
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Error during signup: ${error}`);
  }
}

export async function checkSocial(memberId: string) {
  try {
    const response = await axios.get(
      `${backendUrl}/api/member/isNewMember=${memberId}`
    );
    const data = response.data.memberId;
    console.log(data);
    return data;
  } catch (error) {
    throw new Error("Error data");
  }
}

export async function Login(memberId: string, password: string) {
  try {
    const response = await axios.post(`${backendUrl}/api/member/login`, {
      memberId,
      password,
    });
    accessToken = response.data.result.accessToken;
    return response.data;
  } catch (error) {
    throw new Error(`Error during login: ${error}`);
  }
}

export const isLoggedIn = () => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  return !!accessToken && !!refreshToken;
};

export async function checkEmailDuplicate(email: string) {
  try {
    const response = await axios.get(
      `${backendUrl}/api/member/isDuplicated?email=${email}`
    );
    const data = response.data.result;
    console.log(response);
    console.log(data);
    return response.data;
  } catch (error) {
    throw new Error(`Error sending email: ${error}`);
  }
}

export async function emailSend(email: string) {
  try {
    const response = await axios.post(
      `${backendUrl}/api/email/send?email=${email}`
    );
    const data = response.data.result;
    console.log(response);
    console.log(data);
    if (data) {
      return { isSuccess: true };
    } else {
      return { isSuccess: false };
    }
  } catch (error) {
    throw new Error(`Error checking email duplication: ${error}`);
  }
}

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
