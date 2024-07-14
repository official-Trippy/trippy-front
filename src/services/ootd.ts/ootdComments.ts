import axios from 'axios';
import { Comment } from '@/types/ootd';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createComment = async (postId: number, content: string) => {
  const response = await axios.post(`${backendUrl}/api/comment`, {
    postId,
    content,
    status: 'PUBLIC',
  });
  return response.data.result;
};

export interface FetchCommentsResponse {
    result: Record<number, Comment>;
  }
  
  export const fetchComments = async (postId: number): Promise<FetchCommentsResponse> => {
    const response = await axios.get(`${backendUrl}/api/comment`, {
      params: { postId }
    });
    console.log(response.data);
    return response.data;
  };