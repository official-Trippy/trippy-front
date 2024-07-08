import React, { ReactNode } from 'react';
import Cookies from 'js-cookie';

interface HomeProps {
    children: ReactNode;
    memberData: any;
    isLoading: any;
}

const Recoootd: React.FC<HomeProps> = ({ children, memberData, isLoading }) => {
    const accessToken = Cookies.get('accessToken');

    return (
        <div className='w-[80%] flex flex-col mx-auto'>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {accessToken ? (
                        <h1 className='font-bold text-[2rem]'>{memberData?.result.nickName}님, 이런 스타일 좋아하실 것 같아요!</h1>
                    ) : (
                        <h1 className='font-bold text-[2rem]'>트리피의 인기 스타일을 확인해보세요!</h1>
                    )}
                </div>
            )}
            <div>
                {children}
            </div>
        </div>
    );
}

export default Recoootd;
