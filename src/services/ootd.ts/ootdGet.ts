import axios from '@/app/api/axios';
import { OotdDetailGetResponse, OotdGetResponse, OotdRequest, PostRequest } from '@/types/ootd';
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

export const fetchFollowOotdPosts = async (page: number, size: number, orderType: string) => {
  const response = await axios.get(`${backendUrl}/api/post/follow`, {
    params: {
      page,
      size,
      orderType,
      postType: 'OOTD',
    },
  });

  return response.data;
};

export const fetchUserOotdPosts = async (memberId: string, page: number, size: number): Promise<OotdGetResponse> => {
  try {
    const response = await axios.get<OotdGetResponse>(`${backendUrl}/api/ootd/by-member`, {
      params: {
        memberId,
        page,
        size,
        orderType: 'LATEST',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user OOTD posts: ${error}`);
    throw error;
  }
};

export const fetchUserProfile = async (memberId: string) => {
  const response = await axios.get(`${backendUrl}/api/member/profile?memberId=${memberId}`);
  console.log('유저정보 api: ', response)
  return response.data;
};

export const updatePost = async (id: number, postRequest: PostRequest) => {
  const requestBody = {
    id,
    memberId: postRequest.memberId,
    title: postRequest.title,
    body: postRequest.body,
    postType: postRequest.postType,
    location: postRequest.location,
    images: postRequest.images.map((image) => ({
      accessUri: image.accessUri,
      authenticateId: image.authenticateId,
      imgUrl: image.imgUrl,
    })),
    tags: postRequest.tags,
  };

  const response = await axios.patch(`${backendUrl}/api/post`, requestBody);
  return response.data;
};

export const updateOotdPost = async (
  id: number,
  ootdRequest: OotdRequest
) => {
  const requestBody = {
    id,
    area: ootdRequest.area || '', // 빈 문자열로 대체
    weatherStatus: ootdRequest.weatherStatus || '', // 빈 문자열로 대체
    weatherTemp: ootdRequest.weatherTemp || '', // 빈 문자열로 대체
    detailLocation: ootdRequest.detailLocation || '', // 빈 문자열로 대체
    date: ootdRequest.date || '', // 빈 문자열로 대체
  };

  const response = await axios.patch(`${backendUrl}/api/ootd`, requestBody);
  return response.data;
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

export const fetchOotdFollowPostCount = async (): Promise<number> => {
  try {
    const response = await axios.get<{ result: number }>(
      `${backendUrl}/api/post/count/follow?type=OOTD`
    );
    console.log(response.data);
    return response.data.result;
  } catch (error) {
    console.error(`팔로우 유저 OOTD 데이터 개수를 가져오는 중 오류가 발생했습니다: ${error}`);
    throw error;
  }
};

export const getUserTotalOotdCount = async (memberId: string): Promise<number> => {
  try {
      const response = await axios.get<{ result: number }>(
          `${backendUrl}/api/post/count/by-member?type=OOTD&memberId=${memberId}`
      );
      return response.data.result;
  } catch (error) {
      console.error(`전체 OOTD 데이터 개수를 가져오는 중 오류가 발생했습니다: ${error}`);
      throw error;
  }
};