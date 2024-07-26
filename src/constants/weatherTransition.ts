export const getWeatherStatusInKorean = (status: string) => {
    const weatherMap: { [key: string]: string } = {
      rain: '비',
      snow: '눈',
      mostly_cloudy: '구름많음',
      cloudy: '흐림',
      sunny: '맑음',
    };
  
    return weatherMap[status] || '정보 없음';
  };