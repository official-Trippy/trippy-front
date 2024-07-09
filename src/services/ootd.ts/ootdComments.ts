import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createComment = async (postId: number, content: string) => {
  const response = await axios.post(`${backendUrl}/api/comment`, {
    postId,
    content,
    status: 'PUBLIC',
  });
  return response.data.result;
};

export const fetchComments = async (postId: number) => {
  const response = await axios.get(`${backendUrl}/api/comments?postId=${postId}`);
  return response.data.result;
};
