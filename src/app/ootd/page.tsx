import React from 'react';
import RecentOotdPost from '@/components/pages/ootd/RecentOotdPost';
import Header from '@/components/shared/header/Header';

const OotdPage = () => {
    return (
        <div>
            <Header />
            {/* <Recoootd memberData={memberData} isLoading={isLoading}>
                <div className="w-[30rem] h-[40rem] shadow-xl rounded-[1rem]">
                    <div className="flex flex-col">
                        <img className="rounded-[1rem]" src="https://picsum.photos/300/200" alt="" />
                        <div className="p-[1rem] flex">
                            <Image src={Profile} width={40} height={40} alt="" />
                            <div className="flex flex-col justify-center pl-[1rem] text-[1.4rem]">
                                <span className="font-bold">닉네임</span>
                                <span className="font-medium">날짜</span>
                            </div>

                        </div>
                        <div className="px-[1rem]">
                            <h1 className="font-medium text-[2rem]">제목입니두우우</h1>
                            <span className="font-normal text-[1.2rem]">머시머시기</span>
                        </div>
                    </div>
                </div>
            </Recoootd> */}
            <RecentOotdPost/>
        </div>
    );
}

export default OotdPage;
