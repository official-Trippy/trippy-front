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
import date from "@/dummy/date.svg"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import postBoard from '@/services/board/post/postBoard'
import { uploadImage } from '@/services/blog'
import { UploadedImage } from '@/types/ootd'
import { useRouter } from 'next/navigation'


function PostWrite() {
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
    const [passengerCount, setPassengerCount] = useState(0);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [dateOpen, setDateOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [isImages, setIsImages] = useState<UploadedImage[]>([]);
    const router = useRouter();

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    function formatDates(date: any) {
        const year = date?.getFullYear();
        const month = String(date?.getMonth() + 1).padStart(2, '0');
        const day = String(date?.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const formatDateRange = () => {
        if (!startDate || !endDate) return '';
        return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
    };




    const handleIncrease = () => {
        setPassengerCount(passengerCount + 1);
    };

    const handleDecrease = () => {
        if (passengerCount > 1) {
            setPassengerCount(passengerCount - 1);
        }
    };


    const handleButtonClick = (color: any) => {
        setBgColor(color);
    };


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {

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

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setThumbnailPreview(URL.createObjectURL(file));
        }
        if (!file) return;

        try {
            const uploadedImage = await uploadImage(file);
            console.log(uploadedImage.result);
            setImages([...images, uploadedImage.result]);
            console.log(images);
            setIsImages([...images, uploadedImage.result]);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const displayImages = images.map(image => image.accessUri);

    console.log(displayImages)
    const addPost = async () => {
        const postRequest = {
            title: title,
            body: body,
            postType: 'POST',
            location: '24.12342,12.12344',
            images: images,
            tags: ['서울여행', '효도여행']
        }
        const ticketRequest = {
            departure: '부산',
            destination: '서울',
            image: images[0],
            memberNum: Number(passengerCount),
            startDate: formatDates(startDate),
            endDate: formatDates(endDate),
            ticketColor: 'Red',
            transport: 'Airplane'
        }
        try {
            console.log(postRequest, ticketRequest)
            await postBoard(postRequest, ticketRequest);
            router.push('/');
        } catch (e) {

        }
    }

    console.log(images)

    // URL 객체 해제
    useEffect(() => {
        return () => {
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);
    console.log(formatDates(startDate), formatDates(endDate))
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
                    <button className='ml-auto flex bg-[#FB3463] text-white text-[1.6rem] font-semibold rounded-[1rem] px-[2.5rem] py-[0.5rem]' onClick={addPost}>올리기</button>
                </div>
                <div className='w-full h-[32rem] border border-[#D9D9D9] rounded-[1rem] flex mx-auto mt-[2rem]'>
                    <div className={`w-[15.4rem] h-full bg-[${bgColor}] rounded-l-[1rem]`}></div>
                    <div className='w-full mt-[5rem] relative'>
                        <div className='flex justify-center'>
                            <div>
                                <h1 className='text-[6rem] font-extrabold'>KOR</h1>
                                <div className='w-[18rem] h-[3.6rem] px-[2rem] shadowall rounded-[0.8rem] flex'>
                                    <input className='w-[12rem] text-[1.6rem] outline-none' type='text' placeholder='검색'></input>
                                    <Image className='ml-auto' src={searchicon} alt='' />
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
                                <div className='w-[18rem] h-[3.6rem] px-[2rem] shadowall rounded-[0.8rem] flex'>
                                    <input className='w-[12rem] text-[1.6rem] outline-none' type='text' placeholder='검색'></input>
                                    <Image className='ml-auto' src={searchicon} alt='' />
                                </div>
                            </div>
                        </div>
                        <div className='w-[95%] border-2 border-dashed border-[#CFCFCF] my-[4rem] mx-auto relative z-0' />
                        <div className={`flex ml-[7rem] text-[1.4rem] font-extrabold text-[${bgColor}]`}>
                            <span className='w-[16rem]'>PASSENGER</span>
                            <span className='w-[25rem]'>DATE</span>
                            <span className='w-[8rem]'>GROUP</span>
                        </div>
                        <div className={`flex ml-[7rem] text-[1.4rem] font-extrabold text-[#6B6B6B] relative`}>
                            <span className='w-[16rem] flex'>USERID</span>
                            {dateOpen ? (
                                <div className='w-[25rem]'>
                                    <DatePicker
                                        selected={startDate || undefined}
                                        onChange={(dates) => {
                                            const [start, end] = dates;
                                            setStartDate(start);
                                            setEndDate(end);
                                            if (start && end) {
                                                setDateOpen(false);
                                            }
                                        }}
                                        startDate={startDate || undefined}
                                        endDate={endDate || undefined}
                                        selectsRange
                                        inline
                                        dateFormat="yyyy. MM. dd"
                                    />
                                </div>
                            ) : (
                                <div className='w-[25rem] flex items-center' onClick={() => setDateOpen(true)}>
                                    <Image src={date} alt='' />
                                    {startDate && endDate && (
                                        <span>{formatDateRange()}</span>
                                    )}
                                </div>
                            )}

                            <div className='w-[8rem] flex text-[1.6rem]'>
                                <button className='text-[#FB3463] flex text-[2rem]' onClick={handleDecrease}>-</button>
                                <span className='mx-[1rem] mt-[0.5rem]'>{passengerCount}</span>
                                <button className='text-[#FB3463] flex text-[2rem]' onClick={handleIncrease}>+</button>
                            </div>
                        </div>
                    </div>
                    <div className={`w-[60rem] h-full bg-[${bgColor}] rounded-r-[1rem] flex ml-auto`}>
                        <div className='absolute'>
                            <div className='relative bg-white w-[4rem] h-[4rem] rounded-full -mt-[2rem] -ml-[2rem]'></div>
                            <div className='relative bg-white w-[4rem] h-[4rem] rounded-full mt-[28rem] -ml-[2rem]'></div>
                        </div>
                        <label className='w-full h-full flex cursor-pointer' htmlFor='input-file'>
                            {thumbnailPreview === null ? (
                                <div className='flex flex-col justify-center m-auto w-[30rem] h-[25rem] rounded-[1rem] border-2 border-dashed border-white'>
                                    <Image className='mx-auto' src={uploadImages} alt='' />
                                    <span className='text-[1.4rem] font-bold text-white text-center'>대표사진을 등록해주세요</span>
                                </div>
                            ) : (
                                <div className='flex flex-col m-auto'>
                                    <Image className=' w-[30rem] h-[25rem] rounded-[1rem]' src={thumbnailPreview} width={400} height={250} alt='' />
                                </div>
                            )}

                        </label>
                        <input className='hidden' id='input-file' type='file' accept='image/*' onChange={handleImageUpload} />
                    </div>
                </div>
                <>
                    <div className="h-screen w-full overflow-hidden">
                        <form
                            className="h-screen w-full"
                        >
                            <div className="shadow-lg w-full h-screen">
                                <div className='h-[13rem] border-b border-[#CFCFCF] flex'>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="제목"
                                        className="w-full outline-none text-[3.6rem] font-medium flex items-end px-[6rem]"
                                    />
                                </div>
                                <textarea
                                    className='w-full h-screen outline-none text-[2rem] px-[6rem] py-[2.5rem]'
                                    placeholder='여러분의 경험을 자유롭게 적어주세요.'
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                ></textarea>
                            </div>

                        </form>
                    </div>
                </>
            </div>
        </div>
    )
}

export default PostWrite;
