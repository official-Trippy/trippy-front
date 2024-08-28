import axios from 'axios';
import { bookmarkCount } from '@/types/bookmark';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


export const fetchBookmarkCount = async (): Promise<number> => {
    try {
      const response = await axios.get<{ result: number }>(
        `${backendUrl}/api/bookmark/count/my`
      );
      console.log(response.data);
      return response.data.result;
    } catch (error) {
      console.error(`전체 북마크 데이터 개수를 가져오는 중 오류가 발생했습니다: ${error}`);
      throw error;
    }
  };
  