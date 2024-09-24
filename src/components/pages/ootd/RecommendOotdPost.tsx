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
import { TagContainerProps } from '@/types/tag';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import 'swiper/swiper-bundle.css';

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
            <div className="tag-container mt-2" ref={containerRef}>
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
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement | null>(null); // Ensure this is declared consistently at the top.
    const swiperRef = useRef<SwiperRef | null>(null); 

    const { data, isLoading, error } = useQuery(['recommendOotdPost', selectedInterest], () => fetchRecommendOotdPost(selectedInterest), {
        keepPreviousData: true,
    });

    useEffect(() => {
        if (accessToken) {
            fetchLikedPosts().then(setLikedPosts);
        }
    }, [accessToken]);

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

    if (isLoading) return <div className="text-lg text-gray-600">Loading...</div>;
    if (error) return <div className="text-lg text-red-600">Error loading posts!</div>;

     // Calculate how many items to display based on the window size
     const getItemsPerSlide = () => {
        if (window.innerWidth < 640) return 2; // For small screens
        if (window.innerWidth < 768) return 3; // For medium screens
        return 4; // For large screens
    };

    const itemsPerSlide = getItemsPerSlide();

    // Split data into slides
    const slides = [];
    if (data?.result?.recommendOotdList) {
        for (let i = 0; i < data.result.recommendOotdList.length; i += itemsPerSlide) {
            slides.push(data.result.recommendOotdList.slice(i, i + itemsPerSlide));
        }
    }

    const handleScrollOotd = (direction: string) => {
        if (swiperRef.current) {
            if (direction === 'left') {
                swiperRef.current.swiper.slidePrev(); // 이전 슬라이드로 이동
            } else {
                swiperRef.current.swiper.slideNext(); // 다음 슬라이드로 이동
            }
        }
    };


    return (
        <div className="w-[90%] sm-700:w-[66%] mx-auto pt-[5rem] mb-[90px]">
            <h1 className="text-2xl font-bold mb-4">
                Recommended OOTD Posts for <span className="text-blue-500">{selectedInterest}</span>
            </h1>

            <div className="flex items-center mb-4">
                <button 
                    className="" 
                    onClick={() => handleScroll('left')}
                >
                    ❮
                </button>

                <div 
                    className="overflow-hidden w-full cursor-pointer"
                    ref={scrollRef}
                    onMouseDown={handleDrag}
                >
                    <div className="flex space-x-2 transition-transform duration-300 flex-shrink-0">
                        {blogInterests.map(interest => (
                            <button 
                                key={interest} 
                                className={`flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium border-2 transition duration-300 flex-shrink-0 
                                            ${selectedInterest === interest ? 'border-red-600 text-red-600' : 'border-gray-400 text-gray-600 hover:bg-gray-200'}`} 
                                onClick={() => setSelectedInterest(interest)}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    className="" 
                    onClick={() => handleScroll('right')}
                >
                    ❯
                </button>
            </div>

            <Swiper
            ref={swiperRef}
            spaceBetween={20}
            slidesPerView={4}
            breakpoints={{
                640: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                1024: {
                    slidesPerView: 4,
                },
            }}
        >
             <button
            className="swiper-button-prev"
            onClick={() => handleScrollOotd('left')}
        >
            ❮
        </button>
            {data?.result?.recommendOotdList?.length > 0 ? (
                data.result.recommendOotdList.map((item: any) => (
                    <SwiperSlide key={item.post.id} className="flex flex-col cursor-pointer">
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
                                    <span className="text-[#6B6B6B] ml-[5px] overflow-hidden text-ellipsis whitespace-nowrap" style={{
                                        whiteSpace: 'nowrap', 
                                        overflow: 'hidden',   
                                        textOverflow: 'ellipsis'
                                    }}>{item.member.nickName}</span>
                                </div>
                            </div>
                            {item.post.images.length > 0 && (
                                <div className="relative w-full" style={{ aspectRatio: '303 / 381' }}>
                                    <Image
                                        className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                                        src={item.post.images[0].accessUri}
                                        alt="OOTD"
                                        layout="fill"
                                    />
                                </div>
                            )}
                            <div className="py-4">
                                <div className="flex items-center justify-end">
                                    <div className="flex items-center mt-2">
                                        <Image
                                            src={likedPosts.includes(item.post.id) ? HeartIcon : EmptyHeartIcon} 
                                            alt="좋아요"
                                            width={20}
                                            height={20}
                                        />
                                        <span className="mx-2 text-[#cfcfcf]"> {item.post.likeCount}</span>
                                        <Image
                                            src={CommentIcon1}
                                            alt="댓글"
                                            width={20}
                                            height={20}
                                        />
                                        <span className="mx-2 text-[#cfcfcf]"> {item.post.commentCount}</span>
                                    </div>
                                </div>
                                <TagContainer item={item} />
                            </div>
                        </div>
                    </SwiperSlide>
                ))
            ) : (
                <div className="text-lg text-gray-500">No posts available.</div>
            )}
             <button
        className="swiper-button-next"
        onClick={() => handleScrollOotd('right')}
    >
        ❯
    </button>
        </Swiper>
        </div>
    );
};

export default RecommendOotdPost;
