import axios from '@/app/api/axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function postBookMark(memberId: number, postId: any) {
    try {
        const res = await axios.post(`${backendUrl}/api/bookmark`, {
            memberId,
            postId
        })
        return res.data;
    } catch (e) {
        return null;
    }
}