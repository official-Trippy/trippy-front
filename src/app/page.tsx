"use client";
import Image from "next/image";
import Profile from "../../public/Profile.png";
import Recommend from "@/components/pages/home/recommend";
import RecentPost from "@/components/pages/home/RecentPost";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import Header from "@/components/shared/header/Header";

export default function Home() {
  const accessToken = Cookies.get("accessToken");

  const {
    data: memberData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["member", accessToken],
    queryFn: () => MemberInfo(accessToken),
    onError: (error) => {
      // 에러 처리 로직
      console.error(error);
    },
  });

  console.log(memberData);

  return (
    <div>
      <Header />
      <Recommend memberData={memberData} isLoading={isLoading}>
        <div className="w-[30rem] h-[40rem] shadow-xl rounded-[1rem]">
          <div className="flex flex-col">
            <img
              className="rounded-[1rem]"
              src="https://picsum.photos/300/200"
              alt=""
            />
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
      </Recommend>
      <RecentPost>
        <div className="w-[45rem] h-[20rem] shadowall rounded-[1rem] mt-[5rem] px-[1.6rem] py-[2rem] hover:-translate-y-4 duration-300">
          <div className="flex">
            <div className="flex flex-col w-[150%]">
              <h1 className="text-[2rem] font-medium">제목</h1>
              <span className="text-[1.6rem] mt-[0.4rem] font-normal">
                본문2줄까지보이기
              </span>
              <span className="w-fit px-[0.8rem] py-[0.4rem] mt-[1.2rem] bg-[#F5F5F5] text-[1.3rem] text-[#9d9d9d] rounded-[1.6rem]">
                태그
              </span>
            </div>
            <div className="flex flex-col w-full">
              <img
                className="ml-auto flex rounded-[0.8rem]"
                src="https://picsum.photos/120/120"
                alt="dd"
              />
            </div>
          </div>
          <div className="flex mt-[1.6rem]">
            <div className="flex h-full text-[1.4rem] font-normal space-x-4 items-center mt-auto">
              <Image src={Profile} width={24} height={24} alt="" />
              <span className="">닉네임</span>
              <span className="">날짜</span>
            </div>
            <div className="ml-auto flex items-center">
              <span>하트</span>
              <span>0</span>
              <span>댓글</span>
              <span>0</span>
            </div>
          </div>
        </div>
      </RecentPost>
    </div>
  );
}
