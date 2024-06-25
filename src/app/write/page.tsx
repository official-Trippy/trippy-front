"use client"
import Header from '@/components/shared/header/Header'
import React, { ChangeEvent, useEffect, useState } from 'react'
import air from '@/dummy/air.svg'
import train from '@/dummy/train.svg'
import bus from '@/dummy/bus.svg'
import bicycle from '@/dummy/bicycle.svg'
import car from '@/dummy/car.svg'
import air1 from '@/dummy/air1.svg'
import train1 from '@/dummy/train1.svg'
import bus1 from '@/dummy/bus1.svg'
import bicycle1 from '@/dummy/bicycle1.svg'
import car1 from '@/dummy/car1.svg'
import Image from 'next/image'
import searchicon from '@/dummy/search.svg'
import uploadImages from "@/dummy/uploadfile.svg"
import DraftPage from '@/components/draft'
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

function Page() {
    const [bgColor, setBgColor] = useState('#55FBAF');
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isTransport, setIsTransport] = useState(false);
    const [isImageIdx, setIsImageIdx] = useState([
        { imgsrc: air },
        { imgsrc: train },
        { imgsrc: bus },
        { imgsrc: bicycle },
        { imgsrc: car },
        { imgsrc: air1 },
        { imgsrc: train1 },
        { imgsrc: bus1 },
        { imgsrc: bicycle1 },
        { imgsrc: car1 },
    ]);
    const [imgIdx, setImgIdx] = useState(0);

    const handleButtonClick = (color: any) => {
        setBgColor(color);
    };
    const editorRef = React.createRef<Editor>();

    const handleSave = () => {
        const editorInstance = editorRef.current?.getInstance();
        if (editorInstance) {
            const markdown = editorInstance.getMarkdown();
            // 여기서 마크다운 데이터를 처리할 수 있습니다.
            console.log(markdown);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const selectTransport = (imgSrc: any) => {
        setIsImageIdx((prevState) => {
            // 클릭한 항목의 인덱스를 찾기
            const selectedIndex = prevState.findIndex((item) => item.imgsrc === imgSrc);

            // 새로운 배열 생성
            const updatedState: any = [...prevState];

            // 클릭한 항목을 맨 앞으로 옮기기
            if (selectedIndex !== -1) {
                const selectedItem = updatedState.splice(selectedIndex, 1)[0];
                updatedState.unshift(selectedItem);

                // 나머지 항목의 인덱스 업데이트
                for (let i = 0; i < updatedState.length; i++) {
                    updatedState[i].index = i;
                }
            }

            setIsTransport(false);

            return updatedState;
        });
    };

    console.log(isImageIdx)
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
                    <div className=' mt-[5rem] relative'>
                        <div className='flex ml-[15rem]'>
                            <div>
                                <h1 className='text-[6rem] font-extrabold'>KOR</h1>
                                <div className='w-[16rem] h-[3.6rem] pl-[2rem] shadowall rounded-[0.8rem] flex'>
                                    <input className='text-[1.6rem] outline-none' type='text' placeholder='검색'></input>
                                    <Image className='-ml-[7rem]' src={searchicon} alt='' />
                                </div>
                            </div>
                            <div className='relative bg-white z-10 mx-[5rem]'>
                                {
                                    isTransport ? (
                                        <div className='w-[6rem] h-[28rem] absolute z-10 bg-white shadowall rounded-full flex items-center justify-center mt-[2rem] flex-col space-y-9'>
                                            {isImageIdx.slice(0, 5).map((item: any, index) => (
                                                <Image
                                                    key={index}
                                                    className=""
                                                    src={item.imgsrc}
                                                    alt={`item ${index}`}
                                                    onClick={() => selectTransport(item.imgsrc)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div
                                            className='w-[6rem] h-[6rem] absolute shadowall rounded-full flex items-center justify-center mt-[2rem]'
                                            onClick={() => setIsTransport(true)}
                                        >
                                            <Image className='' src={isImageIdx[0].imgsrc} alt='비행기' />
                                        </div>
                                    )
                                }
                            </div>
                            <div className='ml-[5rem]'>
                                <h1 className='text-[6rem] font-extrabold'>KOR</h1>
                                <div className='w-[16rem] h-[3.6rem] pl-[2rem] shadowall rounded-[0.8rem] flex'>
                                    <input className='text-[1.6rem] outline-none' type='text' placeholder='검색'></input>
                                    <Image className='-ml-[7rem]' src={searchicon} alt='' />
                                </div>
                            </div>
                        </div>
                        <div className='border-2 border-dashed border-[#CFCFCF] w-[88rem] my-[4rem] ml-[3rem] relative z-0' />
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
                        <div className='absolute'>
                            <div className='relative bg-white w-[4rem] h-[4rem] rounded-full -mt-[2rem] -ml-[2rem]'></div>
                            <div className='relative bg-white w-[4rem] h-[4rem] rounded-full mt-[28rem] -ml-[2rem]'></div>
                        </div>
                        <label className='w-full h-full flex cursor-pointer' htmlFor='input-file'>
                            {thumbnailPreview === null ? (
                                <div className='flex flex-col justify-center m-auto w-[40rem] h-[25rem] rounded-[1rem] border-2 border-dashed border-white'>
                                    <Image className='mx-auto' src={uploadImages} alt='' />
                                    <span className='text-[1.4rem] font-bold text-white text-center'>대표사진을 등록해주세요</span>
                                </div>
                            ) : (
                                <div className='flex flex-col m-auto'>
                                    <Image className=' w-[40rem] h-[25rem] rounded-[1rem]' src={thumbnailPreview} width={400} height={250} alt='' />
                                </div>
                            )}

                        </label>
                        <input className='hidden' id='input-file' type='file' accept='image/*' onChange={handleFileChange} />
                    </div>
                </div>
                <div className='mt-[5rem]'>
                    <Editor
                        ref={editorRef}
                        initialValue="# 제목"
                        previewStyle="vertical"
                        height="600px"
                        initialEditType="wysiwyg"
                        useCommandShortcut={false}
                    />
                </div>
            </div>
        </div>
    )
}

export default Page;
