import Image from 'next/image'
import React, { ReactNode } from 'react'
import bg from '@/dummy/onboardingbg.svg'

interface FirstProps {
    children: ReactNode;
}

function SecondBg({ children }: FirstProps) {

    return (
        <div className='bg-cover flex w-full h-screen bg'>
            {children}
        </div>
    )
}

export default SecondBg