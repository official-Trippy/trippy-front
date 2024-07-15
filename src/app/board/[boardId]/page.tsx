"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import uploadImages from '@/dummy/uploadfile.svg'
import air from '@/dummy/air.svg'
import dummys from "@/dummy/dummys.svg"
import plused from "@/dummy/plus.svg"
import dummysed from "@/dummy/dummysed.svg"
import { useRouter, useSearchParams, useServerInsertedHTML } from 'next/navigation';
import Header from '@/components/shared/header/Header';
import { useQuery } from 'react-query';
import { getPost } from '@/services/board/get/getBoard';
import heartImg from "@/dummy/heart.svg"
import nonheartImg from "@/dummy/heartbin.svg"
import bottomimg from "@/dummy/sebu.svg"
import moment from "@/dummy/moment.svg"
import postBoardBookMark from '@/services/board/post/postBoardBookmark';
import { MemberInfo } from '@/services/auth';
import Cookies from 'js-cookie';
import postComments from '@/services/board/post/postComment';
import getBoardComment from '@/services/board/get/getBoardComment';

export default function BoardPage({ params }: { params: { boardId: number } }) {
    const accessToken = Cookies.get("accessToken");
    const router = useRouter();
    const searchParams = useSearchParams();
    const [comment, setComment] = useState('');

    const { data: postData } = useQuery({
        queryKey: ['postData'],
        queryFn: () => getPost(Number(params.boardId))
    })

    const { data: postCommentData, refetch: commentRefetch } = useQuery({
        queryKey: ['postCommentData'],
        queryFn: () => getBoardComment(Number(params.boardId))
    })

    const {
        data: memberDatas,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["member", accessToken],
        queryFn: () => MemberInfo(accessToken),
        onError: (error) => {
            // 에러 처리 로직
            console.error(error);
        },
    });

    console.log(postData)

    function formatDate(dateString: any) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }
    const createdAt = postData?.result.post.createDateTime;
    const formattedDate = formatDate(createdAt);

    const bookMarkHandler = async () => {
        const memberData = {
            memberId: memberDatas?.result.email,
            postId: Number(params.boardId),
        }
        try {
            console.log(memberData)
            await postBoardBookMark(memberData);
        } catch (e) {

        }
    }

    const commentHandler = async () => {
        const commentData = {
            postId: Number(params.boardId),
            content: comment,
            status: "PUBLIC"
        }
        try {
            console.log(commentData)
            await postComments(commentData);
            setComment('');
            commentRefetch();
        } catch (e) {

        }
    }
    console.log(postCommentData)
    return (
        <div>
            <Header />
            <div className='w-[80%] mx-auto'>
                <div className='mt-[8rem] text-[#6B6B6B] font-semibold text-[2rem]'>
                    <span>{postData?.result.member.blogName}의 블로그</span>
                </div>
                <div className='flex items-center mt-[5rem]'>
                    <h1 className='text-[3.6rem] font-bold'>{postData?.result.post.title}</h1>
                </div>
                <div className='w-full h-[32rem] border border-[#D9D9D9] rounded-[1rem] flex mt-[2rem]'>
                    <div className={`w-[15.4rem] h-full bg-[#55FBAF] rounded-l-[1rem]`}></div>
                    <div className='w-full mt-[5rem] relative'>
                        <div className='flex justify-center'>
                            <div>
                                <h1 className='text-[6rem] font-extrabold'>KOR</h1>
                                <div className='w-[16rem] h-[3.6rem] pl-[2rem] rounded-[0.8rem] flex'>
                                    <span className='text-[#9D9D9D] text-[2.4rem] font-semibold'>{postData?.result.ticket.departure}</span>
                                </div>
                            </div>
                            <div className='relative flex items-center bg-white z-10 mx-[5rem]'>
                                <Image className='' src={air} alt='비행기' />
                            </div>
                            <div className='ml-[5rem]'>
                                <h1 className='text-[6rem] font-extrabold'>KOR</h1>
                                <div className='w-[16rem] h-[3.6rem] pl-[2rem] rounded-[0.8rem] flex'>
                                    <span className='text-[#9D9D9D] text-[2.4rem] font-semibold'>{postData?.result.ticket.destination}</span>
                                </div>
                            </div>
                        </div>
                        <div className='w-[95%] border-2 border-dashed border-[#CFCFCF] my-[4rem] mx-auto relative z-0' />
                        <div className={`flex justify-center text-[1.4rem] font-extrabold text-[#55FBAF]`}>
                            <span className='w-[16rem]'>PASSENGER</span>
                            <span className='w-[25rem]'>DATE</span>
                            <span className='w-[8rem]'>GROUP</span>
                        </div>
                        <div className={`flex justify-center text-[1.4rem] font-extrabold text-[#6B6B6B]`}>
                            <span className='w-[16rem]'>USERID</span>
                            <span className='w-[25rem]'>{postData?.result.ticket.startDate} ~ {postData?.result.ticket.endDate}</span>
                            <span className='w-[8rem]'>{postData?.result.ticket.memberNum}</span>
                        </div>
                    </div>
                    <div className={`w-[60rem] h-full bg-[#55FBAF] rounded-r-[1rem] ml-auto`}>
                        <div className='absolute'>
                            <div className='relative bg-white w-[4rem] h-[4rem] rounded-full -mt-[2rem] -ml-[2rem]'></div>
                            <div className='relative bg-white w-[4rem] h-[4rem] rounded-full mt-[28rem] -ml-[2rem]'></div>
                        </div>
                        <label className='w-full h-full flex' htmlFor='input-file'>
                            <div className='flex flex-col m-auto'>
                                <Image className='w-[23rem] h-[26rem] rounded-[1rem]' src={postData?.result.ticket.image.accessUri} alt='' width={230} height={260} />
                            </div>
                        </label>
                    </div>
                </div>
                <div className='mt-[5rem] border-b border-[#CFCFCF] py-[2rem]'>
                    <div className='flex w-full'>
                        <Image src={postData?.result.member.profileUrl} alt='' width={60} height={60} />
                        <div className='flex flex-col text-[2rem] ml-[2rem]' >
                            <span className='font-medium text-black'>{postData?.result.member.nickName}</span>
                            <span className='text-[#9D9D9D] font-normal'>{formattedDate}</span>
                        </div>
                        <div className='ml-auto flex items-center'>
                            <button className='bg-[#FB3463] text-white text-[1.6rem] p-[0.8rem] rounded-[1rem]'>팔로우</button>
                            <div className='ml-[4rem] flex'>
                                <Image src={plused} alt='' />
                                <span className='text-[#9D9D9D] text-[1.6rem]'>136</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='py-[5rem] h-[100rem]'>
                    {postData?.result.post.images?.map((image: any, index: number) => (
                        <Image src={image.accessUri} alt='' key={index} width={900} height={900} />
                    ))}
                    <span className='text-[1.6rem] font-medium'>{postData?.result.post.body}</span>
                </div>
                {/* 댓글기능 */}
                <div className='w-full h-[7.5rem] mt-[8rem] flex items-center'>
                    {/* <Image src={heartImg} alt='' width={24} height={24} onClick={bookMarkHandler} /> */}
                    <Image src={nonheartImg} alt='' width={24} height={24} onClick={bookMarkHandler} />
                    <span className='text-[1.6rem] font-normal text-[#6B6B6B]'>{postData?.result.post.likeCount}</span>
                    <Image src={bottomimg} alt='' width={24} height={24} />
                    <Image className='ml-[2rem]' src={moment} alt='' width={24} height={24} />
                    <span className='text-[1.6rem] font-normal text-[#6B6B6B]'>{postData?.result.post.commentCount}</span>
                    <Image src={bottomimg} alt='' width={24} height={24} />
                </div>
                <div className='w-full h-[9.3rem] shadowall pl-[1.7rem] pt-[1.4rem] flex'>
                    <div className='w-full'>
                        <div className='flex items-center'>
                            <Image className='flex items-center' src={postData?.result.member.profileUrl} alt='' width={28} height={28} />
                            <span className='ml-[1.4rem] text-[1.8rem] font-semibold flex items-center'>{postData?.result.member.nickName}</span>
                        </div>
                        <input className='w-full outline-none ml-[4.5rem] text-[1.4rem] font-normal' type='text' value={comment} onChange={(e) => setComment(e.target.value)} placeholder='블로그가 훈훈해지는 댓글 부탁드립니다.' />
                    </div>
                    <button className='bg-[#F5F5F5] rounded-[0.8rem] text-[1.6rem] font-semibold w-[8.6rem] h-[3.5rem] flex ml-auto mr-[1.4rem] items-center justify-center' onClick={commentHandler}>입력</button>
                </div>
                <div className='w-full h-full shadowall pl-[1.7rem] py-[1.4rem] my-[3.5rem] flex flex-col'>
                    {postCommentData?.result && Object.entries(postCommentData.result).map(([key, coData]: [string, any], index: number) => {
                        const createDateTime = new Date(coData.createDateTime);
                        const formattedDateTime = `${createDateTime.getFullYear()}.${String(createDateTime.getMonth() + 1).padStart(2, '0')}.${String(createDateTime.getDate()).padStart(2, '0')} ${String(createDateTime.getHours()).padStart(2, '0')}:${String(createDateTime.getMinutes()).padStart(2, '0')}`;

                        return (
                            <div className='mb-[2.5rem]' key={key}>
                                <div className='flex items-center'>
                                    <Image className='flex items-center' src={coData.member.profileUrl} alt='' width={28} height={28} />
                                    <span className='ml-[1.4rem] text-[1.8rem] font-semibold flex items-center'>{coData.member.nickName}</span>
                                </div>
                                <span className='text-[1.4rem] font-normal ml-[4.4rem] text-[#292929]'>{coData.content}</span>
                                <div className='flex ml-[4.5rem] text-[1.2rem] text-[#9D9D9D] items-center'>
                                    <span>{formattedDateTime}</span>
                                    <hr className='mx-[1rem] h-[1rem] w-[0.1rem] bg-[#9D9D9D]' />
                                    <span>답글달기</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}
