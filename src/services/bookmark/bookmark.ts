import axios from 'axios';
import { bookmarkCount } from '@/types/bookmark';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


export const fetchBookmarkCount = async (): Promise<number> => {
    try {
      const response = await axios.get<{ result: { totalCount: number; postCount: number; ootdCount: number } }>(
        `${backendUrl}/api/bookmark/count/my`
      );
      console.log(response.data);
      return response.data.result.totalCount;
    } catch (error) {
      console.error(`전체 북마크 데이터 개수를 가져오는 중 오류가 발생했습니다: ${error}`);
      throw error;
    }
  };

  export const fetchIsBookmarked = async (postId: number): Promise<boolean> => {
    try {
      const response = await axios.get<{ result: boolean }>(
        `${backendUrl}/api/bookmark/isBookMarked`,
        { params: { postId } }
      );
      console.log("Bookmark status:", response.data.result);
      return response.data.result;
    } catch (error) {
      console.error(`북마크 여부를 확인하는 중 오류가 발생했습니다: ${error}`);
      throw error;
    }
  };

  export const addBookmark = async (postId: number): Promise<void> => {
    try {
      const response = await axios.post<{ isSuccess: boolean }>(
        `${backendUrl}/api/bookmark`,
        null,
        { params: { postId } }
      );
      if (!response.data.isSuccess) {
        throw new Error('북마크 추가 실패');
      }
    } catch (error) {
      console.error(`북마크 추가 중 오류가 발생했습니다: ${error}`);
      throw error;
    }
  };