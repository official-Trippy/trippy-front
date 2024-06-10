"use client"
import Header from '@/components/shared/header/Header'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Air from '@/dummy/air.svg'
import Image from 'next/image'
import searchicon from '@/dummy/search.svg'
import uploadImages from "@/dummy/uploadfile.svg"

function Page() {
    const [bgColor, setBgColor] = useState('#55FBAF');
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    const handleButtonClick = (color: any) => {
        setBgColor(color);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    // URL 객체 해제
    useEffect(() => {
        return () => {
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);

    return (
        <div>
            <Header />
            <div className='w-[80%] mx-auto'>
                <div className='flex items-center mt-[5rem]'>
                    <button
                        onClick={() => handleButtonClick('#55FBAF')}
                        className='w-[2.4rem] h-[2.4rem] bg-[#55FBAF] rounded-full'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#FF4F4F')}
                        className='w-[2.4rem] h-[2.4rem] bg-[#FF4F4F] rounded-full ml-[1rem]'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#4FDBFF')}
                        className='w-[2.4rem] h-[2.4rem] bg-[#4FDBFF] rounded-full ml-[1rem]'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#FFD350')}
                        className='w-[2.4rem] h-[2.4rem] bg-[#FFD350] rounded-full ml-[1rem]'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#A84FFF')}
                        className='w-[2.4rem] h-[2.4rem] bg-[#A84FFF] rounded-full ml-[1rem]'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#FB3463')}
                        className='w-[2.4rem] h-[2.4rem] bg-[#FB3463] rounded-full ml-[1rem]'
                    ></button>
                    <button className='ml-auto flex bg-[#FB3463] text-white text-[1.6rem] font-semibold rounded-[1rem] px-[2.5rem] py-[0.5rem]'>올리기</button>
                </div>
                <div className='w-full h-[32rem] border border-[#D9D9D9] rounded-[1rem] flex mt-[2rem]'>
                    <div className={`w-[15.4rem] h-full bg-[${bgColor}] rounded-l-[1rem]`}></div>
                    <div className=' mt-[5rem]'>
                        <div className='flex ml-[15rem]'>
                            <div>
                                <h1 className='text-[6rem] font-extrabold'>KOR</h1>
                                <div className='w-[16rem] h-[3.6rem] pl-[2rem] shadowall rounded-[0.8rem] flex'>
                                    <input className='text-[1.6rem] outline-none' type='text' placeholder='검색'></input>
                                    <Image className='-ml-[7rem]' src={searchicon} alt='' />
                                </div>
                            </div>
                            <div className='w-[6rem] h-[6rem] shadowall rounded-full flex items-center justify-center mx-[5rem] mt-[2rem]'>
                                <Image className='' src={Air} alt='비행기' />
                            </div>
                            <div>
                                <h1 className='text-[6rem] font-extrabold'>KOR</h1>
                                <div className='w-[16rem] h-[3.6rem] pl-[2rem] shadowall rounded-[0.8rem] flex'>
                                    <input className='text-[1.6rem] outline-none' type='text' placeholder='검색'></input>
                                    <Image className='-ml-[7rem]' src={searchicon} alt='' />
                                </div>
                            </div>
                        </div>
                        <div className='border-2 border-dashed border-[#CFCFCF] w-[88rem] my-[4rem] ml-[3rem]' />
                        <div className={`flex ml-[7rem] text-[1.4rem] font-extrabold text-[${bgColor}]`}>
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
                    <div className={`w-full h-full bg-[${bgColor}] ml-[2rem] rounded-r-[1rem]`}>
                        <label className='w-full h-full flex cursor-pointer' htmlFor='input-file'>
                            {thumbnailPreview === null ? (
                                <div className='flex flex-col justify-center m-auto w-[40rem] h-[25rem] rounded-[1rem] border-2 border-dashed border-white'>
                                    <Image className='mx-auto' src={uploadImages} alt='' />
                                    <span className='text-[1.4rem] font-bold text-white text-center'>대표사진을 등록해주세요</span>
                                </div>
                            ) : (
                                <div className='flex flex-col m-auto'>
                                    <Image className=' w-[40rem] h-[25rem]' src={thumbnailPreview} width={400} height={250} alt='' />
                                </div>
                            )}

                        </label>
                        <input className='hidden' id='input-file' type='file' accept='image/*' onChange={handleFileChange} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;
