import Image from 'next/image'
import React, { ReactNode } from 'react'
import bg from '@/dummy/onboardingbg.svg'
import FirstBgimg from '@/dummy/onboardingfirst.svg'

interface FirstProps {
    children: ReactNode;
}

function FirstBg({ children }: FirstProps) {

    return (
        <div className='flex flex-col w-full h-screen'>
            {children}
            <div className='flex flex-col ml-auto mt-auto z-10'>
                <Image src={FirstBgimg} alt='' />
            </div>
        </div>
    )
}

export default FirstBg