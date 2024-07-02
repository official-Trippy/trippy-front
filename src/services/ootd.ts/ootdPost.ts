import { OotdRequest, PostRequest, PostResponse } from '@/types/ootd';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createPost = async (postRequest: PostRequest, ootdRequest: OotdRequest): Promise<PostResponse> => {
  const response = await axios.post<PostResponse>(`${backendUrl}/api/ootd`, { postRequest, ootdRequest });
  return response.data;
};
