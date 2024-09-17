import axios from '@/app/api/axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function postComments(commentData: {}) {
    try {
        const res = await axios.post(`${backendUrl}/api/comment`, commentData)
        return res.data;
    } catch (e) {
        return null
    }
}