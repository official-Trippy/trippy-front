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
import Swal from 'sweetalert2'
import { colorTicket } from '@/types/board'
import TextEditor from '@/components/testEditor/TextEditor'
import MyTinyMCEEditor from '@/components/testEditor/textEditor2'

const countries: { [key: string]: string } = {
    KOR: '대한민국',
    USA: '미국',
    JPN: '일본',
    CHN: '중국',
    GBR: '영국',
    FRA: '프랑스',
    DEU: '독일',
    CAN: '캐나다',
    AUS: '호주',
    IND: '인도',
    BRA: '브라질',
    MEX: '멕시코',
    RUS: '러시아',
    ITA: '이탈리아'
};




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
    const [inputValue1, setInputValue1] = useState('');
    const [inputValue2, setInputValue2] = useState('');
    const [suggestions1, setSuggestions1] = useState<string[]>([]);
    const [suggestions2, setSuggestions2] = useState<string[]>([]);
    const [selectedCountryCode, setSelectedCountryCode] = useState('');
    const [selectedCountryCode2, setSelectedCountryCode2] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [ticketColor, setTicketColor] = useState('')

    const handleInputChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue1(value);

        // 첫 번째 입력 필드에 대한 추천 목록 업데이트
        if (value) {
            const filteredSuggestions = Object.values(countries).filter(country =>
                country.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions1(filteredSuggestions);
        } else {
            setSuggestions1([]);
        }

        // 입력값에 맞는 키값 업데이트
        const countryCode = Object.keys(countries).find(key => countries[key] === value);
        if (countryCode) {
            setSelectedCountryCode(countryCode);
        } else {
            setSelectedCountryCode(''); // 일치하는 국가가 없을 경우
        }
    };

    const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue2(value);

        // 두 번째 입력 필드에 대한 추천 목록 업데이트
        if (value) {
            const filteredSuggestions = Object.values(countries).filter(country =>
                country.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions2(filteredSuggestions);
        } else {
            setSuggestions2([]);
        }

        // 입력값에 맞는 키값 업데이트
        const countryCode = Object.keys(countries).find(key => countries[key] === value);
        if (countryCode) {
            setSelectedCountryCode2(countryCode);
        } else {
            setSelectedCountryCode2(''); // 일치하는 국가가 없을 경우
        }
    };

    const handleSuggestionClick1 = (suggestion: string) => {
        setInputValue1(suggestion);
        setSuggestions1([]); // 추천 목록 비우기

        // 클릭한 추천에 맞는 키값 업데이트
        const countryCode = Object.keys(countries).find(key => countries[key] === suggestion);
        if (countryCode) {
            setSelectedCountryCode(countryCode);
        }
    };

    const handleSuggestionClick2 = (suggestion: string) => {
        setInputValue2(suggestion);
        setSuggestions2([]); // 두 번째 추천 목록 비우기

        // 클릭한 추천에 맞는 키값 업데이트
        const countryCode = Object.keys(countries).find(key => countries[key] === suggestion);
        if (countryCode) {
            setSelectedCountryCode2(countryCode);
        }
    };

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


    const handleButtonClick = (color: string, index: number) => {
        setBgColor(color);
        const selectedColor = Object.keys(colorTicket)[index]; // 인덱스를 사용하여 색상 가져오기
        setTicketColor(selectedColor);
    };

    console.log(ticketColor, bgColor)


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
            tags: tags,
        }
        const ticketRequest = {
            departure: inputValue1,
            destination: inputValue2,
            image: images[0],
            memberNum: Number(passengerCount),
            startDate: formatDates(startDate),
            endDate: formatDates(endDate),
            ticketColor: ticketColor,
            transport: 'Airplane'
        }
        try {
            console.log(postRequest, ticketRequest)
            await postBoard(postRequest, ticketRequest);
            Swal.fire({
                icon: 'success',
                title: 'TICKET 게시글을 올렸습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#FB3463',
                customClass: {
                    popup: 'swal-custom-popup',
                    icon: 'swal-custom-icon'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/');
                }
            });
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


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            // 중복 태그 체크
            if (!tags.includes(inputValue.trim())) {
                setTags([...tags, inputValue.trim()]);
                setInputValue(''); // 입력 필드 초기화
            }
        }
    };


    console.log(tags)
    return (
        <div>
            <Header />
            <div className='w-[80%] mx-auto'>
                <div className='flex items-center mt-[5rem]'>
                    <button
                        onClick={() => handleButtonClick('#55FBAF', 0)}
                        className='w-[2.4rem] h-[2.4rem] bg-[#55FBAF] rounded-full'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#FF4F4F', 1)}
                        className='w-[2.4rem] h-[2.4rem] bg-[#FF4F4F] rounded-full ml-[1rem]'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#4FDBFF', 2)}
                        className='w-[2.4rem] h-[2.4rem] bg-[#4FDBFF] rounded-full ml-[1rem]'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#FFD350', 3)}
                        className='w-[2.4rem] h-[2.4rem] bg-[#FFD350] rounded-full ml-[1rem]'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#A84FFF', 4)}
                        className='w-[2.4rem] h-[2.4rem] bg-[#A84FFF] rounded-full ml-[1rem]'
                    ></button>
                    <button
                        onClick={() => handleButtonClick('#FB3463', 5)}
                        className='w-[2.4rem] h-[2.4rem] bg-[#FB3463] rounded-full ml-[1rem]'
                    ></button>
                    <button className='ml-auto flex bg-[#FB3463] text-white text-[1.6rem] font-semibold rounded-[1rem] px-[2.5rem] py-[0.5rem]' onClick={addPost}>올리기</button>
                </div>
                <div className='w-full h-[32rem] border border-[#D9D9D9] rounded-[1rem] flex mx-auto mt-[2rem]'>
                    <div className={`w-[15.4rem] h-full bg-[${bgColor}] rounded-l-[1rem]`}></div>
                    <div className='w-full mt-[5rem] relative'>
                        <div className='flex justify-center'>
                            <div>
                                <h1 className='h-[10rem] text-[6rem] font-extrabold font-akira'>{selectedCountryCode}</h1>
                                <div className='w-[18rem] h-[3.6rem] px-[2rem] shadowall rounded-[0.8rem] flex'>
                                    <input
                                        className='w-[12rem] text-[1.6rem] outline-none'
                                        type='text'
                                        placeholder='검색 1'
                                        value={inputValue1} // 첫 번째 입력 값 상태
                                        onChange={handleInputChange1} // 입력 값 변경 시 핸들러
                                    />
                                    <Image className='ml-auto' src={searchicon} alt='' />
                                </div>
                                {suggestions1.length > 0 && (
                                    <div className='w-[18rem] mt-2 absolute'>
                                        {suggestions1.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className='absolute w-[18rem] p-2 pl-[2rem] text-[1.6rem] hover:bg-gray-200 flex flex-col shadowall rounded-[0.8rem] cursor-pointer bg-white z-10'
                                                onClick={() => handleSuggestionClick1(suggestion)} // 클릭 시 핸들러
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className='relative bg-white z-10 ml-[7%] mr-[10%]'>
                                {
                                    isTransport ? (
                                        <div className='w-[6rem] h-[28rem] absolute z-10 bg-white shadowall rounded-[3rem] flex items-center justify-center mt-[2rem] flex-col space-y-9'>
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
                                <h1 className='h-[9rem] text-[6rem] font-extrabold font-akira'>{selectedCountryCode2}</h1>
                                <div className='w-[18rem] h-[3.6rem] px-[2rem] shadowall rounded-[0.8rem] flex mt-4'>
                                    <input
                                        className='w-[12rem] text-[1.6rem] outline-none'
                                        type='text'
                                        placeholder='검색 2'
                                        value={inputValue2} // 두 번째 입력 값 상태
                                        onChange={handleInputChange2} // 입력 값 변경 시 핸들러
                                    />
                                    <Image className='ml-auto' src={searchicon} alt='' />
                                </div>
                                {suggestions2.length > 0 && (
                                    <div className='absolute w-[18rem] mt-2'>
                                        {suggestions2.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className='absolute w-[18rem] p-2 pl-[2rem] text-[1.6rem] hover:bg-gray-200 flex flex-col shadowall rounded-[0.8rem] cursor-pointer bg-white z-10'
                                                onClick={() => handleSuggestionClick2(suggestion)} // 클릭 시 핸들러
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='w-[95%] border-2 border-dashed border-[#CFCFCF] my-[3rem] mx-auto relative z-0' />
                        <div className={`flex ml-[7rem] text-[1.4rem] font-extrabold font-akira`}
                            style={{ color: bgColor || 'inherit' }}
                        >
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
                    <div className="h-screen w-full overflow-hidden shadowall mt-[2rem] rounded-[0.8rem]">
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
                                {/* <TextEditor /> */}
                                <MyTinyMCEEditor
                                />
                                <textarea
                                    className='w-full h-screen outline-none text-[2rem] px-[6rem] py-[2.5rem]'
                                    placeholder='여러분의 경험을 자유롭게 적어주세요.'
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                ></textarea>
                            </div>

                        </form>
                    </div>
                    <div className='w-full h-[13rem] shadowall mt-[0.5rem] mb-[10rem]'>
                        <input className='text-[1.6rem] font-medium w-[50rem] outline-none ml-[6rem] mt-[3.4rem]'
                            type='text'
                            placeholder='태그를 3개 이상 입력해주세요.'
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown} />
                        <div className='ml-[6rem] mt-[1rem]'>
                            {tags.map((tag, index) => (
                                <span key={index} className='inline-block bg-[#F5F5F5] text-[#9D9D9D] rounded-[1.6rem] text-[1.6rem] px-[0.8rem] py-[0.4rem] mr-2'>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </>
            </div>
        </div>
    )
}

export default PostWrite;
