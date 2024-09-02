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

  export const createReply = async (postId: number, content: string, parentId: number) => {
    const response = await axios.post(`${backendUrl}/api/comment`, {
      postId,
      content,
      status: 'PUBLIC',
      parentId
    });
    return response.data;
  };
  
  export const checkIfLiked = async (postId: number) => {
    const response = await axios.get(`${backendUrl}/api/like/isLiked/${postId}`);
    return response.data;
  };
  
  export const likePost = async (postId: number) => {
    const response = await axios.post(`${backendUrl}/api/like/${postId}`);
    return response.data;
  };
  
  export const unlikePost = async (postId: number) => {
    const response = await axios.delete(`${backendUrl}/api/like/${postId}`);
    return response.data;
  };

  export const likePostList = async (postId: number) => {
    const response = await axios.get(`${backendUrl}/api/like/${postId}`);
    return response.data;
  };
  
  export const fetchLikedPosts = async () => {
    const response = await axios.get(`${backendUrl}/api/like/my-list`, {
      params: { page: 0, size: 0, postType: 'OOTD' },
    });

    return response.data.result.map((item: any) => item.post.id);
  };
  