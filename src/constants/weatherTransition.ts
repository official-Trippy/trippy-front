import rainIcon from '../../public/rain_icon.svg';
import snowIcon from '../../public/snow_icon.svg';
import mostlyCloudyIcon from '../../public/cloudy_icon.svg';
import cloudyIcon from '../../public/most_icon.svg';
import sunnyIcon from '../../public/sunny_icon.svg';

export const getWeatherStatusInfo = (status: string) => {
  const weatherMap: { [key: string]: { label: string; icon: string } } = {
    rain: { label: '비', icon: rainIcon },
    snow: { label: '눈', icon: snowIcon },
    mostly_cloudy: { label: '구름많음', icon: mostlyCloudyIcon },
    cloudy: { label: '흐림', icon: cloudyIcon },
    sunny: { label: '맑음', icon: sunnyIcon },
  };

  return weatherMap[status] || { label: '정보 없음', icon: sunnyIcon };
};

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