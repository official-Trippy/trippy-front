'use client';

import { blogInterests } from '@/constants/blogPreference';
import { fetchRecommendOotdPost } from '@/services/ootd.ts/ootdGet';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchLikedPosts } from '@/services/ootd.ts/ootdComments';
import HeartIcon from '../../../../public/heartedIcon.svg';
import EmptyHeartIcon from '../../../../public/heartIcon-default.svg';
import CommentIcon1 from '../../../../public/commentIcon-default.svg';
import DefaultImage from '../../../../public/defaultImage.svg';
import RightIcon from '../../../../public/GoRightIcon.svg';
import { TagContainerProps } from '@/types/tag';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperLeftButton from '../../../../public/SwiperLeftBtn.svg';
import SwiperRightButton from '../../../../public/SwiperRightBtn.svg';
import { useUserStore } from '@/store/useUserStore'; // Zustand 전역 상태 사용
import SkeletonRecommendOotdPost from './SkeletonRecommendOotdPost';
import Cookies from 'js-cookie';


const TagContainer: React.FC<TagContainerProps> = ({ item }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [visibleTags, setVisibleTags] = useState<string[]>(item.post.tags);
  
    const calculateVisibleTags = () => {
      const container = containerRef.current;
      if (!container) return;
  
      const tags = Array.from(container.children) as HTMLElement[];
      let totalWidth = 0;
      let visibleCount = 0;
  
      tags.forEach((tag, index) => {
        totalWidth += tag.offsetWidth + parseInt(getComputedStyle(tag).marginRight);
        if (totalWidth <= container.offsetWidth) {
          visibleCount = index + 1;
        }
      });
  
      setVisibleTags(item.post.tags.slice(0, visibleCount));
    };
  
    useEffect(() => {
      // DOM이 완전히 로드된 후 태그 계산
      setTimeout(calculateVisibleTags, 100);
  
      // 창 크기 변경 시 태그 계산
      window.addEventListener('resize', calculateVisibleTags);
  
      return () => {
        window.removeEventListener('resize', calculateVisibleTags);
      };
    }, [item.post.tags]);
  
    return (
      <div className="mt-4">
        <div className="text-[#6b6b6b] text-xl font-normal font-['Pretendard'] text-ellipsis overflow-hidden whitespace-nowrap">
          {item.post.body}
        </div>
        <div className="tag-container" ref={containerRef}>
          {visibleTags.map((tag, index) => (
            <span
              key={index}
              className="tag-item px-4 py-1 bg-neutral-100 rounded-3xl text-xl justify-center items-center gap-2.5 inline-flex text-[#9d9d9d]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };
  
  const RecommendOotdPost = () => {
    const { userInfo, loading } = useUserStore((state) => ({
        userInfo: state.userInfo,
        loading: state.loading,
    }));

    const [selectedInterest, setSelectedInterest] = useState(blogInterests[0]);
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [itemsPerSlide, setItemsPerSlide] = useState(4);
    const [filteredInterests, setFilteredInterests] = useState(blogInterests);
    const [userName, setUserName] = useState('');
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const swiperRef = useRef<SwiperRef | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const { data, isLoading, refetch } = useQuery(
        ['recommendOotdPost', selectedInterest],
        () => fetchRecommendOotdPost(selectedInterest),
        {
            keepPreviousData: true,
            onSuccess: () => {
                // 데이터 로드 후 스크롤 버튼 체크
                checkScroll();
            },
        }
    );

    const totalCount = data?.result?.ootdList?.length ?? 0;
    const totalSlides = Math.ceil(totalCount / itemsPerSlide);

    useEffect(() => {
        if (userInfo) {
            fetchLikedPosts().then(setLikedPosts);
            fetchUserInterests();
        }
    }, [userInfo]);

    const fetchUserInterests = async () => {
        try {
            const userInterests = userInfo?.koreanInterestedTypes || [];
            const userName = userInfo?.nickName;
            setUserName(userName);

            if (userInterests.length > 0) {
                setFilteredInterests(blogInterests.filter(interest => userInterests.includes(interest)));
                setSelectedInterest(userInterests[0]);
            } else {
                setSelectedInterest(blogInterests[0]);
            }
        } catch (error) {
            console.error('Error fetching user interests:', error);
        }
    };

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
        updateItemsPerSlide();
        window.addEventListener('resize', updateItemsPerSlide);

        return () => {
            window.removeEventListener('resize', updateItemsPerSlide);
        };
    }, []);

    const [showScrollButtons, setShowScrollButtons] = useState(false);

    // 스크롤 가능 여부를 확인하는 함수
    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollWidth, clientWidth } = scrollRef.current;
            setShowScrollButtons(scrollWidth > clientWidth);
        }
    };

    useEffect(() => {
        // 컴포넌트가 처음 로드될 때, 그리고 데이터 로드 후 스크롤 가능 여부 체크
        checkScroll();
    }, [filteredInterests, data]); // 데이터 로드 후에도 스크롤 상태 체크

    useEffect(() => {
        setCurrentSlide(0);
        refetch();
        checkScroll();
    }, [selectedInterest, refetch]);

    const handleScrollEnd = () => {
        checkScroll();
    };

    const handleScroll = (direction: string) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -100 : 100;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleDrag = (e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const scrollLeft = scrollRef.current!.scrollLeft;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const x = moveEvent.clientX - startX;
            scrollRef.current!.scrollLeft = scrollLeft - x;
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const handleOotdItemClick = (id: number) => {
        router.push(`/ootd/${id}`);
    };

    const handleWriteBtnClick = () => {
        if (!userInfo) {
            router.push("/login");
        } else {
            router.push('/write');
        }
    };

    const handleGoEditPage = () => {
        router.push("/editProfile");
    };

    const slides = [];
    if (data?.result?.ootdList) {
        for (let i = 0; i < data.result.ootdList.length; i += itemsPerSlide) {
            slides.push(data.result.ootdList.slice(i, i + itemsPerSlide));
        }
    }

    const handleScrollOotd = (direction: string) => {
        if (swiperRef.current) {
            const swiper = swiperRef.current.swiper;
            if (direction === 'left') {
                swiper.slidePrev();
            } else {
                swiper.slideNext();
            }
            setCurrentSlide(swiper.activeIndex);
        }
    };

    const isAtFirstSlide = currentSlide === 0;
    const isAtLastSlide = currentSlide === totalSlides - 1;
    const shouldShowButtons = itemsPerSlide < totalCount;

    const [windowWidth, setWindowWidth] = useState<number | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            handleResize();
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    const leftPosition = windowWidth && windowWidth < 700 ? '0px' : '-30px';

    const [showSkeleton, setShowSkeleton] = useState(true);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const delay = setTimeout(() => {
                setShowSkeleton(false);
            }, 1000);

            return () => clearTimeout(delay);
        }
    }, [isLoading]);

    
    const roleValue = Cookies.get('role');


    if (loading || showSkeleton || isLoading) {
        return <SkeletonRecommendOotdPost />;
    }

    return (
        <div className="relative w-[90%] sm-700:w-[66%] mx-auto pt-[5rem] overflow-visible">
            {(!userInfo || !roleValue) && (
                <h1 className="font-bold text-[2rem] mb-4">
                    관심분야에 따른 OOTD를 확인해보세요!
                </h1>
            )}
            {(userInfo && roleValue) && ( // 조건식을 함수 호출이 아니라 논리 연산으로 수정
            <div className='flex flex-col items-start sm-700:flex-row sm-700:items-center'>
                <h1 className="font-bold text-[2rem]">
                    {userName}님, 이런 스타일 어때요?
                </h1>
                <div className='flex ml-auto mt-[10px] sm-700:mt-0 cursor-pointer' onClick={handleGoEditPage}>
                    <div className="text-right text-[#9d9d9d]">관심 키워드 설정</div>
                    <Image
                        src={RightIcon}
                        alt="keyword"
                        width={14}
                        height={14} />
                </div>
            </div>
            )}

            <div className="flex items-center my-12 relative">
            {(!userInfo || showScrollButtons) && (
                    <Image
                    src={SwiperLeftButton}
                    alt="Previous"
                    width={25}
                    height={25}
                    onClick={() => handleScroll('left')}
                    style={{
                      width: '25px',
                      height: '25px',
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 999,
                      left: 'calc(-30px)', // 기본적으로 left가 -30px로 설정
                    }}
                    className="left-button" // 추가적인 CSS 클래스
                  />
                )}
                <div
                    className="overflow-hidden cursor-pointer sm-700:w-full"
                    ref={scrollRef}
                    onMouseDown={handleDrag}
                    onScroll={handleScrollEnd} 
                >
                    <div className="flex flex-col transition-transform duration-300 flex-shrink-0 mr-auto justify-between md-850:flex-row md-850:mx-auto md-850:items-center">
                        <div className="flex space-x-4">
                            {filteredInterests.map(interest => (
                                <button
                                    key={interest}
                                    className={`flex items-center justify-center px-6 py-2 rounded-[20px] text-[12px] font-medium border-[1px] transition duration-300 flex-shrink-0
                                                ${selectedInterest === interest ? 'border border-[#FB3463] text-[#FB3463] bg-[#FFE3EA] text-bold' : 'border-[#CFCFCF] text-[#6B6B6B] hover:bg-gray-200'}`}
                                    onClick={() => setSelectedInterest(interest)}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {(!userInfo || showScrollButtons) && (
                    <Image
                        src={SwiperRightButton}
                        alt="Next"
                        width={25}
                        height={25}
                        onClick={() => handleScroll('right')}
                        style={{
                            width: '25px',
                            height: '25px',
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 999,
                            right: 'calc(-30px)', // 기본적으로 left가 -30px로 설정
                          }}
                          className="right-button" // 추가적인 CSS 클래스
                    />
                )}
            </div>
            {!isAtFirstSlide && shouldShowButtons && (
           <Image
           src={SwiperLeftButton}
           alt="Previous"
           width={40}
           height={40}
           onClick={() => handleScrollOotd('left')}
          className="absolute left-[-22px] top-[63.5%] transform -translate-y-1/2 z-10"
         />
            )}

            <div className='relative mx-auto '>
                <Swiper
                    ref={swiperRef}
                    spaceBetween={20}
                    slidesPerView={itemsPerSlide}
                >
                    {data?.result?.ootdList?.length > 0 ? (
                        data.result.ootdList.map((item: any) => (
                            <SwiperSlide key={item.post.id} className="flex flex-col cursor-pointer relative">
                                <div onClick={() => handleOotdItemClick(item.post.id)}>
                                    <div className="flex items-center pb-4">
                                        <div className="relative w-[24px] h-[24px]">
                                            <Image
                                                src={item.member.profileUrl || DefaultImage}
                                                alt="Profile"
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-full"
                                            />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <span className="text-[#292929] font-normal font-['Pretendard'] ml-[5px] overflow-hidden text-ellipsis whitespace-nowrap" style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>{item.member.nickName}</span>
                                        </div>
                                    </div>
                                    {item.post.images.length > 0 && (
                                        <div className="relative w-full" style={{ aspectRatio: '303 / 303' }}>
                                            <Image
                                                className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                                                src={item.post.images[0].accessUri}
                                                alt="OOTD"
                                                layout="fill"
                                            />
                                        </div>
                                    )}
                                    <TagContainer item={item} />
                                    <div className="pb-4">
                                        <div className="flex items-center justify-start">
                                            <div className="flex items-center mt-2">
                                                <Image
                                                    src={likedPosts.includes(item.post.id) ? HeartIcon : EmptyHeartIcon}
                                                    alt="좋아요"
                                                    width={20}
                                                    height={10}
                                                    style={{
                                                        width: '20px',
                                                        height: '18px',
                                                    }}
                                                />
                                                <span className="mx-2 text-[#cfcfcf]"> {item.post.likeCount}</span>
                                                <Image
                                                    src={CommentIcon1}
                                                    alt="댓글"
                                                    width={20}
                                                    height={20}
                                                    style={{
                                                        width: '20px',
                                                        height: '18px',
                                                    }}
                                                />
                                                <span className="mx-2 text-[#cfcfcf]"> {item.post.commentCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    ) : (
                        <div className="h-full w-full mx-auto flex flex-col text-[2rem] text-neutral-900 dark:text-white  my-auto items-center justify-center font-medium py-[50px]">
                            <div className='flex flex-row'>
                                <span className="text-[#FB3463]">{selectedInterest} </span>{"\u00A0"}관련 OOTD가 없어요!
                            </div>
                            <div className='bg-btn-color text-white text-2xl rounded-[8px] font-semibold mt-[20px] px-8 py-4 cursor-pointer' onClick={handleWriteBtnClick}>
                                OOTD 게시글 작성하러 가기
                            </div>
                        </div>
                    )}
                </Swiper>
            </div>
            {!isAtLastSlide && shouldShowButtons && (
                <Image
                    src={SwiperRightButton}
                    alt="Next"
                    width={40}
                    height={40}
                    onClick={() => handleScrollOotd('right')}
                    className="absolute right-[-22px] top-[63.5%] transform -translate-y-1/2 z-10"
                />
            )}
        </div>
    );
}

export default RecommendOotdPost;