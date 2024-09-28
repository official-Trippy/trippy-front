import axios from '@/app/api/axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function postBoard(postRequest: any, ticketRequest: any) {
    try {
        const res = await axios.post(`${backendUrl}/api/post`, { postRequest, ticketRequest })
        return res.data;
    } catch (error) {
        // console.error(error);
    }
}

// export async function postBoardBookMark(memberId: string, postId: number) {
//     try {
//         const res = await axios.post(`${backendUrl}/api/bookmark`, { null, postId })
//         return res.data;
//     } catch (error) {
//         // console.error(error);
//     }
// }