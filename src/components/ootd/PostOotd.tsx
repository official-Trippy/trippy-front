'use client';

import React, { useEffect, useRef, useState } from 'react';
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
import { getWeatherStatusInKorean } from '@/constants/weatherTransition';
import { useUserStore } from '@/store/useUserStore';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'; // Swal 추가
import WeatherModal from './WeatherModal';  // WeatherModal 컴포넌트 사용

const PostOotd: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [post, setPost] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 열림 상태 관리
  const router = useRouter();
  const userInfo = useUserStore((state) => state.userInfo);
  const userMemberId = userInfo?.memberId;

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      router.push('/login');
    }
  }, [router]);

  const dateInputRef = useRef<HTMLInputElement>(null);

  const weatherMutation = useMutation(
    (variables: { latitude: number; longitude: number; date: string }) =>
      fetchWeather(variables.latitude, variables.longitude, variables.date),
    {
      onSuccess: (data) => {
        setWeather(data.result);
      },
      onError: () => {
        // Swal로 먼저 경고 메시지를 띄우고 나서 커스텀 모달을 엽니다.
        Swal.fire({
          icon: 'error',
          title: '날씨 정보를 불러올 수 없습니다.',
          text: '날씨와 온도를 직접 선택해주세요.',
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463',
          allowOutsideClick: false,
        }).then(() => {
          // Swal이 닫힌 후 커스텀 모달을 엽니다.
          setIsModalOpen(true);
        });
      },
    }
  );

  const postMutation = useMutation(
    (variables: { postRequest: PostRequest; ootdRequest: OotdRequest }) =>
      createPost(variables.postRequest, variables.ootdRequest),
    {
      onSuccess: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'OOTD 게시글을 올렸습니다.',
          iconColor: "#FB3463",
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463',
        }).then(() => {
          router.push('/ootd');
        });
      },
      onError: (error) => {
        Swal.fire({
          icon: 'error',
          title: '게시글 올리기 오류',
          text: '게시글을 올리는 중 오류가 발생했습니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463',
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
      Swal.fire({
        icon: 'error',
        title: '입력 오류',
        text: '지역과 날짜를 모두 입력해주세요.',
        confirmButtonText: '확인',
        confirmButtonColor: '#FB3463',
      });
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
      Swal.fire({
        icon: 'error',
        title: '이미지 오류',
        text: '이미지를 업로드해주세요.',
        confirmButtonText: '확인',
        confirmButtonColor: '#FB3463',
      });
      return;
    }

    if (post.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: '문구 작성 오류',
        text: 'OOTD 문구를 작성해주세요.',
        confirmButtonText: '확인',
        confirmButtonColor: '#FB3463',
      });
      return;
    }

    if (tags.length < 3) {
      Swal.fire({
        icon: 'error',
        title: '태그 오류',
        text: '태그를 3개 이상 등록해주세요.',
        confirmButtonText: '확인',
        confirmButtonColor: '#FB3463',
      });
      return;
    }

    if (!location) {
      Swal.fire({
        icon: 'error',
        title: '위치 오류',
        text: '위치 정보를 입력해주세요.',
        confirmButtonText: '확인',
        confirmButtonColor: '#FB3463',
      });
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
      memberId: userMemberId,
    };

    const ootdRequest: OotdRequest = {
      area: weather?.area || '',
      weatherStatus: weather?.status || '',
      weatherTemp: weather?.avgTemp === '정보 없음' ? '' : weather?.avgTemp || '',
      detailLocation: location,
      date: formattedDate,
    };

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

  // 모달에서 날씨와 온도 저장
  const handleSaveWeather = (selectedWeather: string, temperature: string | null) => {
    setWeather({
      status: selectedWeather,
      avgTemp: temperature ? `${temperature}°C` : '정보 없음',
    });
  };

  return (
    <div className="mb-[60px] w-[90%] py-16 sm-700:w-[66%] sm-700:pb-0 sm-700:pt-16 sm-700:mb-0 mx-auto">
      <div className="w-full flex justify-end mb-[20px]">
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
              <div className="w-full bg-neutral-100 rounded-[8px] flex justify-center items-center py-4 text-neutral-500 text-lg">
                <div>{weather.avgTemp === '정보 없음' ? '정보 없음' : weather.avgTemp}, {getWeatherStatusInKorean(weather.status)}</div>
              </div>
            ) : (
              <button
                onClick={handleFetchWeather}
                className="w-full bg-neutral-100 rounded-[8px] flex justify-center items-center py-4 text-neutral-500 text-lg"
                >
                날씨 불러오기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 커스텀 모달 */}
      <WeatherModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveWeather} />
    </div>
  );
};

export default PostOotd;