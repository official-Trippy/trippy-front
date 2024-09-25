'use client';

import { blogInterests } from '@/constants/blogPreference';
import { fetchRecommendOotdPost } from '@/services/ootd.ts/ootdGet';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import Cookies from 'js-cookie';
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
import { getMyInfo } from '@/services/auth';

const TagContainer: React.FC<TagContainerProps> = ({ item }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [visibleTags, setVisibleTags] = useState<string[]>(item.post.tags);

    useEffect(() => {
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
    const accessToken = Cookies.get('accessToken');
    const [selectedInterest, setSelectedInterest] = useState(blogInterests[0]);
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [itemsPerSlide, setItemsPerSlide] = useState(4);
    const [filteredInterests, setFilteredInterests] = useState(blogInterests);
    const [userName, setUserName] = useState('');
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement | null>(null); 
    const swiperRef = useRef<SwiperRef | null>(null);

    const { data, isLoading, error } = useQuery(['recommendOotdPost', selectedInterest], () => fetchRecommendOotdPost(selectedInterest), {
        keepPreviousData: true,
    });

    const totalCount = data?.result.totalCnt;

    useEffect(() => {
        if (accessToken) {
            fetchLikedPosts().then(setLikedPosts);
            fetchUserInterests(); // 관심사 정보 가져오기
        }
    }, [accessToken]);

    // 사용자 정보에서 관심사 가져오기
    const fetchUserInterests = async () => {
        try {
            const userInfo = await getMyInfo();
            console.log(userInfo);
            const userInterests = userInfo.koreanInterestedTypes || []; // 관심사 추출
            const userName = userInfo.nickName;
            setUserName(userName); 
            setFilteredInterests(blogInterests.filter(interest => userInterests.includes(interest))); // 관심사로 필터링
        } catch (error) {
            console.error('Error fetching user interests:', error);
        }
    };

    // 화면 크기에 따라 itemsPerSlide를 설정하는 함수
    const updateItemsPerSlide = () => {
        const width = window.innerWidth;
        if (width < 700) {
            setItemsPerSlide(2);
        } else if (width < 1000) {
            setItemsPerSlide(3);
        } else {
            setItemsPerSlide(4);
        }
    };

    useEffect(() => {
        // 페이지가 로드될 때, 그리고 창 크기가 변경될 때마다 슬라이드 개수 업데이트
        updateItemsPerSlide();
        window.addEventListener('resize', updateItemsPerSlide);

        return () => {
            window.removeEventListener('resize', updateItemsPerSlide);
        };
    }, []);

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
        if (!accessToken) {
            router.push("/login");
        }
        else {
            router.push('/write')
        }
    };

    const handleGoEditPage = () => {
        router.push("/editProfile");
    };


    if (isLoading) return <div className="text-lg text-gray-600">Loading...</div>;
    if (error) return <div className="text-lg text-red-600">Error loading posts!</div>;

    // 데이터 슬라이드 생성
    const slides = [];
    if (data?.result?.recommendOotdList) {
        for (let i = 0; i < data.result.recommendOotdList.length; i += itemsPerSlide) {
            slides.push(data.result.recommendOotdList.slice(i, i + itemsPerSlide));
        }
    }

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
            {!accessToken && (    
            <h1 className="font-bold text-[2rem] mb-4">
                관심분야에 따른 OOTD를 확인해보세요!
            </h1>
            )}
            {accessToken && (    
            <h1 className="font-bold text-[2rem] mb-4">
                {userName}님, 이런 스타일 어때요?
            </h1>
            )}


            <div className="flex items-center my-12 relative">
                {!accessToken && (
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
                        left: '-30px',
                        zIndex: 999,
                    }}
                />
                )}
                <div 
                    className="overflow-hidden w-full cursor-pointer"
                    ref={scrollRef}
                    onMouseDown={handleDrag}
                >
                    <div className="flex flex-col space-x-4 transition-transform duration-300 flex-shrink-0 mr-auto justify-between sm-700:flex-row sm-700:mx-auto sm-700:items-center">
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

                        {accessToken && ( 
                            <div className='flex mr-auto mt-[10px] sm-700:ml-auto sm-700:mt-0' onClick={handleGoEditPage}>
                            <div className="text-right text-[#9d9d9d]">관심 키워드 설정</div>
                            <Image
                                src={RightIcon}
                                alt="keyword"
                                width={14}
                                height={14}
                             />
                            <div/> 
                            </div>
                        )}
                </div>
                </div>
                {!accessToken && (          
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
                        right: '-30px',
                        zIndex: 999,
                    }}
                />
                )}
            </div>
            {itemsPerSlide < totalCount && (
                <Image
                    src={SwiperLeftButton}
                    alt="Previous"
                    width={60}
                    height={60}
                    onClick={() => handleScrollOotd('left')}
                    className="absolute left-[-30px] top-[60%] transform -translate-y-1/2 z-10"
                />
            )}
            <div className='relative mx-auto '>
                <Swiper
                    ref={swiperRef}
                    spaceBetween={20}
                    slidesPerView={itemsPerSlide}
                >
                    {data?.result?.recommendOotdList?.length > 0 ? (
                        data.result.recommendOotdList.map((item: any) => (
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
                        <div className="h-full flex flex-col text-[2rem] text-black my-auto items-center justify-center font-medium font-['Pretendard'] py-[50px]">
                            
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
            {itemsPerSlide < totalCount && (
                <Image
                    src={SwiperRightButton}
                    alt="Next"
                    width={60}
                    height={60}
                    onClick={() => handleScrollOotd('right')}
                    className="absolute right-[-30px] top-[60%] transform -translate-y-1/2 z-10"
                />
            )}
        </div>
    );
}

export default RecommendOotdPost;