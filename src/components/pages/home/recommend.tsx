"use client"

import React, { ReactNode } from 'react';
import Cookies from "js-cookie";
import { useUserStore } from '@/store/useUserStore';

interface HomeProps {
    children: ReactNode;
    memberData: any;
    isLoading: any;
}

function Recommend({ children, memberData, isLoading }: HomeProps) {
    const accessToken = Cookies.get('accessToken');

    const { userInfo } = useUserStore();

    // console.log('유저정보', userInfo);

    const isGuest = userInfo?.role === 'GUEST';

    // console.log('유저게스트?', isGuest);

    return (
        <div className="w-[90%] sm-700:w-[66%] flex flex-col mx-auto mt-[8rem]">
            {isLoading ? (
                <div>
                </div>
            ) : (
                <div>
                    {accessToken ? (
                        isGuest ? (
                            <h1 className='font-bold text-[2rem]'>트리피의 인기 게시글을 만나보세요</h1>
                        ) : (
                            <h1 className='font-bold text-[2rem]'>{memberData?.result.nickName}님을 위해 준비한 맞춤 추천 포스트</h1>
                        )
                    ) : (
                        <h1 className='font-bold text-[2rem]'>트리피의 인기 게시글을 만나보세요</h1>
                    )}
                </div>
            )}
            {children}
        </div>
    )
}

export default Recommend;
