import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import SwiperLeftButton from '../../../public/SwiperLeftBtn.svg';
import SwiperRightButton from '../../../public/SwiperRightBtn.svg';
import DefaultImage from '../../../public/RecoNoImg.svg';

interface ImageList {
  galTitle: string;
  galWebImageUrl: string;
}

interface RecommendedSpot {
  title: string;
  hubTatsNm: string;
  imgList: ImageList[] | null;
  content: string;
  imgCnt: number;
}

interface RecommendedSpotProps {
  recommendedSpots: RecommendedSpot[];
}

const RecommendedSpot: React.FC<RecommendedSpotProps> = ({ recommendedSpots }) => {
  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperRef | null>(null);

  const updateItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 700) {
        setItemsPerSlide(2);
      } else if (width < 1000) {
        setItemsPerSlide(3);
      } else {
        setItemsPerSlide(4);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 페이지가 로드될 때, 그리고 창 크기가 변경될 때마다 슬라이드 개수 업데이트
      updateItemsPerSlide();
      window.addEventListener('resize', updateItemsPerSlide);

      return () => {
        window.removeEventListener('resize', updateItemsPerSlide);
      };
    }
  }, []);


  const handleScrollOotd = (direction: string) => {
    if (swiperRef.current) {
        if (direction === 'left') {
            swiperRef.current.swiper.slidePrev();
        } else {
            swiperRef.current.swiper.slideNext();
        }
    }
  };

  return (
    <div className="relative w-[90%] sm-700:w-[66%] mx-auto pt-[5rem] overflow-visible">
      <h2 className="font-bold text-2xl mb-4">추천 장소를 알려드릴게요!</h2>
      {itemsPerSlide < recommendedSpots.length && (
      <Image
                    src={SwiperLeftButton}
                    alt="Previous"
                    width={30}
                    height={30}
                    onClick={() => handleScrollOotd('left')}
                    className="absolute left-[-6px] top-[66%] transform -translate-y-1/2 z-10"
                />
      )}
      <div className="relative mx-auto">
        <Swiper
          ref={swiperRef}
          spaceBetween={20}
          slidesPerView={itemsPerSlide}
          className="mySwiper"
        >
          {recommendedSpots.length > 0 ? (
            recommendedSpots.map((spot, index) => (
              <SwiperSlide key={index} className="flex flex-col items-center justify-center cursor-pointer relative">
              <div className="rounded-lg p-4">
                {spot.imgList && spot.imgList.length > 0 ? (
                  <div className='w-[158px] h-[100px]'>
                    <Image
                      src={spot.imgList[0].galWebImageUrl}
                      alt={spot.title}
                      width={158}
                      height={100}
                      className="rounded-[8px] mt-2"
                    />
                  </div>
                ) : (
                  <div className='w-[158px] h-[100px]'>
                    <Image
                      src={DefaultImage}
                      alt="이미지가 없습니다."
                      width={158}
                      height={100}
                      className="rounded-[8px] mt-2"
                    />
                  </div>
                )}
              </div>
              <p className="text-center text-xl font-medium mt-2">{spot.title}</p>
            </SwiperSlide>
            ))
          ) : (
            <div className="text-center w-full">추천 장소가 없습니다.</div>
          )}
        </Swiper>
      </div>
      {itemsPerSlide < recommendedSpots.length && (
      <Image
                    src={SwiperRightButton}
                    alt="Next"
                    width={30}
                    height={30}
                    onClick={() => handleScrollOotd('right')}
                    className="absolute right-[-6px] top-[66%] transform -translate-y-1/2 z-10"
                />
      )}

    </div>
  );
};

export default RecommendedSpot;