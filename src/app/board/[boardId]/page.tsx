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

export default function BoardPage({ params }: { params: { boardId: number } }) {
    const router = useRouter();
    const searchParams = useSearchParams();



    const { data: postData } = useQuery({
        queryKey: ['postData'],
        queryFn: () => getPost(Number(params.boardId))
    })
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

    return (
        <div>
            <Header />
            <div className='w-[80%] mx-auto'>
                <div className='mt-[8rem] text-[#6B6B6B] font-semibold text-[2rem]'>
                    <span>{postData?.result.post.nickName}의 블로그</span>
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
                                <Image className='w-[30rem] h-[25rem] rounded-[1rem]' src={dummysed} alt='' />
                            </div>


                        </label>
                    </div>
                </div>
                <div className='mt-[5rem] border-b border-[#CFCFCF] py-[2rem]'>
                    <div className='flex w-full'>
                        <Image src={dummys} alt='' />
                        <div className='flex flex-col text-[2rem] ml-[2rem]' >
                            <span className='font-medium text-black'>{postData?.result.post.nickName}</span>
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
                    <Image src={dummysed} alt='' />
                    여기에다가 내용데이터를 넣을 예정입니다 ㅅㅂ
                </div>
            </div>

        </div>
    )
}
