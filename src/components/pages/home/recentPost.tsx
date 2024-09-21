import Image from 'next/image';
import React, { ReactNode, useState } from 'react'
import Link from "next/link";
import nonheartImg from "@/dummy/heartbin.svg"
import heartImg from "@/dummy/heart.svg";
import moment from "@/dummy/moment.svg"
import { useQuery } from 'react-query';
import { getAllBoardCount, getFollowBoard } from '@/services/board/get/getBoard';
import DefaultImage from '../../../../public/defaultImage.svg';

interface HomeRecentProps {
    allPosts: number;
    setAllPosts: any;
    boardData: any;
    userInfo: any;
    boardRefetch: any;
    PAGE_SIZE: any;
    pages: number;
    setPages: any;
}


function RecentPost({ allPosts, setAllPosts, boardData, userInfo, boardRefetch, PAGE_SIZE, pages, setPages }: HomeRecentProps) {
    const [sortOrder, setSortOrder] = useState('최신순');
    // const [sortOrders, setSortOrders] = useState('최신순');
    const memberIds = userInfo && userInfo?.memberId;


    const { data: followData } = useQuery({
        queryKey: ['followData'],
        queryFn: () => getFollowBoard(memberIds)
    })


    const sortedPosts = () => {
        if (!boardData || !boardData.result) return [];

        return boardData.result.sort((a: any, b: any) => {
            if (sortOrder === '조회순') {
                return b.post.viewCount - a.post.viewCount; // 조회순
            } else if (sortOrder === '인기순') {
                return b.post.likeCount - a.post.likeCount; // 인기순
            } else {
                const dateA = new Date(a.post.createDateTime).getTime();
                const dateB = new Date(b.post.createDateTime).getTime();
                return dateB - dateA; // 최신순
            }
        });
    };

    const filteredBoardData = boardData?.result.filter((post: any) => {
        return followData?.result.followings.some((following: any) => {
            return following.memberId === post.member.memberId;
        });
    });

    const sortedFollowPosts = () => {
        if (!filteredBoardData) return [];

        return filteredBoardData?.sort((a: any, b: any) => {
            if (sortOrder === '조회순') {
                return b.post.viewCount - a.post.viewCount; // 조회순
            } else if (sortOrder === '인기순') {
                return b.post.likeCount - a.post.likeCount; // 인기순
            } else {
                const dateA = new Date(a.post.createDateTime).getTime();
                const dateB = new Date(b.post.createDateTime).getTime();
                return dateB - dateA; // 최신순
            }
        });
    };

    function formatDate(dateString: any) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }

    console.log(sortedFollowPosts())

    const { data: boardCountData } = useQuery({
        queryKey: ['boardCountData'],
        queryFn: () => getAllBoardCount()
    })

    const totalPages = boardCountData ? Math.ceil(boardCountData / PAGE_SIZE) : 0;


    const handlePageClick = (pageIndex: number) => {
        setPages(pageIndex);
        setTimeout(() => {
            boardRefetch();
        }, 100)
    };


    return (
        <div className='w-[66%] mx-auto py-[5rem]'>
            <div>
                <h1 className='font-bold text-[2rem]'>최신 포스트</h1>
                <div className='flex text-[1.6rem] pt-[5rem] px-[1rem]'>
                    <span className={`px-[2rem] cursor-pointer transition-all duration-300 ${allPosts === 0 ? "font-bold border-b-2 border-black" : ""}`} onClick={() => setAllPosts(0)}>전체글</span>
                    <span className={`px-[2rem] cursor-pointer transition-all duration-300 ${allPosts === 1 ? "font-bold border-b-2 border-black" : ""}`} onClick={() => setAllPosts(1)}>팔로잉</span>
                    <select
                        className='flex w-[8rem] h-[3rem] ml-auto font-medium selectshadow'
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value='최신순'>최신순</option>
                        <option value='조회순'>조회순</option>
                        <option value='인기순'>인기순</option>
                    </select>
                </div>
            </div>
            {allPosts === 0 ? (
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-1 2xl:grid-cols-2 gap-x-[8rem] gap-y-[5.3rem] mt-[5rem]">
                        {sortedPosts().map((posts: any, index: number) => {
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
                                <Link
                                    href={`/board/${BoardId}`}
                                    className="h-[20rem] shadowall rounded-[1rem] px-[1.6rem] py-[2rem] hover:-translate-y-4 duration-300 cursor-pointer"
                                    key={index}
                                >
                                    <div className="flex w-full">
                                        <Image className="w-[17rem] h-[17rem] rounded-[0.8rem]" src={posts.ticket.image.accessUri} alt="" width={170} height={170} />
                                        <div className='flex flex-col w-full ml-[2.5rem]'>
                                            <h1 className="text-[2rem] font-medium text-ellipsis overflow-hidden">{posts.post.title}</h1>
                                            <span className="text-[1.6rem] mt-[0.4rem] h-[5rem] font-normal text-[#6B6B6B] text-ellipsis overflow-hidden">{bodyText}</span>
                                            <div className="flex flex-wrap text-ellipsis overflow-hidden">
                                                {posts?.post.tags.map((tagData: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="w-fit px-[0.8rem] py-[0.4rem] mt-[1.2rem] mr-[0.5rem] bg-[#F5F5F5] text-[1.3rem] text-[#9d9d9d] rounded-[1.6rem] text-ellipsis overflow-hidden"
                                                    >
                                                        {tagData}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex mt-[2rem]">
                                                <div className="flex h-full text-[1.4rem] font-normal space-x-4 items-end mt-auto">
                                                    <Image src={posts.member.profileUrl || DefaultImage} width={24} height={24} alt="" />
                                                    <span className="">{posts.member.nickName}</span>
                                                    {/* <span className="">{formattedDate}</span> */}
                                                </div>
                                                <div className="flex items-end text-[#9D9D9D] ml-auto">
                                                    {posts.post.isLiked ? (
                                                        <Image src={heartImg} alt='' width={24} height={24} />
                                                    ) : (
                                                        <Image src={nonheartImg} alt='' width={24} height={24} />
                                                    )}
                                                    <span className="text-[1rem] font-normal ml-auto">{posts.post.likeCount}</span>
                                                    <Image className='ml-[1rem]' src={moment} alt='' width={24} height={24} />
                                                    <span className="text-[1rem] font-normal">{posts.post.commentCount}</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </Link>
                            );
                        })}
                    </div>
                    <div className="flex w-full justify-center my-16">
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
                <div className="grid grid-cols-1 lg:grid-cols-1 2xl:grid-cols-2 gap-x-[8rem] gap-y-[5.3rem] mt-[5rem]">
                    {sortedFollowPosts().map((posts: any, index: number) => {
                        const BoardId = posts.post.id;

                        const createdAt = posts.post.createDateTime;
                        const formattedDate = formatDate(createdAt);

                        return (
                            <Link
                                href={`/board/${BoardId}`}
                                className="h-[20rem] shadowall rounded-[1rem] px-[1.6rem] py-[2rem] hover:-translate-y-4 duration-300 cursor-pointer"
                                key={index}
                            >
                                <div className="flex w-full">
                                    <Image className="w-[17rem] h-[17rem] rounded-[0.8rem]" src={posts.ticket.image.accessUri} alt="" width={170} height={170} />
                                    <div className='flex flex-col w-full ml-[2.5rem]'>
                                        <h1 className="text-[2rem] font-medium text-ellipsis overflow-hidden">{posts.post.title}</h1>
                                        <span className="text-[1.6rem] mt-[0.4rem] h-[5rem] font-normal text-[#6B6B6B] text-ellipsis overflow-hidden">{posts.post.body}</span>
                                        <div className="flex flex-wrap text-ellipsis overflow-hidden">
                                            {posts?.post.tags.map((tagData: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="w-fit px-[0.8rem] py-[0.4rem] mt-[1.2rem] mr-[0.5rem] bg-[#F5F5F5] text-[1.3rem] text-[#9d9d9d] rounded-[1.6rem] text-ellipsis overflow-hidden"
                                                >
                                                    {tagData}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex mt-[2rem]">
                                            <div className="flex h-full text-[1.4rem] font-normal space-x-4 items-end mt-auto">
                                                <Image src={posts.member.profileUrl || DefaultImage} width={24} height={24} alt="" />
                                                <span className="">{posts.member.nickName}</span>
                                                <span className="">{formattedDate}</span>
                                            </div>
                                            <div className="flex items-end text-[#9D9D9D] ml-auto">
                                                {posts.post.isLiked ? (
                                                    <Image src={heartImg} alt='' width={24} height={24} />
                                                ) : (
                                                    <Image src={nonheartImg} alt='' width={24} height={24} />
                                                )}
                                                <span className="text-[1rem] font-normal ml-auto">{posts.post.likeCount}</span>
                                                <Image className='ml-[1rem]' src={moment} alt='' width={24} height={24} />
                                                <span className="text-[1rem] font-normal">{posts.post.commentCount}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default RecentPost