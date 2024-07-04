import { OotdGetResponse } from '@/types/ootd';
import axios from 'axios';

const backendUrl: string = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const fetchOotdPosts = async ({ size = 9, page = 0 }): Promise<OotdGetResponse> => {
    try {
      const response = await axios.get<OotdGetResponse>(
        `${backendUrl}/api/ootd`,
        {
          params: {
            size,
            page
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`OOTD 데이터를 가져오는 중 오류가 발생했습니다: ${error}`);
      throw error;
    }
  };