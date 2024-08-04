"use client";
import Image from "next/image";
import Profile from "../../public/Profile.png";
import Recommend from "@/components/pages/home/recommend";
import RecentPost from "@/components/pages/home/recentPost";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import Header from "@/components/shared/header/Header";
import getBoard from "@/services/board/get/getBoard";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";


export default function Home() {
  const accessToken = Cookies.get("accessToken");
  const [allPosts, setAllPosts] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [isLikeNum, setIsLikeNum] = useState([]);
  const { userInfo, loading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCards(1); // 모바일
      } else if (width < 768) {
        setVisibleCards(2); // 작은 태블릿
      } else if (width < 1024) {
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

  const { data: boardData } = useQuery({
    queryKey: ['boardData'],
    queryFn: () => getBoard()
  })

  console.log(boardData)
  return (
    <div>
      <Header />
      <Recommend memberData={memberData} isLoading={isLoading}>
        <div className="flex mt-[4rem]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
            {boardData?.result.slice(0, visibleCards).map((posts: any, index: number) => {
              const createDateTime = new Date(posts.post.createDateTime);
              const formattedDateTime = `${createDateTime.getFullYear()}.${String(createDateTime.getMonth() + 1).padStart(2, '0')}.${String(createDateTime.getDate()).padStart(2, '0')} ${String(createDateTime.getHours()).padStart(2, '0')}:${String(createDateTime.getMinutes()).padStart(2, '0')}`;

              return (
                <div className="h-[40rem] shadow-xl rounded-[1rem] mb-[2rem]" key={index}>
                  <div className="flex flex-col h-full">
                    <Image className="w-full h-[26rem] rounded-[1rem]" src={posts.ticket.image.accessUri} alt="" width={300} height={260} />
                    <div className="p-[1rem] flex">
                      <Image src={posts.member.profileUrl} width={40} height={40} alt="" />
                      <div className="flex flex-col justify-center pl-[1rem] text-[1.4rem]">
                        <span className="font-bold">{posts.member.nickName}</span>
                        <span className="font-medium">{formattedDateTime}</span>
                      </div>
                    </div>
                    <div className="px-[1rem] flex-1">
                      <h1 className="font-medium text-[2rem]">{posts.post.title}</h1>
                      <span className="font-normal text-[1.2rem]">{posts.post.body}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Recommend>
      <RecentPost allPosts={allPosts} setAllPosts={setAllPosts} boardData={boardData} userInfo={userInfo} />
    </div>
  );
}
