import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function getBoardComment(postId: number) {
    try {
        const res = await axios.get(`${backendUrl}/api/comment?postId=${postId}`);
        return res.data;
    } catch (e) {
        return null;
    }
}