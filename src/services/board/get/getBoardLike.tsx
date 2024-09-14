import axios from '@/app/api/axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function getBoardLike(postId: number) {
    try {
        const res = await axios.get(`${backendUrl}/api/like/isLiked/${postId}`)
        return res.data;
    } catch (e) {
        return null;
    }
}