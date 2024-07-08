'use client';

import React from 'react';
import { useQuery } from 'react-query';
import { fetchOotdPostDetail } from '@/services/ootd.ts/ootdGet';
import { OotdDetailGetResponse } from '@/types/ootd';

interface OotdDetailProps {
  id: number;
}

const OotdDetail: React.FC<OotdDetailProps> = ({ id }) => {
  const { data, error, isLoading } = useQuery<OotdDetailGetResponse>(
    ['ootdPostDetail', id],
    () => fetchOotdPostDetail(id)
  );

  if (isLoading) {
    return null;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const ootdItem = data.result;

  return (
    <div className="container">
      <div className="w-[30rem] h-[40rem] shadow-xl rounded-[1rem]">
        <div className="flex flex-col">
          <img
            className="rounded-[1rem]"
            src={ootdItem.post.images[0].accessUri}
            alt=""
          />
          <div className="p-[1rem] flex">
            {ootdItem.post.images.length > 0 && (
              <img src={ootdItem.post.images[0].accessUri} width={40} height={40} alt="" />
            )}
            <div className="flex flex-col justify-center pl-[1rem] text-[1.4rem]">
              <span className="font-bold">{ootdItem.post.nickName}</span>
              <span className="font-medium">{ootdItem.post.createDateTime}</span>
            </div>
          </div>
          <div className="px-[1rem]">
            <h1 className="font-medium text-[2rem]">{ootdItem.post.title}</h1>
            <p className="font-normal text-[1.2rem]">{ootdItem.post.body}</p>
          </div>
          <div className="px-[1rem] mt-[1rem]">
            {ootdItem.post.tags.map((tag: string, index: number) => (
              <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md mr-2">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OotdDetail;
