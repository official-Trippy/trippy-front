'use client';

import { blogInterests } from '@/constants/blogPreference';
import { fetchRecommendOotdPost } from '@/services/ootd.ts/ootdGet';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { fetchLikedPosts } from '@/services/ootd.ts/ootdComments';
import DefaultImage from '../../../../public/defaultImage.svg';
import RightIcon from '../../../../public/GoRightIcon.svg';
import { TagContainerProps } from '@/types/tag';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperLeftButton from '../../../../public/SwiperLeftBtn.svg';
import SwiperRightButton from '../../../../public/SwiperRightBtn.svg';
import { useUserStore } from '@/store/useUserStore'; // Zustand 전역 상태 사용
import { fetchRecommendBoard } from '@/services/board/get/getRecBoard';
import { AirSVG, BusSVG, BycicleSVG, CarSVG, TrainSVG } from '@/components/transportsvg/home';
import { colorTicket } from '@/types/board';
import SkeletonRecommendOotdPost from '../ootd/SkeletonRecommendOotdPost';
import SkeletonRecBoard from './SkeletonRecBoard';
import heartImg from "../../../../public/heartedIcon.svg";
import nonheartImg from "../../../../public/heartIcon-default.svg";
import moment from "../../../../public/commentIcon-default.svg";

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


