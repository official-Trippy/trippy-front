import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchRecommendBoard = async (interestType: string) => {
    try {
        const response = await axios.get(`${backendUrl}/api/recommend/interest`, {
            params: {
                interestedType: interestType, // No need to encode here
                postType: 'POST'
            }
        });
        // console.log('Received data:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching POST for interest ${interestType}:`, error);
        throw error;
    }
};
