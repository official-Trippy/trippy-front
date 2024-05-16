"use client"
import { loginState } from '@/atoms/user';
import React, { ReactNode } from 'react'
import { useRecoilValue } from 'recoil';

interface HomeProps {
    children: ReactNode;
    memberData: any;
}

function Recommend({ children, memberData }: HomeProps) {
    const { isLoggedIn } = useRecoilValue(loginState);
    return (
        <div className='w-[80%] flex flex-col mx-auto'>
            {isLoggedIn ? (
                <h1 className='font-bold text-[2rem]'>{memberData.result.nickName}님을 위해 준비한 맞춤 추천 포스트</h1>
            ) : (
                <h1 className='font-bold text-[2rem]'>트리피의 인기 게시글을 만나보세요</h1>
            )}
            <div>
                {children}
            </div>
        </div>
    )
}

export default Recommend