import Image from 'next/image'
import React, { ReactNode } from 'react'
import bg from '@/dummy/onboardingbg.svg'
import secondimg from "@/dummy/secondimg.svg"

interface FirstProps {
    children: ReactNode;
}

function SecondBg({ children }: FirstProps) {

    return (
        <div className='relative flex flex-col w-full h-screen bg-btn-color z-20'>
            {children}
            <div className='flex -mt-[35rem]'>
                <Image src={secondimg} width={1700} height={1300} alt='' />
            </div>
        </div>
    )
}

export default SecondBg