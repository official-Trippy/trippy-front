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
  try {
    const response = await axios.get<WeatherResponse>(
      `${backendUrl}/api/ootd/weather`,
      {
        params: {
          latitude,
          longitude,
          date
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather data: ${error}`);
    throw error;
  }
};
