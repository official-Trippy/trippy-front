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
import { useState } from "react";
import Link from "next/link";
import nonheartImg from "@/dummy/heartbin.svg"
import moment from "@/dummy/moment.svg"

export default function Home() {
  const accessToken = Cookies.get("accessToken");
  const [allPosts, setAllPosts] = useState(0);

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
          {boardData?.result.slice(0, 4).map((posts: any, index: number) => {
            const createDateTime = new Date(posts.post.createDateTime);
            const formattedDateTime = `${createDateTime.getFullYear()}.${String(createDateTime.getMonth() + 1).padStart(2, '0')}.${String(createDateTime.getDate()).padStart(2, '0')} ${String(createDateTime.getHours()).padStart(2, '0')}:${String(createDateTime.getMinutes()).padStart(2, '0')}`;
            return (
              <div className="w-[33rem] h-[40rem] shadow-xl rounded-[1rem] mr-[5rem]" key={index}>
                <div className="flex flex-col">
                  <Image className="w-[33rem] h-[26rem] rounded-[1rem]" src={posts.ticket.image.accessUri} alt="" width={300} height={260} />
                  <div className="p-[1rem] flex">
                    <Image src={posts.member.profileUrl} width={40} height={40} alt="" />
                    <div className="flex flex-col justify-center pl-[1rem] text-[1.4rem]">
                      <span className="font-bold">{posts.member.nickName}</span>
                      <span className="font-medium">{formattedDateTime}</span>
                    </div>
                  </div>
                  <div className="px-[1rem]">
                    <h1 className="font-medium text-[2rem]">{posts.post.title}</h1>
                    <span className="font-normal text-[1.2rem]">{posts.post.body}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Recommend>
      <RecentPost allPosts={allPosts} setAllPosts={setAllPosts}>
        {allPosts === 0 ? (
          <div className="flex flex-wrap">
            {boardData?.result.sort((a: any, b: any) => {
              const dateA = new Date(a.post.createDateTime).getTime();
              const dateB = new Date(b.post.createDateTime).getTime();
              return dateB - dateA;
            }).map((posts: any, index: number) => {
              const BoardId = posts.post.id

              function formatDate(dateString: any) {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `${year}.${month}.${day} ${hours}:${minutes}`;
              }
              const createdAt = posts.post.createDateTime;
              const formattedDate = formatDate(createdAt);

              console.log(posts)
              return (
                <Link href={`/board/${BoardId}`} className="w-[46rem] h-[20rem] shadowall rounded-[1rem] mt-[5rem] px-[1.6rem] py-[2rem] hover:-translate-y-4 duration-300 mx-[2rem] cursor-pointer" key={index}>
                  <div className="flex">
                    <div className="flex flex-col w-[150%]">
                      <h1 className="text-[2rem] font-medium text-ellipsis overflow-hidden theboki">{posts.post.title}</h1>
                      <span className="text-[1.6rem] mt-[0.4rem] h-[5rem] font-normal text-[#6B6B6B] text-ellipsis overflow-hidden theboki1">{posts.post.body}</span>
                      <div className="flex text-ellipsis overflow-hidden theboki">
                        {posts?.post.tags.map((tagData: string, index: number) => (
                          <span
                            key={index}
                            className="w-fit px-[0.8rem] py-[0.4rem] mt-[1.2rem] mr-[0.5rem] bg-[#F5F5F5] text-[1.3rem] text-[#9d9d9d] rounded-[1.6rem] text-ellipsis overflow-hidden theboki"
                          >
                            {tagData}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col w-full">
                      <Image className="w-[12rem] h-[12rem] ml-auto flex rounded-[0.8rem]" src={posts.ticket.image.accessUri} alt="" width={120} height={120} />
                    </div>
                  </div>
                  <div className="flex mt-[2rem]">
                    <div className="flex h-full text-[1.4rem] font-normal space-x-4 items-center mt-auto">
                      <Image src={posts.member.profileUrl} width={24} height={24} alt="" />
                      <span className="">{posts.member.nickName}</span>
                      <span className="">{formattedDate}</span>
                    </div>
                    <div className="ml-auto flex items-center text-[#9D9D9D]">
                      <Image src={nonheartImg} alt='' width={24} height={24} />
                      <span className="text-[1rem] font-normal">{posts.post.likeCount}</span>
                      <Image className='ml-[1rem]' src={moment} alt='' width={24} height={24} />
                      <span className="text-[1rem] font-normal">{posts.post.commentCount}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div>
            팔로잉 게시물 api 연동예정입니다.
          </div>
        )}

      </RecentPost>
    </div>
  );
}
