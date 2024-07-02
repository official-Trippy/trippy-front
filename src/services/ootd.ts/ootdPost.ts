import axios from 'axios';

interface Image {
  imgUrl: string;
  accessUri: string;
  authenticateId: string;
}

interface PostRequest {
  title: string;
  body: string;
  postType: string;
  location: string;
  images: Image[];
  tags: string[];
}

interface OotdRequest {
  area: string;
  weatherStatus: string;
  weatherTemp: string;
  detailLocation: string;
  date: string;
}

interface PostResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    ootd: OotdRequest;
    post: {
      id: number;
      email: string;
      title: string;
      body: string;
      postType: string;
      location: string;
      images: Image[];
      tags: string[];
      likeCount: number;
    };
  };
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createPost = async (postRequest: PostRequest, ootdRequest: OotdRequest): Promise<PostResponse> => {
  const response = await axios.post<PostResponse>(`${backendUrl}/api/ootd`, { postRequest, ootdRequest });
  return response.data;
};
