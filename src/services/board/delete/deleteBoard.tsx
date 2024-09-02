import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function deleteBoard(postId: number) {
    try {
        const res = await axios.delete(`${backendUrl}/api/post/${postId}`)
        return res.data;
    } catch (e) {
        return null;
    }
}