'use client'
import Recoootd from '@/components/pages/ootd/recoootd'
import Image from 'next/image'
import React from 'react'
import Profile from "../../../public/Profile.png"
import RecentOotdPost from '@/components/pages/ootd/RecentPost'
import { useQuery } from 'react-query'
import Cookies from 'js-cookie'
import { MemberInfo } from '@/services/auth'
import Header from '@/components/shared/header/Header'

function OotdPage() {

    const accessToken = Cookies.get('accessToken');

    const { data: memberData, error, isLoading } = useQuery({
        queryKey: ['member', accessToken],
        queryFn: () => MemberInfo(accessToken),
        onError: (error) => {
            // 에러 처리 로직
            console.error(error);
        }
    });

    return (
        <div>
            <Header />
            <Recoootd memberData={memberData} isLoading={isLoading}>
                <div className="w-[30rem] h-[40rem] shadow-xl rounded-[1rem]">
                    <div className="flex flex-col">
                        <img className="rounded-[1rem]" src="https://picsum.photos/300/200" alt="" />
                        <div className="p-[1rem] flex">
                            <Image src={Profile} width={40} height={40} alt="" />
                            <div className="flex flex-col justify-center pl-[1rem] text-[1.4rem]">
                                <span className="font-bold">닉네임</span>
                                <span className="font-medium">날짜</span>
                            </div>

                        </div>
                        <div className="px-[1rem]">
                            <h1 className="font-medium text-[2rem]">제목입니두우우</h1>
                            <span className="font-normal text-[1.2rem]">머시머시기</span>
                        </div>
                    </div>
                </div>
            </Recoootd>
            <RecentOotdPost isLoading={isLoading}>
                <div className="w-[25rem] h-[40rem] shadowall rounded-[0.8rem] mt-[5rem]  hover:-translate-y-4 duration-300">
                    <div className="flex flex-col w-full">
                        <img className="flex rounded-[0.8rem]" src="https://picsum.photos/120/120" alt="dd" />

                    </div>
                    <div className='px-[1.6rem] py-[2rem]'>
                        <div className="flex">
                            <div className="flex w-full h-full text-[1.4rem] font-normal items-center">
                                <Image src={Profile} width={24} height={24} alt="" />
                                <span className=" text-[#6B6B6B]">닉네임</span>
                                <span className="flex ml-auto">날짜</span>
                            </div>
                        </div>
                        <div className="flex flex-col mt-[1.6rem]">
                            <div className="flex flex-col w-[150%]">
                                <h1 className="text-[1.2rem] font-medium text-[#6B6B6B]">제목</h1>
                            </div>
                            <div className='flex mt-[2rem]'>
                                <span className="w-fit px-[0.8rem] py-[0.4rem] bg-[#F5F5F5] text-[1.3rem] text-[#9d9d9d] items-center rounded-[1.6rem]">태그</span>
                                <div className="ml-auto flex items-center">
                                    <span>하트</span>
                                    <span>0</span>
                                    <span>댓글</span>
                                    <span>0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </RecentOotdPost>
        </div>
    )
}

export default OotdPage