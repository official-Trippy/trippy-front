"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import uploadImages from '@/dummy/uploadfile.svg'
import air from '@/dummy/air.svg'
import dummys from "@/dummy/dummys.svg"
import plused from "@/dummy/plus.svg"
import dummysed from "@/dummy/dummysed.svg"
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/shared/header/Header';

export default function BoardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const boardId = searchParams.get('boardId');

    useEffect(() => {
        // 여기에 필요한 로직을 작성합니다.
    }, [boardId]);

    return (
        <div>
            <Header />
            <div className='w-[80%] mx-auto'>
                <div className='mt-[8rem] text-[#6B6B6B] font-semibold text-[2rem]'>
                    <span>누군가의 블로그</span>
                </div>
                <div className='flex items-center mt-[5rem]'>
                    <h1 className='text-[3.6rem] font-bold'>파리가서 빵만 먹고 온 썰 푼다</h1>
                </div>
                <div className='w-full h-[32rem] border border-[#D9D9D9] rounded-[1rem] flex mt-[2rem]'>
                    <div className={`w-[15.4rem] h-full bg-[#55FBAF] rounded-l-[1rem]`}></div>
                    <div className=' mt-[5rem] relative'>
                        <div className='flex ml-[15rem]'>
                            <div>
                                <h1 className='text-[6rem] font-extrabold'>KOR</h1>
                                <div className='w-[16rem] h-[3.6rem] pl-[2rem] rounded-[0.8rem] flex'>
                                    <span className='text-[#9D9D9D] text-[2.4rem] font-semibold'>SEOUL</span>
                                </div>
                            </div>
                            <div className='relative bg-white z-10 mx-[5rem]'>

                                <div
                                    className='w-[6rem] h-[6rem] absolute shadowall rounded-full flex items-center justify-center mt-[2rem]'
                                >
                                    <Image className='' src={air} alt='비행기' />
                                </div>

                            </div>
                            <div className='ml-[5rem]'>
                                <h1 className='text-[6rem] font-extrabold'>KOR</h1>
                                <div className='w-[16rem] h-[3.6rem] pl-[2rem] rounded-[0.8rem] flex'>
                                    <span className='text-[#9D9D9D] text-[2.4rem] font-semibold'>SEOUL</span>
                                </div>
                            </div>
                        </div>
                        <div className='border-2 border-dashed border-[#CFCFCF] w-[88rem] my-[4rem] ml-[3rem] relative z-0' />
                        <div className={`flex ml-[7rem] text-[1.4rem] font-extrabold text-[#55FBAF]`}>
                            <span className='w-[16rem]'>PASSENGER</span>
                            <span className='w-[25rem]'>DATE</span>
                            <span className='w-[8rem]'>GROUP</span>
                        </div>
                        <div className={`flex ml-[7rem] text-[1.4rem] font-extrabold text-[#6B6B6B]`}>
                            <span className='w-[16rem]'>USERID</span>
                            <span className='w-[25rem]'>2024. 07. 01~2024. 07. 03</span>
                            <span className='w-[8rem]'>4</span>
                        </div>
                    </div>
                    <div className={`w-full h-full bg-[#55FBAF] ml-[2rem] rounded-r-[1rem]`}>
                        <div className='absolute'>
                            <div className='relative bg-white w-[4rem] h-[4rem] rounded-full -mt-[2rem] -ml-[2rem]'></div>
                            <div className='relative bg-white w-[4rem] h-[4rem] rounded-full mt-[28rem] -ml-[2rem]'></div>
                        </div>
                        <label className='w-full h-full flex cursor-pointer' htmlFor='input-file'>
                            <div className='flex flex-col justify-center m-auto w-[40rem] h-[25rem] rounded-[1rem] '>
                                <Image className='mx-auto' src={dummysed} alt='' />
                            </div>


                        </label>
                    </div>
                </div>
                <div className='mt-[5rem] border-b border-[#CFCFCF] py-[2rem]'>
                    <div className='flex w-full'>
                        <Image src={dummys} alt='' />
                        <div className='flex flex-col text-[2rem] ml-[2rem]' >
                            <span className='font-medium text-black'>김준휘</span>
                            <span className='text-[#9D9D9D] font-normal'>날짜</span>
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
