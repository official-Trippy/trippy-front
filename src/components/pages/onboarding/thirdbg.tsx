import Image from 'next/image'
import React, { ReactNode } from 'react'
import bg from '@/dummy/onboardingbg.svg'
import thirdimg from "@/dummy/thirdimg.svg"

interface FirstProps {
    children: ReactNode;
}

function ThirdBg({ children }: FirstProps) {

    return (
        <div className='relative flex flex-col w-full h-screen bg-black/40 z-0'>
            {children}
            <div className='w-full h-full flex justify-center mx-auto mt-[-60rem] bg-cover relative bg-black/40 z-0'>
                <Image className='opacity-50' src={thirdimg} width={1500} height={1000} alt='' />
            </div>
        </div>
    )
}

export default ThirdBg