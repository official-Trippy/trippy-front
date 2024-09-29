"use client";
import RecentPost from "@/components/pages/home/recentPost";
import { useQuery } from "react-query";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import Header from "@/components/shared/header/Header";
import getBoard, { getTotalBoardCount } from "@/services/board/get/getBoard";
import { useEffect, useState } from "react";
import RecommendBoard from "@/components/pages/home/RecommendBoard";


const PAGE_SIZE = 10;

export default function Home() {
  const accessToken = Cookies.get("accessToken");
  const [allPosts, setAllPosts] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [isLikeNum, setIsLikeNum] = useState([]);
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
      <RecommendBoard />
      <RecentPost allPosts={allPosts} setAllPosts={setAllPosts} boardData={boardData} boardRefetch={boardRefetch} PAGE_SIZE={PAGE_SIZE} pages={pages} setPages={setPages} />

    </div>
  );
}
