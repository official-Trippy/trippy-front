import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function getBoard() {
    try {
        const res = await axios.get(`${backendUrl}/api/post/all?type=POST`)
        return res.data;
    } catch (e) {
        return null;
    }
}

export async function getPost(postId: number) {
    try {
        const res = await axios.get(`${backendUrl}/api/post/info/${postId}`);
        return res.data;
    } catch (e) {
        return null
    }
}