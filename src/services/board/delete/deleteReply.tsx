import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function deleteReply(id: number) {
    try {
        const res = await axios.delete(`${backendUrl}/api/comment/${id}`)
        return res.data;
    } catch (e) {
        return null;
    }
}