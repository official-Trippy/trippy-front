import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getCountry = ({ setResult }: any) => {
    const getLocationData = async (location: string) => {
        try {
            const response = await axios.get(`${backendUrl}/api/country/location`, {
                params: {
                    location: location,
                },
            });
            setResult(response.data); // 응답 데이터를 부모 컴포넌트로 전달
        } catch (error) {
            console.error('Error fetching location data:', error);
        }
    };

    return { getLocationData };
};

export const getCountry1 = ({ setResult1 }: any) => {
    const getLocationData1 = async (location: string) => {
        try {
            const response = await axios.get(`${backendUrl}/api/country/location`, {
                params: {
                    location: location,
                },
            });
            setResult1(response.data); // 응답 데이터를 부모 컴포넌트로 전달
        } catch (error) {
            console.error('Error fetching location data:', error);
        }
    };

    return { getLocationData1 };
};
