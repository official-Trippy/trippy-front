'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImageUploader from '@/components/ootd/ImageUploader';
import PostInput from '@/components/ootd/PostInput';
import LocationInput from '@/components/ootd/LocationInput';
import DateInput from '@/components/ootd/DateInput';
import { useQuery, useMutation } from 'react-query';
import { fetchOotdPostDetail, updateOotdPost, updatePost } from '@/services/ootd.ts/ootdGet';
import { PostRequest, OotdRequest, UploadedImage } from '@/types/ootd';
import Swal from 'sweetalert2';
import { getWeatherStatusInKorean } from '@/constants/weatherTransition';
import { fetchWeather } from '@/services/ootd.ts/weather';
import { getCoordinatesFromAddress } from '@/constants/geocode';
import ImageChanger from '@/components/ootd/ImageChanger';

const EditOotd: React.FC = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [post, setPost] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [date, setDate] = useState<string>('');
  const [weather, setWeather] = useState<any>(null);
  const [postId, setPostId] = useState<number | null>(null);
  const [ootdId, setOotdId] = useState<number | null>(null);

  // 상태 변경 여부를 추적하는 상태
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const { data, isLoading, error } = useQuery(['ootdPostDetail', id], () =>
    fetchOotdPostDetail(Number(id))
  );

  const formatDateString = (dateString: string | null) => {
    if (!dateString) return ''; // null이나 undefined일 경우 빈 문자열 반환
  
    // dateString이 'yyyy-MM-dd' 형식일 경우에만 변환
    const dateParts = dateString.split('-');
    if (dateParts.length === 3) {
      const [year, month, day] = dateParts;
      return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
    }
    return dateString; // 형식이 다를 경우 원본 문자열 반환
  };
  

  const formatDateForApi = (dateString: string | null) => {
    if (!dateString) return ''; // null이나 undefined일 경우 빈 문자열 반환
  
    // 'yyyyMMdd' 형식의 문자열을 'yyyy-MM-dd' 형식으로 변환
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}-${month}-${day}`;
  };
  

  useEffect(() => {
    if (data && data.isSuccess) {
      const postData = data.result.post;
      const ootdData = data.result.ootd;

      if (postData && ootdData) {
        setPostId(postData.id);
        setOotdId(ootdData.id);

        setImages(postData.images);
        setPost(postData.body);
        setTags(postData.tags);
        setLocation(postData.location);
        setDate(formatDateString(ootdData.date || '')); 
        setWeather({
          status: ootdData.weatherStatus,
          avgTemp: ootdData.weatherTemp,
        });

        console.log(formatDateString(ootdData.date)); // 변환된 날짜 확인

        // 주소를 좌표로 변환하여 latitude와 longitude를 설정합니다.
        getCoordinatesFromAddress(postData.location).then(coordinates => {
          if (coordinates) {
            setLatitude(coordinates.lat);
            setLongitude(coordinates.lng);
          }
        });
      } else {
        console.error('Post or OOTD data is missing');
      }
    }
  }, [data]);

  useEffect(() => {
    console.log('렌더링된 이미지 상태: ', images); // 상태 업데이트 후의 이미지 상태를 로그합니다.
  }, [images]);
  
  // 비동기적으로 상태가 설정되었는지 확인
  useEffect(() => {
    if (images.length > 0) {
      console.log('렌더링된 이미지 상태 (비동기 확인): ', images);
    }
  }, [images]);

  useEffect(() => {
    if (hasChanges && latitude !== null && longitude !== null && date) {
      handleFetchWeather();
    }
  }, [hasChanges, latitude, longitude, date]);

  const weatherMutation = useMutation(
    (variables: { latitude: number; longitude: number; date: string }) =>
      fetchWeather(variables.latitude, variables.longitude, variables.date),
    {
      onSuccess: (data) => {
        setWeather(data.result);
      },
      onError: () => {
        Swal.fire({
          icon: 'error',
          title: '날씨 정보를 불러올 수 없습니다.',
          text: '날씨와 온도를 직접 선택해주세요.',
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463',
        });
      },
    }
  );

  const handleFetchWeather = () => {
    if (latitude === null || longitude === null || !date) {
      Swal.fire({
        icon: 'error',
        title: '입력 오류',
        text: '위치와 날짜를 모두 입력해주세요.',
      });
      return;
    }
    weatherMutation.mutate({ latitude, longitude, date });
  };

  const updatePostMutation = useMutation(
    async (variables: { postRequest: PostRequest; ootdRequest: OotdRequest }) => {
      if (postId === null || ootdId === null) {
        throw new Error('Post ID or OOTD ID is missing');
      }
      await updatePost(postId, variables.postRequest);
      return updateOotdPost(ootdId, variables.ootdRequest);
    },
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
    if (postId === null || ootdId === null) {
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '포스트 ID 또는 OOTD ID가 없습니다.',
      });
      return;
    }
  
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
  
    const formattedDateForApi = formatDateForApi(date);
  
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
      memberId: data?.result.member.memberId || '',
    };
  
    const ootdRequest: OotdRequest = {
      area: weather?.area || '',
      weatherStatus: weather?.status || '',
      weatherTemp: weather?.avgTemp === '정보 없음' ? '' : weather?.avgTemp || '',
      detailLocation: location,
      date: formattedDateForApi,
    };
  
    updatePostMutation.mutate({ postRequest, ootdRequest });
  };
  

  const handleLocationChange = (locationData: { address: string; lat: number; lng: number }) => {
    setLocation(locationData.address);
    setLatitude(locationData.lat);
    setLongitude(locationData.lng);
    setHasChanges(true);
  };

  const handleDateChange = (newDate: string) => {
    setDate(formatDateString(newDate));
    setHasChanges(true);
  };

  if (isLoading) {
    return null;
  }

  if (error || !data) {
    return null;
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
        <ImageChanger onImagesChange={setImages} initialImages={images} />
        <div className="">
          <PostInput
            onPostChange={setPost}
            onTagsChange={setTags}
            tags={tags}
            initialPost={post}
          />
          <div className="space-y-4">
            <LocationInput
              onLocationChange={handleLocationChange}
              selectedLocationName={location}
            />
            <DateInput
              onDateChange={handleDateChange}
              initialDate={date}
            />
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

export default EditOotd;
