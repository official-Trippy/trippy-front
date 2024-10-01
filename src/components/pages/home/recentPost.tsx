import Image from 'next/image';
import React, { ReactNode, useEffect, useState, useTransition } from 'react'
import Link from "next/link";
import { useQuery } from 'react-query';
import { fetchFollowTicketPosts, getAllBoardCount, getBoardFollow, getFollowBoard } from '@/services/board/get/getBoard';
import DefaultImage from '../../../../public/defaultImage.svg';
import { useUserStore } from '@/store/useUserStore';
import SkeletonBoard from './SkeletonBoard';
import CustomSelect from '../ootd/CustomSelect';
import { useRouter } from 'next/navigation';
import heartImg from "../../../../public/heartedIcon.svg";
import nonheartImg from "../../../../public/heartIcon-default.svg";
import moment from "../../../../public/commentIcon-default.svg";

interface HomeRecentProps {
    allPosts: number;
    setAllPosts: any;
    boardData: any;
    boardRefetch: any;
    PAGE_SIZE: any;
    pages: number;
    setPages: any;
}


function RecentPost({ allPosts, setAllPosts, boardData, boardRefetch, PAGE_SIZE, pages, setPages }: HomeRecentProps) {
    const [page, setPage] = useState(0);
    // const [sortOrders, setSortOrders] = useState('최신순');
    const [isPending, startTransition] = useTransition();
    const [isClicked, setIsClicked] = useState(false);
    const { userInfo, loading } = useUserStore((state) => ({
        userInfo: state.userInfo,
        loading: state.loading,
    }));
    const [tab, setTab] = useState<"ALL" | "FOLLOWING" | null>(null);
    const [orderTypes, setOrderTypes] = useState("LATEST")
    const isTabInitialized = tab !== null;
    const memberIds = userInfo && userInfo?.memberId;
    const router = useRouter();

    const { data: followData } = useQuery({
        queryKey: ['followData'],
        queryFn: () => getFollowBoard(memberIds)
    })

    const { data: boardCountData, isLoading: allLoading } = useQuery({
        queryKey: ['boardCountData'],
        queryFn: () => getAllBoardCount()
    })

    const { data: followingData, isLoading: isFollowingLoading } = useQuery({
        queryKey: ['followDatas', page, orderTypes],
        queryFn: () => getBoardFollow(PAGE_SIZE, page, orderTypes)
    })

    const { data: followingPostsData, isLoading: isFollowingPostsLoading } =
        useQuery(
            ["followingOotdPosts", page, orderTypes],
            () => fetchFollowTicketPosts(page, PAGE_SIZE, orderTypes),
            {
                enabled: tab === "FOLLOWING" && isTabInitialized,
            }
        );

    const ticketList =
        tab === "ALL"
            ? followingData?.result || []
            : followingPostsData?.result || [];
    const isLoading =
        allLoading ||
        (tab === "ALL" ? isFollowingLoading : isFollowingPostsLoading);


    console.log(followingData, followingPostsData)

    function formatDate(dateString: any) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day}`;
    }

    const isGuest = userInfo?.role === "GUEST";



    const totalPages = boardCountData ? Math.ceil(boardCountData / PAGE_SIZE) : 0;


    const handlePageClick = (pageIndex: number) => {
        setPages(pageIndex);
        setTimeout(() => {
            boardRefetch();
        }, 100)
    };

    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTab = sessionStorage.getItem("tab");
            if (!userInfo) {
                setTab("ALL"); // 유저 정보가 없으면 무조건 'ALL'로 설정
            } else if (savedTab) {
                setTab(savedTab as "ALL" | "FOLLOWING");
            } else {
                setTab(!isGuest ? "ALL" : "FOLLOWING");
            }
        }
    }, [userInfo]);

    useEffect(() => {
        if (typeof window !== 'undefined') { // 클라이언트에서만 실행되도록 체크
            const delay = setTimeout(() => {
                setShowSkeleton(false);
            }, 1000); // 스켈레톤을 1초 동안 유지

            return () => clearTimeout(delay);
        }
    }, [loading]);

    if (loading || showSkeleton || isFollowingLoading) {
        return <SkeletonBoard />;
    };

    const handleLogin = () => {
        router.push("/login");
    };

    const handleBoardPage = (id: number) => {
        router.push(`/board/${id}`)
    }

    const handleTabChange = (newTab: "ALL" | "FOLLOWING") => {
        startTransition(() => {
            setTab(newTab);
            setPage(0);
        });
    };
    const handleOrderTypeChange = (value: string) => {
        setOrderTypes(value);
        setPage(0);
    };
    console.log(followingData)
    return (
        <div className='w-[90%] sm-700:w-[66%] mx-auto py-[5rem]'>
            <div>
                <h1 className='font-bold text-[2rem]'>트리피의 다양한 여정을 함께 해보세요!</h1>
                <div className='flex text-[1.6rem] pt-[5rem] px-[1rem]'>
                    {userInfo && (
                        <span
                            className={`pr-[1rem] cursor-pointer ${tab === "ALL" ? "font-bold text-[#fa3463]" : ""}`}
                            onClick={() => handleTabChange("ALL")}
                        >
                            전체글
                        </span>
                    )}
                    {userInfo && (
                        <span
                            className={`px-[1rem] cursor-pointer ${tab === "FOLLOWING" ? "font-bold text-[#fa3463]" : ""}`}
                            onClick={() => handleTabChange("FOLLOWING")}
                        >
                            팔로잉
                        </span>
                    )}
                    <div className="ml-auto">
                        <CustomSelect
                            orderType={orderTypes}
                            onOrderTypeChange={handleOrderTypeChange}
                        />
                    </div>
                </div>
            </div>
            {ticketList.length > 0 ? (
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-1 2xl:grid-cols-2 gap-x-[8rem] gap-y-[5.3rem]">
                        {ticketList?.map((posts: any, index: number) => {
                            const BoardId = posts.post.id;


                            const createdAt = posts.post.createDateTime;
                            const formattedDate = formatDate(createdAt);

                            const getTextFromHtml = (html: any) => {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');
                                return doc.body.innerText; // 텍스트만 반환
                            };

                            const bodyText = getTextFromHtml(posts.post.body);

                            return (
                                <div
                                    className="lg:h-[20rem] md:h-[27rem] h-[27rem] rounded-[1rem] px-[1.6rem] py-[2rem] cursor-pointer mt-[1.5rem]"
                                    key={index}
                                    onClick={() => handleBoardPage(BoardId)}
                                >
                                    {window.innerWidth > 500 ? (
                                        <div className="flex w-full">
                                            <div className='w-[25rem]'>
                                                <Image className="w-[25rem] h-[17rem] rounded-[0.8rem] object-cover object-center" src={posts.ticket.image.accessUri} alt="" width={170} height={170} />
                                            </div>
                                            <div className='flex flex-col w-full ml-[2.5rem]'>
                                                <h1 className="text-[2rem] font-medium text-ellipsis overflow-hidden theboki font-['Pretendard']">{posts.post.title}</h1>
                                                <span className="text-[1.6rem] mt-[0.4rem] h-[5rem] font-normal text-[#6B6B6B] text-ellipsis overflow-hidden theboki1 font-['Pretendard']">{bodyText}</span>
                                                <div className="flex items-center overflow-hidden whitespace-nowrap">
                                                    {posts?.post.tags.map((tagData: string, index: number) => (
                                                        <span
                                                            key={index}
                                                            className={`w-fit px-[0.8rem] py-[0.4rem] mt-[1.2rem] mr-[0.5rem] bg-[#F5F5F5] text-[1.3rem] text-[#9d9d9d] rounded-[1.6rem] text-ellipsis overflow-hidden ${index > 0 ? 'hidden xl:block' : ''}`}
                                                        >
                                                            {tagData}
                                                        </span>
                                                    ))}
                                                    {posts?.post.tags.length > 2 && (
                                                        <span className="text-ellipsis overflow-hidden whitespace-nowrap">...</span>
                                                    )}
                                                </div>
                                                <div className="flex mt-[2rem]">
                                                    <div className="flex h-full text-[1.4rem] font-normal space-x-4 items-end mt-auto xl:appearance-none">
                                                        <Image
                                                            src={posts.member.profileUrl || DefaultImage}
                                                            width={24}
                                                            height={24}
                                                            alt=""
                                                            className="hidden md:block rounded-[4.5rem] w-[2.4rem] h-[2.4rem]" // 500px 이상에서만 보이도록 설정
                                                        />
                                                        <span className={`hidden md:block font-['Pretendard']`}>{posts.member.nickName}</span>
                                                        {/* <span className="">{formattedDate}</span> */}
                                                    </div>
                                                    <div className="flex items-center text-[#9D9D9D] ml-auto">
                                                        {posts.post.isLiked ? (
                                                            <Image src={heartImg} alt='' width={24} height={24} />
                                                        ) : (
                                                            <Image src={nonheartImg} alt='' width={24} height={24} />
                                                        )}
                                                        <span className="text-[1rem] font-normal ml-[0.7rem]">{posts.post.likeCount}</span>
                                                        <Image className='ml-[1rem]' src={moment} alt='' width={24} height={24} />
                                                        <span className="text-[1rem] font-normal ml-[0.7rem]">{posts.post.commentCount}</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                        :
                                        (
                                            <div className="flex flex-col w-full rounded-[0.8rem] shadowall1">
                                                <div className="absolute h-full text-[1.4rem] font-normal space-x-4 items-end z-10">
                                                    <div className='flex p-[1.2rem] text-white'>
                                                        <Image
                                                            src={posts.member.profileUrl || DefaultImage}
                                                            width={45}
                                                            height={45}
                                                            alt=""
                                                            className="h-[4.5rem] rounded-[4.5rem]" // 500px 이상에서만 보이도록 설정
                                                        />
                                                        <div className='flex flex-col text-white ml-[1rem]'>
                                                            <span className={`text-[1.7rem] font-semibold`}>{posts.member.nickName}</span>
                                                            <span className="text-[1.2rem]">{formattedDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Image className="w-full h-[17rem] object-cover rounded-[0.8rem] filter brightness-75" src={posts.ticket.image.accessUri} alt="" width={170} height={170} />
                                                <div className='flex flex-col w-full  rounded-[0.8rem] pt-[1.6rem] px-[1.6rem]'>
                                                    <h1 className="text-[2rem] font-medium text-ellipsis overflow-hidden theboki">{posts.post.title}</h1>
                                                    <span className="text-[1.6rem] mt-[0.4rem] h-[5rem] font-normal text-[#6B6B6B] text-ellipsis overflow-hidden theboki1">{bodyText}</span>
                                                    <div className="flex flex-wrap text-ellipsis overflow-hidden theboki  pb-[1.6rem]">
                                                        {posts?.post.tags.map((tagData: string, index: number) => (
                                                            <span
                                                                key={index}
                                                                className={`w-fit px-[0.8rem] py-[0.4rem] mt-[1.2rem] mr-[0.5rem] bg-[#F5F5F5] text-[1.3rem] text-[#9d9d9d] rounded-[1.6rem] text-ellipsis overflow-hidden ${index > 0 ? 'hidden xl:block' : ''}`}
                                                            >
                                                                {tagData}
                                                            </span>
                                                        ))}
                                                        <div className="flex items-center text-[#9D9D9D] ml-auto">
                                                            {posts.post.isLiked ? (
                                                                <Image src={heartImg} alt='' width={24} height={24} />
                                                            ) : (
                                                                <Image src={nonheartImg} alt='' width={24} height={24} />
                                                            )}
                                                            <span className="flex items-center text-[1rem] font-normal ml-[0.7rem]">{posts.post.likeCount}</span>
                                                            <Image className='ml-[1rem]' src={moment} alt='' width={24} height={24} />
                                                            <span className="text-[1rem] font-normal ml-[0.7rem]">{posts.post.commentCount}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    }
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex w-full justify-center my-16 mt-[10rem]">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageClick(index)}
                                className={`mx-1 py-2 px-4 ${pages === index ? 'text-[#fa3463] font-semibold' : 'text-[#cfcfcf] font-normal'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col text-[2rem] text-neutral-900 dark:text-white  my-auto items-center justify-center font-medium font-['Pretendard'] py-[50px]">
                    {userInfo ? (
                        <div className="flex flex-row">
                            <span className="text-[#FB3463]">팔로우</span>한 유저의 TICKET이
                            없어요!
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-row">
                                <span className="text-neutral-900 dark:text-white ">
                                    트리피 로그인 후 팔로잉 게시글을 확인하세요!
                                </span>
                            </div>
                            <div
                                className="bg-btn-color text-white text-2xl rounded-[8px] font-semibold mt-[20px] px-8 py-4 cursor-pointer"
                                onClick={handleLogin}
                            >
                                TICKET 게시글 작성하러 가기
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default RecentPost