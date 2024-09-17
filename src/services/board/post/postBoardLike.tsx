import axios from '@/app/api/axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function postBoardLike(postId: any) {
    try {
        const res = await axios.post(`${backendUrl}/api/like/${postId}`)
        return res.data;
    } catch (e) {
        return null;
    }
}