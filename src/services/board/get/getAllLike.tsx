import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function getAllLike(postId: number) {
    try {
        const res = await axios.get(`${backendUrl}/api/like/${postId}`)
        return res.data
    } catch (e) {
        return null;
    }
}