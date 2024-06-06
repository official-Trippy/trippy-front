import Header from '@/components/shared/header/Header'
import React from 'react'
import Air from '@/dummy/air.svg'
import Image from 'next/image'

function page() {
    return (
        <div>
            <Header />
            <div className='w-[80%] mx-auto'>
                <div className='flex items-center mt-[5rem]'>
                    <button className='w-[2.4rem] h-[2.4rem] bg-[#55FBAF] rounded-full'></button>
                    <button className='w-[2.4rem] h-[2.4rem] bg-[#55FBAF] rounded-full ml-[1rem]'></button>
                    <button className='w-[2.4rem] h-[2.4rem] bg-[#55FBAF] rounded-full ml-[1rem]'></button>
                    <button className='w-[2.4rem] h-[2.4rem] bg-[#55FBAF] rounded-full ml-[1rem]'></button>
                    <button className='w-[2.4rem] h-[2.4rem] bg-[#55FBAF] rounded-full ml-[1rem]'></button>
                    <button className='w-[2.4rem] h-[2.4rem] bg-[#55FBAF] rounded-full ml-[1rem]'></button>
                    <button className='ml-auto flex bg-[#FB3463] text-white text-[1.6rem] font-semibold rounded-[1rem] px-[2.5rem] py-[0.5rem]'>올리기</button>
                </div>
                <div className='w-full h-[32rem] border border-[#D9D9D9] rounded-[1rem] flex mt-[2rem]'>
                    <div className={`w-[4.4rem] h-full bg-[#55FBAF] rounded-l-[1rem]`}></div>
                    <div className=' mt-[5rem]'>
                        <div className='flex ml-[15rem]'>
                            <div>
                                <h1 className='text-[6rem] font-extrabold'>KOR</h1>
                                <input className='w-[16rem] h-[3.6rem] pl-[2rem] shadowall rounded-[0.8rem]' type='text' placeholder='검색'></input>
                            </div>
                            <div className='w-[6rem] h-[6rem] shadowall rounded-full flex items-center justify-center mx-[5rem] mt-[2rem]'>
                                <Image className='' src={Air} alt='비행기' />
                            </div>
                            <div>
                                <h1 className='text-[6rem] font-extrabold'>KOR</h1>
                                <input className='w-[16rem] h-[3.6rem] pl-[2rem] shadowall rounded-[0.8rem]' type='text' placeholder='검색'></input>
                            </div>
                        </div>
                        <div className='border-2 border-dashed border-[#CFCFCF] w-[88rem] my-[4rem] ml-[3rem]' />
                        <div className={`flex ml-[7rem] text-[1.4rem] font-extrabold text-[#55FBAF]`}>
                            <span className='w-[16rem]'>PASSENGER</span>
                            <span className='w-[25rem]'>DATE</span>
                            <span className='w-[8rem]'>GROUP</span>
                        </div>
                        <div className={`flex ml-[7rem] text-[1.4rem] font-extrabold text-[#6B6B6B]`}>
                            <span className='w-[16rem]'>USERID</span>
                            <span className='w-[25rem]'>2024. 07. 01~2024. 07. 03</span>
                            <span className='w-[8rem]'>4</span>
                        </div>
                    </div>
                    <div className='w-full h-full bg-[#55FBAF] ml-[2rem] rounded-r-[1rem]'></div>
                </div>
            </div>
        </div>
    )
}

export default page