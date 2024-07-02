'use client';

import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import PostInput from './PostInput';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import { useMutation } from 'react-query';
import { fetchWeather } from '@/services/ootd.ts/weather';
import { createPost, PostRequest, OotdRequest } from '@/services/ootd.ts/ootdPost';

const PostOotd: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [post, setPost] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);

  const weatherMutation = useMutation((variables: { latitude: number; longitude: number; date: string }) =>
    fetchWeather(variables.latitude, variables.longitude, variables.date),
    {
      onSuccess: (data) => {
        setWeather(data.result);
      },
    }
  );

  const postMutation = useMutation((variables: { postRequest: PostRequest; ootdRequest: OotdRequest }) =>
    createPost(variables.postRequest, variables.ootdRequest),
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  const handleFetchWeather = () => {
    if (location === '') {
      alert('위치를 선택해주세요.');
      return;
    }
    if (date === '') {
      alert('날짜를 입력해주세요.');
      return;
    }
    let selectedLatitude = 0;
    let selectedLongitude = 0;

    switch (location) {
      case 'Seoul':
        selectedLatitude = 37.5671;
        selectedLongitude = 126.9788;
        break;
      case 'Busan':
        selectedLatitude = 35.1796;
        selectedLongitude = 129.0756;
        break;
      // 다른 지역들에 대한 위도 경도 처리 추가
      default:
        break;
    }

    setLatitude(selectedLatitude);
    setLongitude(selectedLongitude);

    // API 호출
    weatherMutation.mutate({ latitude: selectedLatitude, longitude: selectedLongitude, date });
  };

  const handleCreatePost = () => {
    const postRequest = {
      title: 'ootd 게시물',
      body: post,
      postType: 'OOTD',
      location: `${latitude},${longitude}`, // 위도 경도 문자열로 설정
      images: images.map((image) => ({
        imgUrl: image,
        accessUri: image,
        authenticateId: image,
      })),
      tags: tags,
    };
    const ootdRequest = {
      area: weather?.area || '',
      weatherStatus: weather?.status || '',
      weatherTemp: weather?.avgTemp || '',
      detailLocation: location,
      date: date,
    };
    postMutation.mutate({ postRequest, ootdRequest });
  };

  return (
    <div className="w-[80%] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUploader onImagesChange={setImages} />
        <div className="space-y-4">
          <PostInput onPostChange={setPost} onTagsChange={setTags} />
          <LocationInput onLocationChange={setLocation} />
          <DateInput onDateChange={setDate} />
          <button
            onClick={handleFetchWeather}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            날씨 불러오기
          </button>
          <button
            onClick={handleCreatePost}
            className="w-full bg-red-500 text-white py-2 rounded"
          >
            게시글 올리기
          </button>
          {weather && (
            <div className="bg-gray-100 rounded">
              <p>지역: {weather.area}</p>
              <p>평균 온도: {weather.avgTemp}</p>
              <p>최고 온도: {weather.maxTemp}</p>
              <p>최저 온도: {weather.minTemp}</p>
              <p>날씨 상태: {weather.status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostOotd;
