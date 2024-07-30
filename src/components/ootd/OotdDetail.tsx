'use client';

import React from 'react';
import { useQuery } from 'react-query';
import Slider from 'react-slick';
import { fetchOotdPostDetail } from '@/services/ootd.ts/ootdGet';
import { OotdDetailGetResponse } from '@/types/ootd';
import { useUserStore } from '@/store/useUserStore';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import { formatDate } from '@/constants/dateFotmat';
import LocationIcon from '../../../public/icon_pin.png';
import CommentSection from './CommentSection';
import LeftArrowIcon from '../../../public/left-arrow.svg'; 
import RightArrowIcon from '../../../public/right-arrow.svg'; 
import { getWeatherStatusInKorean } from '@/constants/weatherTransition';
import { useRouter } from 'next/navigation'; 

interface OotdDetailProps {
  id: number;
}

const OotdDetail: React.FC<OotdDetailProps> = ({ id }) => {
  const { data, error, isLoading } = useQuery<OotdDetailGetResponse>(
    ['ootdPostDetail', id],
    () => fetchOotdPostDetail(id)
  );

  const userInfo = useUserStore((state) => state.userInfo);

  const router = useRouter();

  const handleProfileClick = () => {
    console.log('click')
    if (ootdItem.member.memberId == userInfo.memberId) {
      router.push('/mypage')
    }
    else {
      router.push(`/user/${ootdItem.member.memberId}`);
    } 
  };

  if (isLoading) {
    return null;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const ootdItem = data.result;

  const SampleNextArrow = (props: any) => {
    const { className, style, onClick, currentSlide, slideCount } = props;
    return (
      currentSlide !== slideCount - 1 && (
        <div
          className={`${className} custom-arrow`}
          style={{ ...style, display: 'block', right: '1px' }}
          onClick={onClick}
        >
          <Image src={RightArrowIcon} alt="Next" width={100} height={100} />
        </div>
      )
    );
  };

  const SamplePrevArrow = (props: any) => {
    const { className, style, onClick, currentSlide } = props;
    return (
      currentSlide !== 0 && (
        <div
          className={`${className} custom-arrow`}
          style={{ ...style, display: 'block', left: '-20px', zIndex: 1 }}
          onClick={onClick}
        >
          <Image src={LeftArrowIcon} alt="Previous" width={100} height={100} />
        </div>
      )
    );
  };

  const settings = {
    dots: true,
    infinite: ootdItem.post.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: ootdItem.post.images.length > 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Image
                className="rounded-full"
                width={48}
                height={48}
                src={ootdItem.member.profileUrl}
                onClick={handleProfileClick} 
                alt="User Profile" />
              <div className="ml-4">
                <span className="block font-bold text-xl ml-[2px]">{ootdItem.member.nickName}</span>
                <div className="flex items-center gap-2">
                  <Image
                    width={16}
                    height={16}
                    src={LocationIcon}
                    alt="location" />
                  <span className="block text-gray-600">
                    {ootdItem.post.location} | {getWeatherStatusInKorean(ootdItem.ootd.weatherStatus)}, {ootdItem.ootd.weatherTemp}°C
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {userInfo?.memberId === ootdItem.member.memberId ? null : (
                <button className="bg-red-500 text-white px-4 py-2 rounded-full">
                  팔로우
                </button>
              )}
              <i className="far fa-bookmark text-xl"></i>
              <i className="fas fa-ellipsis-h text-xl"></i>
            </div>
          </div>
          <div className="relative">
            <Slider {...settings}>
              {ootdItem.post.images.map((image, index) => (
                <div key={index}>
                  <img className="w-full rounded-t-lg" src={image.accessUri} alt={`OOTD Image ${index + 1}`} />
                </div>
              ))}
            </Slider>
          </div>
          <div className='py-[50px] text-[20px]'>
            {ootdItem.post.body}
          </div>
          <div className="flex pt-4">
            <div className="flex flex-wrap gap-2">
              {ootdItem.post.tags.map((tag: string, index: number) => (
                <span key={index} className="px-4 py-1 bg-neutral-100 rounded-3xl text-xl justify-center items-center gap-2.5 inline-flex text-[#9d9d9d]">
                  {tag}
                </span>
              ))}
            </div>
            <div className="ml-auto text-neutral-400 text-base font-normal font-['Pretendard'] my-auto">
              {formatDate(ootdItem.post.createDateTime)}
            </div>
          </div>
        </div>
      </div>
      <div className='w-full mb-[100px]'>
        <div className='w-full mx-auto'>
          <CommentSection
            postId={id}
            initialLikeCount={ootdItem.post.likeCount}
            initialCommentCount={ootdItem.post.commentCount} />
        </div>
      </div>
    </>
  );
};

export default OotdDetail;
