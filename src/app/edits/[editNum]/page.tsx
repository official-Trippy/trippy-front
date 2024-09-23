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
import MyTinyMCEEditor from '@/components/testEditor/textEditor2'
import { useQuery } from 'react-query'
import { getPost } from '@/services/board/get/getBoard'
import { getCountry, getCountry1 } from '@/services/board/get/getCountry'
import editPost from '@/services/board/patch/editPost'
import editTicket from '@/services/board/patch/editTicket'
import { PostAirSVG, PostBusSVG, PostBycicleSVG, PostCarSVG, PostTrainSVG } from '@/components/transportsvg/post'

interface CountryResult {
    countryIsoAlp2: string;
    // 다른 필요한 필드 추가
}

interface ApiResponse {
    result: CountryResult;
}

interface CountryResult {
    // 기존 프로퍼티들...
    isoAlp3?: string; // isoAlp3 프로퍼티 추가 (선택적)
}


function PostEdit({ params }: { params: { editNum: number } }) {
    const { data: postData, refetch: postRefetch } = useQuery({
        queryKey: ["postData"],
        queryFn: () => getPost(Number(params.editNum)),
    });

    const [bgColor, setBgColor] = useState(colorTicket[postData?.result.ticket.ticketColor]);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isTransport, setIsTransport] = useState(false);
    const [passengerCount, setPassengerCount] = useState(postData?.result.ticket.memberNum);
    const [startDate, setStartDate] = useState<Date | null>(postData?.result.ticket.startDate);
    const [endDate, setEndDate] = useState<Date | null>(postData?.result.ticket.endDate);
    const [startDates, setStartDates] = useState<Date | null>(null);
    const [endDates, setEndDates] = useState<Date | null>(null);
    const [dateOpen, setDateOpen] = useState(false);
    const [title, setTitle] = useState(postData?.result.post.title);
    const [body, setBody] = useState('');
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [isImages, setIsImages] = useState<UploadedImage[]>([]);
    const router = useRouter();
    const [inputValue1, setInputValue1] = useState(postData?.result.ticket.destination);
    const [inputValue2, setInputValue2] = useState(postData?.result.ticket.departure);
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [ticketColor, setTicketColor] = useState(colorTicket[postData?.result.ticket.ticketColor])
    const [postRequests, setPostRequests] = useState({
        body: postData?.result.post.body,
        images: postData?.result.post.images as string[], // 이미지 URL을 저장할 배열
    });
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [result1, setResult1] = useState<ApiResponse | null>(null);
    const [transport, setTransport] = useState(postData?.result.ticket.transport);
    const [isImageIdx, setIsImageIdx] = useState<any[]>([]);
    const [transportStr, setTransportStr] = useState('')

    useEffect(() => {
        setIsImageIdx([
            { imgsrc: <PostAirSVG fillColor={colorTicket[ticketColor]} /> },
            { imgsrc: <PostTrainSVG fillColor={colorTicket[ticketColor]} /> },
            { imgsrc: <PostBusSVG fillColor={colorTicket[ticketColor]} /> },
            { imgsrc: <PostBycicleSVG fillColor={colorTicket[ticketColor]} /> },
            { imgsrc: <PostCarSVG fillColor={colorTicket[ticketColor]} /> },
        ]);
    }, [ticketColor]);

    // const formatDate = (date: Date | null) => {
    //     if (!date) return '';
    //     return date.toLocaleDateString('ko-KR', {
    //         year: 'numeric',
    //         month: '2-digit',
    //         day: '2-digit',
    //     });
    // };

    function formatDates(date: any) {
        const year = date?.getFullYear();
        const month = String(date?.getMonth() + 1).padStart(2, '0');
        const day = String(date?.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const formatDateRange = () => {
        if (!startDates || !endDates) return '';
        return `${formatDates(startDates)} ~ ${formatDates(endDates)}`;
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


    const selectTransport = (imgSrc: JSX.Element) => {
        setIsImageIdx((prevState) => {
            // 클릭한 항목의 인덱스를 찾기
            const selectedIndex = prevState.findIndex((item) => item.imgsrc.type === imgSrc.type && item.imgsrc.props.fillColor === imgSrc.props.fillColor);

            // 새로운 배열 생성
            const updatedState: any = [...prevState];

            // 클릭한 항목을 맨 앞으로 옮기기
            if (selectedIndex !== -1) {
                const selectedItem = updatedState.splice(selectedIndex, 1)[0];
                updatedState.unshift(selectedItem);

                // 첫 번째 항목의 src에 따라 setTransportStr 설정
                if (updatedState.length > 0) {
                    const transportValue = updatedState[0].imgsrc.type.name; // SVG 컴포넌트의 이름 사용

                    if (transportValue === 'PostBicycleSVG') {
                        setTransportStr('Bicycle');
                    } else if (transportValue === 'PostAirSVG') {
                        setTransportStr('Airplane');
                    } else if (transportValue === 'PostTrainSVG') {
                        setTransportStr('Train');
                    } else if (transportValue === 'PostBusSVG') {
                        setTransportStr('Bus');
                    } else if (transportValue === 'PostCarSVG') {
                        setTransportStr('Car');
                    }
                } else {
                    console.warn('No valid src found in updatedState[0]'); // 디버깅: src가 없을 경우 경고
                }
            }
            setIsTransport(false); // transport 상태를 false로 설정

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

    console.log(postData)

    const displayImages = images.map(image => image.accessUri);

    console.log(postData?.result.post.id)
    const addPost = async () => {
        const postRequest = {
            id: postData?.result.post.id,
            title: title,
            body: postRequests.body,
            postType: 'POST',
            location: '24.12342,12.12344',
            images: postRequests.images || postData?.result.post.images,
            tags: tags,
        }
        const ticketRequest = {
            id: postData?.result?.ticket?.id,
            departure: inputValue1,
            departureCode: postData?.result?.ticket?.departureCode || (result?.result?.isoAlp3 || ''),
            destination: inputValue2,
            destinationCode: postData?.result?.ticket?.destinationCode || (result1?.result?.isoAlp3 || ''),
            image: images[0] || postData?.result?.ticket?.image,
            memberNum: Number(passengerCount),
            startDate: startDates || startDate,
            endDate: endDates || endDate,
            ticketColor: ticketColor,
            transport: transport
        };
        try {
            console.log(postRequest, ticketRequest)
            await editPost(postRequest);
            await editTicket(ticketRequest)
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
                    router.push(`/board/${Number(params.editNum)}`);
                }
            });
        } catch (e) {

        }
    }

    console.log(startDate)

    // URL 객체 해제
    useEffect(() => {
        return () => {
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);
    // console.log(formatDates(startDate), formatDates(endDate))


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

    const { getLocationData } = getCountry({ setResult });
    const { getLocationData1 } = getCountry1({ setResult1 });

    const searchCountry = async (locations: string) => {
        await getLocationData(locations);
    }

    const searchCountry1 = async (locationss: string) => {
        await getLocationData1(locationss);
    }


    console.log(result)
    return (
        <div>
            <Header />
            <div className='w-[66%] mx-auto'>
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
                    <div className={`w-[15.4rem] h-full bg-[${bgColor}] rounded-l-[1rem]`}
                        style={{ color: colorTicket[postData?.result.ticket.ticketColor] || 'inherit' }}></div>
                    <div className='w-full mt-[5rem] relative'>
                        <div className='flex justify-center'>
                            <div className='ml-[5rem]'>
                                <h1 className='h-[9rem] text-[6rem] font-extrabold font-akira'>{result1?.result?.isoAlp3 || postData?.result?.ticket?.departureCode}</h1>
                                <div className='w-[18rem] h-[3.6rem] px-[2rem] shadowall rounded-[0.8rem] flex mt-4'>
                                    <input
                                        className='w-[12rem] text-[1.6rem] outline-none'
                                        type='text'
                                        placeholder='검색 2'
                                        value={inputValue2} // 두 번째 입력 값 상태
                                        onChange={(e) => setInputValue2(e.target.value)} // 입력 값 변경 시 핸들러
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                searchCountry1(inputValue2); // 엔터 키가 눌리면 함수 호출
                                            }
                                        }}
                                    />
                                    <button className='ml-auto' onClick={() => searchCountry1(inputValue2)} >
                                        <Image src={searchicon} alt='' />
                                    </button>
                                </div>
                            </div>
                            <div className='relative bg-white z-10 ml-[4%] mr-[11%]'>
                                {
                                    isTransport ? (
                                        <div className='w-[6rem] h-[28rem] absolute z-10 bg-white shadowall rounded-[3rem] flex items-center justify-center mt-[1.5rem] flex-col space-y-9'>
                                            {isImageIdx.slice(0, 5).map((item: any, index) => (
                                                <div key={index} onClick={() => selectTransport(item.imgsrc)}>
                                                    {item.imgsrc}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div
                                            className='w-[6rem] h-[6rem] absolute shadowall rounded-full flex items-center justify-center mt-[1.5rem]'
                                            onClick={() => setIsTransport(true)}
                                        >
                                            {isImageIdx[0]?.imgsrc}
                                        </div>
                                    )
                                }
                            </div>
                            <div>
                                <h1 className='h-[10rem] text-[6rem] font-extrabold font-akira'>{result?.result?.isoAlp3 || postData?.result?.ticket?.departureCode}</h1>
                                <div className='w-[18rem] h-[3.6rem] px-[2rem] shadowall rounded-[0.8rem] flex'>
                                    <input
                                        className='w-[12rem] text-[1.6rem] outline-none'
                                        type='text'
                                        placeholder='검색 1'
                                        value={inputValue1} // 첫 번째 입력 값 상태
                                        onChange={(e) => setInputValue1(e.target.value)} // 입력 값 변경 시 핸들러
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                searchCountry(inputValue1); // 엔터 키가 눌리면 함수 호출
                                            }
                                        }}
                                    />
                                    <button className='ml-auto' onClick={() => searchCountry(inputValue1)} >
                                        <Image src={searchicon} alt='' />
                                    </button>
                                </div>
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
                                        selected={startDates || undefined}
                                        onChange={(dates) => {
                                            const [start, end] = dates;
                                            setStartDates(start);
                                            setEndDates(end);
                                            if (start && end) {
                                                setDateOpen(false);
                                            }
                                        }}
                                        startDate={startDates || undefined}
                                        endDate={endDates || undefined}
                                        selectsRange
                                        inline
                                        dateFormat="yyyy. MM. dd"
                                    />
                                </div>
                            ) : (
                                <div className='w-[25rem] flex items-center' onClick={() => setDateOpen(true)}>
                                    <Image src={date} alt='' />
                                    {startDates && endDates ? (
                                        <span>{formatDateRange()}</span>
                                    ) : (
                                        <span>{postData?.result.ticket.startDate} - {postData?.result.ticket.endDate}</span>
                                    )}
                                </div>
                            )}

                            <div className='w-[8rem] flex text-[1.6rem]'>
                                <button className='text-[#FB3463] flex text-[2rem]' onClick={handleDecrease}>-</button>
                                <span className='mx-[1rem] mt-[0.5rem]'>{passengerCount || postData?.result.ticket.memberNum}</span>
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
                                <div className="flex flex-col m-auto">
                                    <Image
                                        className="w-[23rem] h-[26rem] rounded-[1rem]"
                                        src={postData?.result.ticket.image.accessUri}
                                        alt=""
                                        width={230}
                                        height={260}
                                    />
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
                                    postRequest={postRequests}
                                    setPostRequest={setPostRequests}
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

export default PostEdit;
