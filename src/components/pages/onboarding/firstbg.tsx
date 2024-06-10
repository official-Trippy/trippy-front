import Image from 'next/image'
import React, { ReactNode } from 'react'
import bg from '@/dummy/onboardingbg.svg'
import FirstBgimg from '@/dummy/onboardingfirst.svg'

interface FirstProps {
    children: ReactNode;
    className: any;
}

function FirstBg({ children, className }: FirstProps) {

    return (
        <div className={`flex flex-col w-full ${className}`}>
            {children}
            <div className='flex flex-col ml-auto -mt-[30rem] -z-10'>
                <Image className='relative z-0' src={FirstBgimg} alt='' />
            </div>
        </div>
    )
}

export default FirstBg