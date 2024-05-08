import Image from 'next/image'
import React, { ReactNode } from 'react'
import bg from '@/dummy/onboardingbg.svg'
import secondimg from "@/dummy/secondimg.svg"

interface FirstProps {
    children: ReactNode;
}

function SecondBg({ children }: FirstProps) {

    return (
        <div className='flex flex-col w-full h-screen bg-btn-color'>
            {children}
            <div className='flex mt-auto'>
                <Image src={secondimg} width={800} height={800} alt='' />
            </div>
        </div>
    )
}

export default SecondBg