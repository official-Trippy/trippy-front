import axios from 'axios';
import { OotdDetailGetResponse, OotdGetResponse } from '@/types/ootd';
import Cookies from "js-cookie";

const backendUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const fetchOotdPostCount = async (): Promise<number> => {
  try {
    const response = await axios.get<{ result: number }>(
      `${backendUrl}/api/post/count/my?type=OOTD`
    );
    console.log(response.data);
    return response.data.result;
  } catch (error) {
    console.error(`전체 OOTD 데이터 개수를 가져오는 중 오류가 발생했습니다: ${error}`);
    throw error;
  }
};

export const fetchAllOotdPostCount = async (): Promise<number> => {
  try {
    const response = await axios.get<{ result: number }>(
      `${backendUrl}/api/post/count/all?type=OOTD`
    );
    console.log(response.data);
    return response.data.result;
  } catch (error) {
    console.error(`전체 OOTD 데이터 개수를 가져오는 중 오류가 발생했습니다: ${error}`);
    throw error;
  }
};

export const fetchOotdPosts = async (page?: number, size?: number): Promise<OotdGetResponse> => {
  try {
    const params: { page?: number; size?: number } = {};
    if (page !== undefined) params.page = page;
    if (size !== undefined) params.size = size;

    const response = await axios.get<OotdGetResponse>(
      `${backendUrl}/api/ootd/my`,
      { params }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`OOTD 데이터를 가져오는 중 오류가 발생했습니다: ${error}`);
    throw error;
  }
};

export const fetchOotdPostDetail = async (id: number): Promise<OotdDetailGetResponse> => {
  try {
    const response = await axios.get<OotdDetailGetResponse>(
      `${backendUrl}/api/ootd/info/${id}`
    );
    console.log(response.data);
    return response.data; 
  } catch (error) {
    console.error(`OOTD 게시글 상세 정보를 가져오는 중 오류가 발생했습니다: ${error}`);
    throw error;
  }
};

export const deleteOotdPost = async (postId: number): Promise<void> => {
  try {
    const response = await axios.delete(`${backendUrl}/api/post/${postId}`);
    console.log(response.data);
    
    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error(`게시물을 삭제하는 중 오류가 발생했습니다: ${error}`);
    throw error;
  }
};


export const fetchAllOotdPosts = async (page?: number, size?: number, orderType: string = 'LATEST'): Promise<OotdGetResponse> => {
  try {
      const params: { page?: number; size?: number; orderType?: string } = { orderType };
      if (page !== undefined) params.page = page;
      if (size !== undefined) params.size = size;

      const response = await axios.get<OotdGetResponse>(`${backendUrl}/api/ootd/all`, { params });
      console.log(response.data);
      return response.data;
  } catch (error) {
      console.error(`OOTD 데이터를 가져오는 중 오류가 발생했습니다: ${error}`);
      throw error;
  }
}


export const fetchUserOotdPosts = async (memberId: string, page: number, size: number) => {
  const response = await axios.get(`${backendUrl}/api/ootd/by-member`, {
    params: {
      memberId
    },
  });
  return response.data;
};

export const fetchUserProfile = (memberId: string) => {
  return axios.get(`${backendUrl}/api/member/profile?memberId=${memberId}`).then((res) => res.data);
};



axios.interceptors.request.use(
  async (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
