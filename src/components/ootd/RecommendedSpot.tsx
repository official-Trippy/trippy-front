import React, { useState, useRef, useEffect } from 'react';
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
  const swiperRef = useRef<SwiperRef | null>(null);

  const updateItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 550) {
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

  const handleSpotClick = (title: string) => {
    // URL 인코딩을 강화하여 특수 문자 및 공백 처리
    const encodedTitle = encodeURIComponent(title);
    const kakaoMapUrl = `https://map.kakao.com/link/search/${encodedTitle}`;
    
    window.open(kakaoMapUrl, '_blank');
  };
  // 호버 상태 관리
  const [hoveredSpot, setHoveredSpot] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setHoveredSpot(index);
  };

  const handleMouseLeave = () => {
    setHoveredSpot(null);
  };

  return (
    <div className="relative w-[90%] sm-700:w-[66%] sm-700:max-w-7xl mx-auto pt-[2rem] overflow-visible">
      <h2 className="font-bold text-2xl mb-4">추천 장소를 알려드릴게요!</h2>
      {/* 왼쪽 버튼 */}
      {itemsPerSlide < recommendedSpots.length && (
        <Image
          src={SwiperLeftButton}
          alt="Previous"
          width={30}
          height={30}
          onClick={() => handleScrollOotd('left')}
          style={{
            width: '30px',
            height: '30px',
            position: 'absolute',
            top: '58%', // 이미지 영역의 세로 정가운데
            transform: 'translateY(-50%)',
            zIndex: 999,
            left: '-10px',
          }}
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
              <SwiperSlide key={index} className="flex flex-col items-center justify-center text-center">
                <div
                  className="relative rounded-lg py-4 flex items-center justify-center cursor-pointer"
                  onClick={() => handleSpotClick(spot.title)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {spot.imgList && spot.imgList.length > 0 ? (
                    <div className="relative w-[158px] h-[100px] flex justify-center items-center rounded-[8px] overflow-hidden">
                      <Image
                        src={spot.imgList[0].galWebImageUrl}
                        alt={spot.title}
                        width={158}
                        height={100}
                        className="rounded-[8px] object-cover"
                        style={{ width: '158px', height: '100px' }}
                      />
                      {hoveredSpot === index && (
                        <div
                          className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                          style={{ 
                            WebkitMaskImage: 'linear-gradient(white, white)', 
                            maskImage: 'linear-gradient(white, white)',  
                            borderRadius: '8px',
                          }}
                        >
                          <span className="text-white text-sm font-bold">위치 확인하기</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-[158px] h-[100px] flex justify-center items-center">
                      <Image
                        src={DefaultImage}
                        alt="이미지가 없습니다."
                        width={158}
                        height={100}
                        className="rounded-[8px] object-cover"
                        style={{ width: '158px', height: '100px' }}
                      />
                      {hoveredSpot === index && (
                        <div
                          className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center"
                          style={{ 
                            WebkitMaskImage: 'linear-gradient(white, white)', 
                            maskImage: 'linear-gradient(white, white)',  
                            borderRadius: '8px',
                          }}
                        >
                          <span className="text-white text-sm font-bold">위치 확인하기</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p
                  className="text-xl font-medium cursor-pointer"
                  onClick={() => handleSpotClick(spot.title)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {spot.title}
                </p>
              </SwiperSlide>
            ))
          ) : (
            <div className="text-center w-full">추천 장소가 없습니다.</div>
          )}
        </Swiper>
      </div>
      {/* 오른쪽 버튼 */}
      {itemsPerSlide < recommendedSpots.length && (
        <Image
          src={SwiperRightButton}
          alt="Next"
          width={30}
          height={30}
          onClick={() => handleScrollOotd('right')}
          style={{
            width: '30px',
            height: '30px',
            position: 'absolute',
            top: '58%', // 이미지 영역의 세로 정가운데
            transform: 'translateY(-50%)',
            right: '-10px',
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default RecommendedSpot;