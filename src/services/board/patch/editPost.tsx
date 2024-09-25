import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function editPost(postData: {}) {
    try {
        const res = await axios.patch(`${backendUrl}/api/post`, postData);
        return res.data;
    } catch (e) {
        return null;
    }
}