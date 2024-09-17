import { OotdRequest, PostRequest, PostResponse } from '@/types/ootd';
import axios from '@/app/api/axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createPost = async (postRequest: PostRequest, ootdRequest: OotdRequest): Promise<PostResponse> => {
  const response = await axios.post<PostResponse>(`${backendUrl}/api/ootd`, { 
    postRequest, 
    ootdRequest 
  });
  return response.data;
};

export const updatePost = async (id: number, postRequest: PostRequest, ootdRequest: OotdRequest) => {
  const response = await axios.patch(`/api/ootd`, {
    id,
    ...ootdRequest,
  });
  return response.data;
};