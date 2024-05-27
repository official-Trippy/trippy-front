
"use client"
import { loginState } from '@/atoms/user';
import React, { ReactNode, useState } from 'react'
import { useRecoilValue } from 'recoil';
import Cookies from "js-cookie";

interface HomeProps {
    children: ReactNode;
    memberData: any;
    isLoading: any;
}

function Recommend({ children, memberData, isLoading }: HomeProps) {
    const accessToken = Cookies.get('accessToken');


    return (
        <div className='w-[80%] flex flex-col mx-auto'>
            {isLoading ? (<div>

            </div>) : (
                <div>
                    {accessToken ? (
                        <h1 className='font-bold text-[2rem]'>{memberData?.result.nickName}님을 위해 준비한 맞춤 추천 포스트</h1>
                    ) : (
                        <h1 className='font-bold text-[2rem]'>트리피의 인기 게시글을 만나보세요</h1>
                    )}
                </div>
            )}
            {children}
        </div>
    )
}

export default Recommend

