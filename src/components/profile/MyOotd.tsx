'use client';

import React from "react";
import { useQuery } from "react-query";
import { fetchOotdPosts } from "@/services/ootd.ts/ootdGet";
import { UserInfoType } from "@/types/auth";

const PAGE_SIZE = 9;

interface MyOotdProps {
  userInfo: UserInfoType;
}

const MyOotd: React.FC<MyOotdProps> = ({ userInfo }) => {
  const [page, setPage] = React.useState(0);

  const { data, isLoading, isError } = useQuery(['ootdPosts', page], () => fetchOotdPosts({ size: PAGE_SIZE, page }));

  const totalPages = Math.ceil((data?.result?.length || 0) / PAGE_SIZE);

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="h-[400px]">
      <h3 className="text-2xl font-bold my-12">나의 OOTD</h3>
      <div className="flex flex-wrap gap-4">
        {data.result.map((item) => (
          <div key={item.ootd.id} className="flex-1 max-w-[30%]">
            <div className="flex items-center mb-2">
              <img
                src={userInfo.profileImageUrl}
                alt="User Profile"
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>{userInfo.nickName}</span>
            </div>
            {item.post.images.length > 0 && (
              <img src={item.post.images[0].accessUri} alt="OOTD" className="w-full h-auto" />
            )}
            <p>{item.post.title}</p>
            <div className="flex gap-2 mt-2">
              {item.post.tags.map((tag, index) => (
                <span key={index} className="bg-gray-200 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button onClick={handlePrevPage} disabled={page === 0}>이전</button>
        <button onClick={handleNextPage} disabled={page === totalPages - 1}>다음</button>
      </div>
    </div>
  );
};

export default MyOotd;
