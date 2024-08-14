// app/edit/[id].tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImageUploader from '@/components/ootd/ImageUploader';
import PostInput from '@/components/ootd/PostInput';
import LocationInput from '@/components/ootd/LocationInput';
import DateInput from '@/components/ootd/DateInput';
import { useQuery, useMutation } from 'react-query';
import { fetchOotdPostDetail, updateOotdPost } from '@/services/ootd.ts/ootdGet';;
import { PostRequest, OotdRequest, UploadedImage } from '@/types/ootd';
import Swal from 'sweetalert2';
import { getWeatherStatusInKorean } from '@/constants/weatherTransition';

const EditOotd: React.FC = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [post, setPost] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);

  // Fetching existing OOTD post details
  const { data, isLoading, error } = useQuery(['ootdPostDetail', id], () =>
    fetchOotdPostDetail(Number(id))
  );

  useEffect(() => {
    if (data) {
      console.log('Loaded data:', data);
      const ootdItem = data.result;
      setImages(ootdItem.post.images);
      setPost(ootdItem.post.body);
      setTags(ootdItem.post.tags);
      setLocation(ootdItem.post.location);
      setDate(ootdItem.post.createDateTime);
      setWeather({
        status: ootdItem.ootd.weatherStatus,
        avgTemp: ootdItem.ootd.weatherTemp,
      });
    }
  }, [data]);

  const updatePostMutation = useMutation(
    (variables: { postRequest: PostRequest; ootdRequest: OotdRequest }) =>
      updateOotdPost(Number(id), variables.postRequest, variables.ootdRequest),
    {
      onSuccess: () => {
        Swal.fire({
          icon: 'success',
          title: 'OOTD 게시글을 수정하였습니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463',
        }).then(() => {
          router.push(`/ootd/${id}`);
        });
      },
      onError: () => {
        Swal.fire({
          icon: 'error',
          title: '게시글 수정 오류',
          text: '게시글을 수정하는 중 오류가 발생했습니다.',
        });
      },
    }
  );

  const handleUpdatePost = () => {
    const formattedDate = date.replace(/-/g, '');

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
      weatherTemp: weather?.avgTemp === '정보 없음' ? '' : weather?.avgTemp || '',
      detailLocation: location,
      date: formattedDate,
    };

    updatePostMutation.mutate({ postRequest, ootdRequest });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data) {
    return <div>Error loading post data</div>;
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 py-8">
      <div className="w-full flex justify-end mb-[20px]">
        <button
          onClick={handleUpdatePost}
          className="bg-[#fa3463] rounded-lg flex justify-center items-center px-10 py-2 text-white text-lg"
        >
          수정하기
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader onImagesChange={setImages} initialImages={images} />
        <div className="">
          <PostInput
            onPostChange={setPost}
            onTagsChange={setTags}
            tags={tags}
            initialPost={post}
          />
          <div className="space-y-4">
            <LocationInput
              onLocationChange={(locationData) => {
                setLocation(locationData.address);
                setLatitude(locationData.lat);
                setLongitude(locationData.lng);
                setWeather(null);
              }}
              selectedLocationName={location}
            />
            <DateInput onDateChange={setDate} initialDate={date} />
            {weather ? (
              <div className="w-full bg-neutral-100 rounded-lg flex justify-center items-center py-4 text-neutral-500 text-lg">
                <div>
                  {weather.avgTemp === '정보 없음'
                    ? '정보 없음'
                    : `${weather.avgTemp}°C, ${getWeatherStatusInKorean(
                        weather.status
                      )}`}
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (latitude && longitude && date) {
                    // Trigger weather fetch
                  }
                }}
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

export default EditOotd;
