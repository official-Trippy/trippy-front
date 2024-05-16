"use client"
import { loginState } from '@/atoms/user';
import React, { ReactNode } from 'react'
import { useRecoilValue } from 'recoil';
import Cookies from 'js-cookie';

interface HomeRecentProps {
    children: ReactNode;
}

function RecentOotdPost({ children }: HomeRecentProps) {
    const accessToken = Cookies.get('accessToken');

    return (
        <div className='w-[80%] mx-auto py-[5rem]'>

            <div className=''>
                {accessToken ? (
                    <h1 className='font-bold text-[2rem]'>최근 업로드 된 OOTD를 만나보세요</h1>
                ) : (
                    <h1 className='font-bold text-[2rem]'>트리피인들의 다양한 스타일을 만나보세요</h1>
                )
                }
                <div className='flex text-[1.6rem] pt-[5rem] px-[1rem]'>
                    <span className='pr-[1rem]'>팔로잉</span>
                    <span className='px-[1rem]'>전체글</span>
                    <select className='flex w-[8rem] h-[3rem] ml-auto font-medium selectshadow'>
                        <option>기본</option>
                        <option>최신순</option>
                        <option>날짜순</option>
                        <option>인기순</option>
                    </select>
                </div>
            </div>



            {children}
        </div>
    )
}

export default RecentOotdPost