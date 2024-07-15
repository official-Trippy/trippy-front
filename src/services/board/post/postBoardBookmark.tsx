import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function postBoardBookMark(memberData: any) {
    try {
        const res = await axios.post(`${backendUrl}/api/post/bookmark`, memberData)
        return res.data;
    } catch (e) {
        return null;
    }
}