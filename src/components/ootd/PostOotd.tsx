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

  const weatherMutation = useMutation(
    (variables: { latitude: number; longitude: number; date: string }) =>
      fetchWeather(variables.latitude, variables.longitude, variables.date),
    {
      onSuccess: (data) => {
        setWeather(data.result);
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
          confirmButtonText: '확인',
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
      Swal.fire({
        icon: 'error',
        title: '입력 오류',
        text: '위치와 날짜를 모두 입력해주세요.',
      });
      return;
    }
    console.log(location)
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
      });
      return;
    }

    if (post.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: '문구 작성 오류',
        text: 'OOTD 문구를 작성해주세요.',
      });
      return;
    }

    if (tags.length < 3) {
      Swal.fire({
        icon: 'error',
        title: '태그 오류',
        text: '태그를 3개 이상 등록해주세요.',
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
    };

    const ootdRequest: OotdRequest = {
      area: weather?.area || '',
      weatherStatus: weather?.status || '',
      weatherTemp: weather?.avgTemp || '',
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
    <div className="w-full max-w-screen-lg mx-auto px-4 py-8">
       <div className="w-full flex justify-end mb-[20px]">
            <button
              className="bg-neutral-100 rounded-lg flex justify-center items-center px-10 py-2 text-black text-lg mr-[10px]"
            >
              임시저장
            </button>
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
          <LocationInput onLocationChange={handleLocationChange} selectedLocationName={location}/>
          <DateInput onDateChange={handleDateChange} />
          {weather ? (
            <div className="w-full bg-neutral-100 rounded-lg flex justify-center items-center py-4 text-neutral-500 text-lg">
              <div>{weather.avgTemp}°C, {getWeatherStatusInKorean(weather.status)}</div>
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
