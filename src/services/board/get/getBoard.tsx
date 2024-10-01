import axios from '@/app/api/axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function getBoard(sizes: number, pages: number) {
    try {
        const res = await axios.get(`${backendUrl}/api/post/all?size=${sizes}&page=${pages}`)
        return res.data;
    } catch (e) {
        return null;
    }
}

export const getAllBoardCount = async (): Promise<number> => {
    try {
        const response = await axios.get<{ result: number }>(
            `${backendUrl}/api/post/count/all?type=POST`
        );
        return response.data.result;
    } catch (error) {
        console.error(`전체 POST 데이터 개수를 가져오는 중 오류가 발생했습니다: ${error}`);
        throw error;
    }
};

export async function getPost(postId: number) {
    try {
        const res = await axios.get(`${backendUrl}/api/post/info/${postId}`);
        return res.data;
    } catch (e) {
        return null
    }
}

export const getTotalBoardCount = async (): Promise<number> => {
    try {
        const response = await axios.get<{ result: number }>(
            `${backendUrl}/api/post/count/my?type=POST`
        );
        return response.data.result;
    } catch (error) {
        console.error(`전체 POST 데이터 개수를 가져오는 중 오류가 발생했습니다: ${error}`);
        throw error;
    }
};

export async function getBoardMyTotal(size: number, page: number, orderType: string) {
    try {
        const res = await axios.get(`${backendUrl}/api/post/my?size=${size}&page=${page}&orderType=${orderType}`);
        return res.data;
    } catch (e) {
        return null;
    }
}

export const getUserTotalBoardCount = async (memberId: string): Promise<number> => {
    try {
        const response = await axios.get<{ result: number }>(
            `${backendUrl}/api/post/count/by-member?type=POST&memberId=${memberId}`
        );
        return response.data.result;
    } catch (error) {
        console.error(`전체 POST 데이터 개수를 가져오는 중 오류가 발생했습니다: ${error}`);
        throw error;
    }
};

export async function getUserBoard(size: number, page: number, orderType: string, memberId: string) {
    try {
        const res = await axios.get(`${backendUrl}/api/post/by-member?size=${size}&page=${page}&orderType=${orderType}&memberId=${memberId}`)
        return res.data;
    } catch (e) {
        return null;
    }
}

export async function getFollowBoard(memberId: string) {
    try {
        const res = await axios.get(`${backendUrl}/api/member/following?memberId=${memberId}`);
        return res.data;
    } catch (e) {
        return null;
    }
}

export async function getBoardBookMark(postId: number) {
    try {
        const res = await axios.get(`${backendUrl}/api/bookmark/isBookMarked?postId=${postId}`);
        return res.data;
    } catch (e) {
        return null;
    }
}

export async function getBoardFollow(size: number, page: number, orderType: string) {
    try {
        const res = await axios.get(`${backendUrl}/api/post/all?size=${size}&page=${page}&orderType=${orderType}`);
        return res.data;
    } catch (e) {
        return null;
    }
}

export const fetchFollowTicketPosts = async (page: number, size: number, orderType: string) => {
    const response = await axios.get(`${backendUrl}/api/post/follow`, {
        params: {
            page,
            size,
            orderType,
            postType: 'POST',
        },
    });

    return response.data;
};