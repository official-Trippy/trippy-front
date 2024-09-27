'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';
import PostInput from './PostInput';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import { useMutation } from 'react-query';
import { fetchWeather } from '@/services/ootd.ts/weather';
import { createPost } from '@/services/ootd.ts/ootdPost';
import { PostRequest, OotdRequest } from '@/types/ootd';
import { UploadedImage } from '@/types/ootd';
import Swal from 'sweetalert2';
import { getWeatherStatusInKorean } from '@/constants/weatherTransition';
import { useUserStore } from '@/store/useUserStore';

const weatherOptions = [
  { value: 'rain', label: '비' },
  { value: 'snow', label: '눈' },
  { value: 'mostly_cloudy', label: '구름많음' },
  { value: 'cloudy', label: '흐림' },
  { value: 'sunny', label: '맑음' },
  { value: 'unknown', label: '기억 안남' },
];

const temperatureOptions = Array.from({ length: 71 }, (_, i) => i - 20).map(temp => ({
  value: temp === -100 ? 'unknown' : temp.toString(),
  label: temp === -100 ? '기억 안남' : `${temp}°C`,
}));

const PostOotd: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [post, setPost] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);
  const router = useRouter();

  const userInfo = useUserStore((state) => state.userInfo);
  const userMemberId = userInfo?.memberId;

  const weatherMutation = useMutation(
    (variables: { latitude: number; longitude: number; date: string }) =>
      fetchWeather(variables.latitude, variables.longitude, variables.date),
    {
      onSuccess: (data) => {
        setWeather(data.result);
      },
      onError: async (error) => {
        console.error('Error fetching weather:', error);

        // 클라이언트에서만 실행되도록 useEffect 사용
        if (typeof window !== 'undefined') {
          Swal.fire({
            icon: 'error',
            title: '날씨 정보를 불러올 수 없습니다.',
            text: '날씨와 온도를 직접 선택해주세요.',
            confirmButtonText: '확인',
            confirmButtonColor: '#FB3463',
            allowOutsideClick: false,
            preConfirm: async () => {
              // 요소에 접근하려면 useEffect 안에서 지정합니다
              return new Promise<void>((resolve) => {
                Swal.fire({
                  title: '날씨와 온도를 선택하세요',
                  html: `
                    <label for="weather-select">날씨 상태:</label>
                    <select id="weather-select" class="swal2-input">
                      ${weatherOptions.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
                    </select>
                    <label for="temperature-select" style="margin-top: 1em;">온도:</label>
                    <select id="temperature-select" class="swal2-input">
                      ${temperatureOptions.map(option => `<option value="${option.value}">${option.label}</option>`).join('')}
                    </select>
                  `,
                  confirmButtonText: '확인',
                  confirmButtonColor: '#FB3463',
                  cancelButtonText: '취소',
                  showCancelButton: true,
                  allowOutsideClick: false,
                  preConfirm: () => {
                    const weatherSelect = document.getElementById('weather-select') as HTMLSelectElement;
                    const temperatureSelect = document.getElementById('temperature-select') as HTMLSelectElement;
                    return {
                      weather: weatherSelect.value,
                      temperature: temperatureSelect.value,
                    };
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    const selected = result.value;
                    if (selected) {
                      setWeather({
                        status: selected.weather,
                        avgTemp: selected.temperature === 'unknown' ? '정보 없음' : selected.temperature,
                      });
                    }
                    resolve();
                  }
                });
              });
            },
          });
        }
      },
    }
  );

  console.log(latitude);
  console.log(longitude);
  
  const postMutation = useMutation(
    (variables: { postRequest: PostRequest; ootdRequest: OotdRequest }) =>
      createPost(variables.postRequest, variables.ootdRequest),
    {
      onSuccess: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'OOTD 게시글을 올렸습니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463', 
          customClass: {
            popup: 'swal-custom-popup',
            icon: 'swal-custom-icon'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/ootd');
          }
        });
      },
      onError: (error) => {
        console.error('Error creating post:', error);
        Swal.fire({
          icon: 'error',
          title: '게시글 올리기 오류',
          text: '게시글을 올리는 중 오류가 발생했습니다.',
        });
      },
    }
  );

  useEffect(() => {
    if (latitude !== 0 && longitude !== 0 && date.length === 8) {
      weatherMutation.mutate({ latitude, longitude, date });
    }
  }, [latitude, longitude, date]);

  const handleFetchWeather = () => {
    if (!location || date.length !== 8) {
      if (typeof window !== 'undefined') {
        Swal.fire({
          icon: 'error',
          iconColor: '#FB3463', 
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463', 
          title: '입력 오류',
          text: '지역과 날짜를 모두 입력해주세요.',
        });
      }
      return;
    }
    setLatitude(latitude);
    setLongitude(longitude);
  };

  const formatDateString = (dateString: string) => {
    if (dateString.length === 8) {
      return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
    }
    return dateString;
  };

  const handleCreatePost = () => {
    if (images.length === 0) {
      if (typeof window !== 'undefined') {
        Swal.fire({
          icon: 'error',
          title: '이미지 오류',
          text: '이미지를 업로드해주세요.',
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463', 
          customClass: {
            popup: 'swal-custom-popup',
            icon: 'swal-custom-icon'
          }
        });
      }
      return;
    }

    if (post.trim() === '') {
      if (typeof window !== 'undefined') {
        Swal.fire({
          icon: 'error',
          title: '문구 작성 오류',
          text: 'OOTD 문구를 작성해주세요.',
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463', 
          customClass: {
            popup: 'swal-custom-popup',
            icon: 'swal-custom-icon'
          }
        });
      }
      return;
    }

    if (tags.length < 3) {
      if (typeof window !== 'undefined') {
        Swal.fire({
          icon: 'error',
          title: '태그 오류',
          text: '태그를 3개 이상 등록해주세요.',
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463', 
          customClass: {
            popup: 'swal-custom-popup',
            icon: 'swal-custom-icon'
          }
        });
      }
      return;
    }

    const formattedDate = formatDateString(date);

    const postRequest: PostRequest = {
      title: 'ootd 게시물',
      body: post,
      postType: 'OOTD',
      location,
      images: images.map(image => ({
        imgUrl: image.imgUrl,
        accessUri: image.accessUri,
        authenticateId: image.authenticateId,
      })),
      tags,
      memberId: userMemberId
    };

    const ootdRequest: OotdRequest = {
      area: weather?.area || '',
      weatherStatus: weather?.status || '',
      weatherTemp: weather?.avgTemp === '정보 없음' ? '' : weather?.avgTemp || '',
      detailLocation: location,
      date: formattedDate,
    };

    console.log('Sending postRequest:', JSON.stringify(postRequest, null, 2));
    console.log('Sending ootdRequest:', JSON.stringify(ootdRequest, null, 2));

    postMutation.mutate({ postRequest, ootdRequest });
  };

  const handleLocationChange = (locationData: { lat: number; lng: number; address: string }) => {
    setLocation(locationData.address);
    setLatitude(locationData.lat);
    setLongitude(locationData.lng);
    setWeather(null);
  };

  const handleDateChange = (date: string) => {
    setDate(date);
    setWeather(null);
  };
  return (
    <div className="min-h-[calc(100dvh-60px)] mb-[60px] w-[90%] py-16 sm-700:w-[66%] sm-700:min-h-screen sm-700:mb-0 mx-auto">
      <div className="w-full flex justify-end mb-[20px]">
        {/* <button
          className="bg-neutral-100 rounded-lg flex justify-center items-center px-10 py-2 text-black text-lg mr-[10px]"
        >
          임시저장
        </button> */}
        <button
          onClick={handleCreatePost}
          className="bg-[#fa3463] rounded-lg flex justify-center items-center px-10 py-2 text-white text-lg"
        >
          올리기
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader onImagesChange={setImages} />
        <div className="">
          <PostInput onPostChange={setPost} onTagsChange={setTags} tags={tags} />
          <div className="space-y-4">
            <LocationInput onLocationChange={handleLocationChange} selectedLocationName={location} />
            <DateInput onDateChange={handleDateChange} />
            {weather ? (
              <div className="w-full bg-neutral-100 rounded-lg flex justify-center items-center py-4 text-neutral-500 text-lg">
                <div>{weather.avgTemp === '정보 없음' ? '정보 없음' : weather.avgTemp}°C, {getWeatherStatusInKorean(weather.status)}</div>
              </div>
            ) : (
              <button
                onClick={handleFetchWeather}
                className="w-full bg-neutral-100 rounded-lg flex justify-center items-center py-4 text-neutral-500 text-lg"
              >
                날씨 불러오기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostOotd;
