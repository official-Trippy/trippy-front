import Image from 'next/image'
import React, { ReactNode } from 'react'
import bg from '@/dummy/onboardingbg.svg'
import FirstBgimg from '@/dummy/onboardingfirst.svg'

interface FirstProps {
    children: ReactNode;
}

function FirstBg({ children }: FirstProps) {

    return (
        <div className='relative bg-cover flex flex-col w-full h-screen'>
            {children}
            <div className='flex ml-auto mt-[-25rem] z-10'>
                <Image src={FirstBgimg} width={1600} height={900} alt='' />
            </div>
        </div>
    )
}

export default FirstBg