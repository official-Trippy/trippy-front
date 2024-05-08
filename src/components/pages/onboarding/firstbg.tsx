import Image from 'next/image'
import React, { ReactNode } from 'react'
import bg from '@/dummy/onboardingbg.svg'
import FirstBgimg from '@/dummy/onboardingfirst.svg'

interface FirstProps {
    children: ReactNode;
}

function FirstBg({ children }: FirstProps) {

    return (
        <div className='bg-cover flex flex-col w-full h-screen'>
            {children}
            <div className='flex mt-auto mx-auto mr-[25%]'>
                <Image src={FirstBgimg} width={500} height={500} alt='' />
            </div>
        </div>
    )
}

export default FirstBg