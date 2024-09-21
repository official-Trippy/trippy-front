import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default async function editTicket(ticketData: {}) {
    try {
        const res = await axios.patch(`${backendUrl}/api/ticket`, { ticketData });
        return res.data;
    } catch (e) {
        return null;
    }
}