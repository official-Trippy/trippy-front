import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const updatePostComment = async (commentId: number, content: string) => {
    const response = await axios.patch(`${backendUrl}/api/comment`, {
        commentId,
        content,
    });
    return response.data.result;
};