import axios from '@/app/api/axios';
import { bookmarkCount } from '@/types/bookmark';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


export interface BookmarkCounts {
  totalCount: number;
  postCount: number;
  ootdCount: number;
}

export const fetchBookmarkCount = async (): Promise<BookmarkCounts> => {
  try {
    const response = await axios.get<{ result: BookmarkCounts }>(
      `${backendUrl}/api/bookmark/count/my`
    );
    return response.data.result;
  } catch (error) {
    console.error(`북마크 데이터를 가져오는 중 오류가 발생했습니다: ${error}`);
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


export const fetchBookmarkedOotd = async (page = 0, size = 9) => {
  const response = await axios.get(`${backendUrl}/api/bookmark`, {
    params: {
      orderType: "LATEST",
      postType: "OOTD",
      page,
      size,
    },
  });

  return response.data;
};

export const fetchBookmarkedPost = async (page = 0, size = 9) => {
  const response = await axios.get(`${backendUrl}/api/bookmark`, {
    params: {
      orderType: "LATEST",
      postType: "POST",
      page,
      size,
    },
  });

  return response.data;
};

export const deleteBookmark = async (postId: number): Promise<void> => {
  try {
    const response = await axios.delete<{ isSuccess: boolean }>(
      `${backendUrl}/api/bookmark`,
      { params: { postId } }
    );
    if (!response.data.isSuccess) {
      throw new Error('북마크 삭제 실패');
    }
  } catch (error) {
    console.error(`북마크 삭제 중 오류가 발생했습니다: ${error}`);
    throw error;
  }
};