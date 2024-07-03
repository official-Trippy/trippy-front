import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function getBoard() {
    try {
        const res = await axios.get(`${backendUrl}/api/post/all`)
        return res.data;
    } catch (e) {
        return null;
    }
}