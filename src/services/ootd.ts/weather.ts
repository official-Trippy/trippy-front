import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface WeatherResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: {
      area: string;
      avgTemp: string;
      maxTemp: string;
      minTemp: string;
      status: string;
    };
  }
  
  export const fetchWeather = async (latitude: number, longitude: number, date: string): Promise<WeatherResponse> => {
    const response = await axios.post<WeatherResponse>(`${backendUrl}/api/ootd/weather`, { latitude, longitude, date });
    return response.data;
  };
  