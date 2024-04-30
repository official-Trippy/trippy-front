import React, { ReactNode } from 'react'

interface HomeProps {
    children: ReactNode;
}

function Recommend({ children }: HomeProps) {
    return (
        <div className='w-[80%] flex flex-col mx-auto'>
            <h1 className='font-bold text-[2rem]'>김준휘님을 위해 준비한 맞춤 추천 포스트</h1>
            <div>
                {children}
            </div>
        </div>
    )
}

export default Recommend