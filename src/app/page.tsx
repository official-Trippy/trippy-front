"use client";
import Image from "next/image";
import Profile from "../../public/Profile.png";
import Recommend from "@/components/pages/home/recommend";
import RecentPost from "@/components/pages/home/recentPost";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import Header from "@/components/shared/header/Header";
import getBoard, { getTotalBoardCount } from "@/services/board/get/getBoard";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { colorTicket } from "@/types/board";
import nonheartImg from "@/dummy/heartbin.svg"
import heartImg from "@/dummy/heart.svg";
import moment from "@/dummy/moment.svg"
import airG from "@/dummy/main/airG.svg"
import busG from "@/dummy/main/busG.svg"
import trainG from "@/dummy/main/trainG.svg"
import bycicleG from "@/dummy/main/bycicleG.svg"
import carG from "@/dummy/main/carG.svg"
import { AirSVG, BusSVG, BycicleSVG, CarSVG, TrainSVG } from "@/components/transportsvg/home";


const PAGE_SIZE = 10;

export default function Home() {
  const accessToken = Cookies.get("accessToken");
  const [allPosts, setAllPosts] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [isLikeNum, setIsLikeNum] = useState([]);
  const { userInfo, loading, fetchUserInfo } = useUserStore();
  const [pages, setPages] = useState(0);


  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCards(1); // 모바일
      } else if (width < 800) {
        setVisibleCards(2); // 작은 태블릿
      } else if (width < 1035) {
        setVisibleCards(3); // 큰 태블릿
      } else {
        setVisibleCards(4); // 데스크탑
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 호출

    return () => window.removeEventListener('resize', handleResize);
  }, []);


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

  const { data: boardData, refetch: boardRefetch } = useQuery({
    queryKey: ['boardData'],
    queryFn: () => getBoard(PAGE_SIZE, pages)
  })



  console.log(boardData)
  return (
    <div>
      <Header />
      {/*추천 알고리즘 구현해야됨*/}
      <Recommend memberData={memberData} isLoading={isLoading}>
        <div className="flex mt-[4rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-x-[2rem] w-full">
            {boardData?.result.slice(0, visibleCards).map((posts: any, index: number) => {
              const createDateTime = new Date(posts.post.createDateTime);
              const formattedDateTime = `${createDateTime.getFullYear()}.${String(createDateTime.getMonth() + 1).padStart(2, '0')}.${String(createDateTime.getDate()).padStart(2, '0')} ${String(createDateTime.getHours()).padStart(2, '0')}:${String(createDateTime.getMinutes()).padStart(2, '0')}`;

              const getTextFromHtml = (html: any) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                return doc.body.innerText; // 텍스트만 반환
              };

              const bodyText = getTextFromHtml(posts.post.body);

              const getTransportImage = (transport: string, ticketColor: any) => {
                switch (transport) {
                  case 'Airplane':
                    return <AirSVG fillColor={colorTicket[ticketColor]} />;
                  case 'Car':
                    return <CarSVG fillColor={colorTicket[ticketColor]} />;
                  case 'Bus':
                    return <BusSVG fillColor={colorTicket[ticketColor]} />;
                  case 'Bicycle':
                    return <BycicleSVG fillColor={colorTicket[ticketColor]} />;
                  case 'Train':
                    return <TrainSVG fillColor={colorTicket[ticketColor]} />;
                  default:
                    return null; // 기본값 또는 대체 이미지
                }
              };
              console.log()
              return (
                <div className="h-[54rem] shadow-xl rounded-[1rem] mb-[2rem]" key={index}>
                  <div className="flex flex-col h-full">
                    <Image className={`w-full h-[35rem] py-[1.5rem] px-[1.2rem] rounded-[0.8rem] object-cover ${colorTicket[posts.ticket.ticketColor] ? `bg-[${colorTicket[posts.ticket.ticketColor]}]` : ''}`} src={posts.ticket.image.accessUri} alt="" width={300} height={260} />
                    {posts.ticket.departureCode ? (
                      <div className="flex text-[3.2rem] font-extrabold font-akira mx-auto mt-[1rem]">
                        <span>{posts.ticket.departureCode}</span>
                        <div className="mx-[0.5rem] mt-[1.5rem]">
                          {getTransportImage(posts.ticket.transport, posts.ticket.ticketColor)}
                        </div>
                        <span>{posts.ticket.destinationCode}</span>
                      </div>
                    ) : (
                      <div className="flex text-[3.2rem] h-[5.5rem] font-extrabold font-akira mx-auto">
                      </div>
                    )}
                    <div className="px-[1.7rem] flex-1">
                      <h1 className="font-semibold text-[2.4rem] theboki text-ellipsis overflow-hidden">{posts.post.title}</h1>
                      <span className="font-normal text-[2rem] text-[#6B6B6B] text-ellipsis overflow-hidden theboki">{bodyText}</span>
                    </div>
                    <div className="p-[1.7rem] flex">
                      <Image className="w-[2.6rem] h-[2.6rem]" src={posts.member.profileUrl} width={40} height={40} alt="" />
                      <div className="flex flex-col justify-center pl-[1rem] text-[1.4rem]">
                        <span className="font-bold">{posts.member.nickName}</span>
                      </div>
                      <div className="flex items-center text-[#9D9D9D] ml-auto">
                        {posts.post.isLiked ? (
                          <Image src={heartImg} alt='' width={24} height={24} />
                        ) : (
                          <Image src={nonheartImg} alt='' width={24} height={24} />
                        )}
                        <span className="text-[1.6rem] font-normal ml-auto">{posts.post.likeCount}</span>
                        <Image className='ml-[1rem]' src={moment} alt='' width={24} height={24} />
                        <span className="text-[1.6rem] font-normal">{posts.post.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Recommend>
      <RecentPost allPosts={allPosts} setAllPosts={setAllPosts} boardData={boardData} userInfo={userInfo} boardRefetch={boardRefetch} PAGE_SIZE={PAGE_SIZE} pages={pages} setPages={setPages} />

    </div>
  );
}
