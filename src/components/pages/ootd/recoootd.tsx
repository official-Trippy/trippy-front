import React, { ReactNode } from 'react'

interface HomeProps {
    children: ReactNode;
}

function Recoootd({ children }: HomeProps) {
    return (
        <div className='w-[80%] flex flex-col mx-auto'>
            <h1 className='font-bold text-[2rem]'>USER님, 이런 스타일 좋아하실 것 같아요!</h1>
            <div>
                {children}
            </div>
        </div>
    )
}

export default Recoootd