const RecommendBoard = () => {
    // Zustand에서 유저 정보와 로딩 상태를 가져옵니다
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
    const [showSkeleton, setShowSkeleton] = useState(true);

    const { data, isLoading, error } = useQuery(['recommendOotdPost', selectedInterest], () => fetchRecommendBoard(selectedInterest), {
        keepPreviousData: true,
    });
    console.log(data, selectedInterest)
    const totalCount = data?.result?.totalCnt;



    // 사용자 정보에서 관심사 가져오기
    const fetchUserInterests = async () => {
        try {
            const userInterests = userInfo?.koreanInterestedTypes || []; // 유저의 관심사 추출
            const userName = userInfo?.nickName;
            setUserName(userName);

            if (userInterests.length > 0) {
                setFilteredInterests(blogInterests.filter(interest => userInterests.includes(interest))); // 관심사로 필터링
                setSelectedInterest(userInterests[0]); // 유저의 첫 번째 관심사로 설정
            } else {
                setSelectedInterest(blogInterests[0]); // 유저가 관심사를 설정하지 않았으면 기본값 유지
            }
        } catch (error) {
            console.error('Error fetching user interests:', error);
        }
    };

    useEffect(() => {
        if (userInfo) {
            fetchLikedPosts().then(setLikedPosts);
            fetchUserInterests(); // 관심사 정보 가져오기
        }
    }, [userInfo]);

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


    useEffect(() => {
        if (typeof window !== 'undefined') { // 클라이언트에서만 실행되도록 체크
            const delay = setTimeout(() => {
                setShowSkeleton(false);
            }, 1000); // 스켈레톤을 1초 동안 유지

            return () => clearTimeout(delay);
        }
    }, [isLoading]);

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
        router.push(`/board/${id}`);
    };

    const handleWriteBtnClick = () => {
        if (!userInfo) {
            router.push("/login");
        } else {
            router.push('/post');
        }
    };

    const handleGoEditPage = () => {
        router.push("/editProfile");
    };

    // 로딩 시에는 null을 반환
    // if (loading || isLoading) return null;
    if (error) return null;

    console.log(data)
    // 데이터 슬라이드 생성
    const slides = [];
    if (data?.result?.ootdList) {
        for (let i = 0; i < data.result.ootdList.length; i += itemsPerSlide) {
            slides.push(data.result.ootdList.slice(i, i + itemsPerSlide));
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



    if (loading || showSkeleton || isLoading) {
        return <SkeletonRecBoard />;
    }

    return (
        <div className="relative w-[90%] sm-700:w-[66%] mx-auto mt-[5rem] overflow-visible">
            {!userInfo && (
                <h1 className="font-bold text-[2rem] mb-4">
                    트리피의 인기 게시글을 만나보세요
                </h1>
            )}
            {userInfo && (
                <h1 className="font-bold text-[2rem] mb-4">
                    {userName}님을 위해 준비한{" "}
                    <span className="block md:inline">맞춤 추천 포스트</span>
                </h1>
            )}


            <div className="flex items-center my-12 relative">
                {!userInfo && (
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

                        {userInfo && (
                            <div className='flex mr-auto mt-[10px] sm-700:ml-auto sm-700:mt-0' onClick={handleGoEditPage}>
                                <div className="text-right text-[#9d9d9d]">관심 키워드 설정</div>
                                <Image
                                    src={RightIcon}
                                    alt="keyword"
                                    width={14}
                                    height={14}
                                />
                                <div />
                            </div>
                        )}
                    </div>
                </div>
                {!userInfo && (
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
                    {data?.result?.postList?.length > 0 ? (
                        data.result.postList.map((item: any) => {
                            const getTextFromHtml = (html: any) => {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');
                                return doc.body.innerText; // 텍스트만 반환
                            };

                            const bodyText = getTextFromHtml(item.post.body);

                            const getTransportImage = (transport: string, ticketColor: any) => {
                                switch (transport) {
                                    case 'Airplane':
                                        return <AirSVG fillColor={colorTicket[ticketColor]} />;
                                    case 'Car':
                                        return <CarSVG fillColor={colorTicket[ticketColor]} />;
                                    case 'Bus':
                                        return <BusSVG fillColor={colorTicket[ticketColor]} />;
                                    case 'Bicycle':
                                        return <BycicleSVG fillColor={colorTicket[ticketColor]} />;
                                    case 'Train':
                                        return <TrainSVG fillColor={colorTicket[ticketColor]} />;
                                    default:
                                        return null; // 기본값 또는 대체 이미지
                                }
                            };
                            console.log(item)
                            return (
                                <SwiperSlide key={item.post.id} className="flex flex-col w-full  cursor-pointer relative shadowall1 rounded-xl mb-[3rem]">
                                    <div onClick={() => handleOotdItemClick(item.post.id)}>
                                        {window.innerWidth < 500 && (
                                            <div className="flex absolute items-center mt-[1rem] pl-[2rem] pr-[1rem] z-10">
                                                <div className="relative w-[24px] h-[24px] object-cover">
                                                    <Image
                                                        src={item.member.profileUrl || DefaultImage}
                                                        alt="Profile"
                                                        objectFit="cover"
                                                        width={24}
                                                        height={24}
                                                        className="rounded-[4.5rem] w-[2.4rem] h-[2.4rem]"
                                                    />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <span className="text-white font-normal text-[1.4rem] font-['Pretendard'] ml-[5px] overflow-hidden text-ellipsis whitespace-nowrap" style={{
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>{item.member.nickName}</span>
                                                </div>
                                            </div>
                                        )}
                                        {/* {item.post.images.length > 0 && ( */}
                                        {window.innerWidth < 500 ? (
                                            <div className={`relative w-full rounded-xl `} style={{ aspectRatio: '273 / 303' }}>
                                                <Image
                                                    className="absolute top-0 left-0 h-full object-cover rounded-xl filter brightness-90"
                                                    src={item.ticket.image?.accessUri}
                                                    alt="TICKET"
                                                    layout="fill"
                                                />
                                                <div className="absolute px-[1.7rem] flex-1 mt-[12rem]">
                                                    <h1 className="font-semibold text-[1.7rem] text-white font-medium theboki text-ellipsis overflow-hidden">{item.post.title}</h1>
                                                    <span className="font-normal text-[1.4rem] text-white font-normal text-ellipsis overflow-hidden theboki1">{bodyText}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`relative w-full rounded-xl ${colorTicket[item.ticket.ticketColor] ? `bg-[${colorTicket[item.ticket.ticketColor]}]` : ''}`} style={{ objectFit: 'cover', aspectRatio: '304 / 349', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                                <Image
                                                    className="rounded-xl w-[27rem] h-[30.9rem]"
                                                    src={item.ticket.image?.accessUri}
                                                    alt="TICKET"
                                                    width={270}
                                                    height={309}
                                                    style={{ objectFit: 'cover' }} // 고정된 크기를 설정합니다.
                                                />
                                            </div>
                                        )}

                                        {/* )} */}
                                        <div className={`w-full flex font-extrabold font-akira mx-auto justify-center items-center `}>
                                            {item.ticket.departureCode && (
                                                <>
                                                    <span className={`text-[1.4rem] 2xl:text-[3.2rem] xl:text-[2.2rem] lg:text-[1.6rem] md:text-[1.4rem] ${window.innerWidth < 500 ? 'hidden' : ''}`}>{item.ticket.departureCode}</span>
                                                    <div className={`mx-[0.5rem] ${window.innerWidth < 500 ? 'hidden' : ''}`}>
                                                        {getTransportImage(item.ticket.transport, item.ticket.ticketColor)}
                                                    </div>
                                                    <span className={`2xl:text-[3.2rem] xl:text-[2.2rem] lg:text-[1.6rem] md:text-[1.4rem] text-[1.4rem] ${window.innerWidth < 500 ? 'hidden' : ''}`}>{item.ticket.destinationCode}</span>
                                                </>
                                            )}
                                        </div>
                                        {window.innerWidth > 500 ? (
                                            <div className="px-[1.7rem] flex-1">
                                                <h1 className="font-semibold text-[2.4rem] text-[#292929] theboki text-ellipsis overflow-hidden">{item.post.title}</h1>
                                                <span className="font-normal text-[2rem] text-[#6B6B6B] text-ellipsis overflow-hidden theboki">{bodyText}</span>
                                            </div>
                                        ) : (
                                            <>
                                            </>
                                        )}

                                        {/* <TagContainer item={item} /> */}
                                        <div className={`pb-4 ${window.innerWidth < 500 ? 'hidden' : ''}`}>
                                            <div className="w-full flex items-center">
                                                <div className="flex items-center pl-[2rem] pr-[1rem]">
                                                    <div className="relative w-[24px] h-[24px]">
                                                        <Image
                                                            src={item.member.profileUrl || DefaultImage}
                                                            alt="Profile"
                                                            objectFit="cover"
                                                            width={24}
                                                            height={24}
                                                            className="rounded-[4.5rem] w-[2.4rem] h-[2.4rem]"
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
                                                <div className="flex items-center text-[#9D9D9D] w-full mr-[1rem] justify-end">
                                                    {item.post.isLiked ? (
                                                        <Image src={heartImg} alt='' width={24} height={24} />
                                                    ) : (
                                                        <Image src={nonheartImg} alt='' width={24} height={24} />
                                                    )}
                                                    <span className="text-[1.6rem] font-normal ml-[0.7rem]">{item.post.likeCount}</span>
                                                    <Image className='ml-[1rem]' src={moment} alt='' width={24} height={24} />
                                                    <span className="text-[1.6rem] font-normal ml-[0.7rem]">{item.post.commentCount}</span>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </SwiperSlide>
                            )
                        })
                    ) : (
                        <div className="h-full flex flex-col text-[2rem] text-neutral-900 dark:text-white  my-auto items-center justify-center font-medium font-['Pretendard'] py-[50px]">

                            <div className='flex flex-row'>
                                <span className="text-[#FB3463]">{selectedInterest} </span>{"\u00A0"}관련 게시글이 없어요!
                            </div>
                            <div className='bg-btn-color text-white text-2xl rounded-[8px] font-semibold mt-[20px] px-8 py-4 cursor-pointer' onClick={handleWriteBtnClick}>
                                티켓 게시글 작성하러 가기
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

export default RecommendBoard;