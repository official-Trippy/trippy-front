import React, { ReactNode } from "react";

interface HomeRecentProps {
  children: ReactNode;
}

function RecentPost({ children }: HomeRecentProps) {
  return (
    <div className="w-[80%] mx-auto py-[5rem]">
      <div className="">
        <h1 className="font-bold text-[2rem]">최신 포스트</h1>
        <div className="flex text-[1.6rem] pt-[5rem] px-[1rem]">
          <span className="pr-[1rem]">팔로잉</span>
          <span className="px-[1rem]">전체글</span>
          <select className="flex w-[8rem] h-[3rem] ml-auto font-medium selectshadow">
            <option>기본</option>
            <option>최신순</option>
            <option>날짜순</option>
            <option>인기순</option>
          </select>
        </div>
      </div>

      {children}
    </div>
  );
}

export default RecentPost;
