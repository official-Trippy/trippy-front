import Image from 'next/image'
import React, { ReactNode } from 'react'
import bg from '@/dummy/onboardingbg.svg'
import secondimg from "@/dummy/secondimg.svg"

interface FirstProps {
    children: ReactNode;
    className: any;
}

function SecondBg({ children, className }: FirstProps) {

    return (
        <div className={`relative flex flex-col w-full h-screen bg-btn-color z-20 ${className}`}>
            {children}
            <div className='flex mt-auto'>
                <Image src={secondimg} alt='' height={600} />
            </div>
        </div>
    )
}

export default SecondBg