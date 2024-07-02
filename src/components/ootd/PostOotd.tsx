'use client';

import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import PostInput from './PostInput';
import LocationInput from './LocationInput';
import DateInput from './DateInput';
import { useMutation } from 'react-query';
import { fetchWeather } from '@/services/ootd.ts/weather';
import { createPost } from '@/services/ootd.ts/ootdPost';
import { PostRequest, OotdRequest } from '@/types/ootd';
import { LOCATIONS, LocationKey } from '@/constants/locations';
import { UploadedImage } from '@/types/ootd';

const PostOotd: React.FC = () => {
    const [images, setImages] = useState<UploadedImage[]>([]);
  const [post, setPost] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState<LocationKey | ''>('');
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
      console.log('Post created:', data);
    },
  }
);

  useEffect(() => {
    if (latitude !== 0 && longitude !== 0 && date !== '') {
      weatherMutation.mutate({ latitude, longitude, date });
      console.log(weatherMutation);
    }
  }, [latitude, longitude, date]);

  const handleFetchWeather = () => {
    if (location === '') {
      alert('위치를 선택해주세요.');
      return;
    }
    if (date === '') {
      alert('날짜를 입력해주세요.');
      return;
    }

    const selectedLocation = LOCATIONS[location];
    setLatitude(selectedLocation.latitude);
    setLongitude(selectedLocation.longitude);
  };

  const formatDateString = (dateString: string) => {
    if (dateString.length === 8) {
      return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
    }
    return dateString;
  };

  const handleCreatePost = () => {
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