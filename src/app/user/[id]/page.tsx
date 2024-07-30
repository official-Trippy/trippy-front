'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import Cookies from 'js-cookie';
import Header from '@/components/shared/header/Header';
import UserProfile from '@/components/user/UserProfile';
import UserOotd from '@/components/user/UserOotd';
import UserTicket from '@/components/user/UserTicket';
import UserBadge from '@/components/user/UserBadge';
import UserBookmark from '@/components/user/UserBookmark'
import Image from 'next/image';
import backgroundImg from '../../../../public/DefaultBackground.svg';
import { fetchUserProfile } from '@/services/ootd.ts/ootdGet';

const TABS = {
  OOTD: 'OOTD',
  TICKET: 'TICKET',
  BADGE: 'BADGE',
  BOOKMARK: 'BOOKMARK',
  FOLLOWER: 'FOLLOWER',
  FOLLOWING: 'FOLLOWING',
};

const UserPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [activeTab, setActiveTab] = useState(TABS.OOTD);
  const accessToken = Cookies.get('accessToken');

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => fetchUserProfile(id),
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  const userData = data && data.result;
  console.log('userData: ', userData);
  const member = userData.memberId;

  return (
    <>
      <Header />
      <div className="relative w-full h-[300px]">
        <Image
          src={backgroundImg}
          alt="Background"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="w-[80%] mx-auto">
        <h1 className="w-[80%] absolute ml-auto text-right top-[320px] text-white text-4xl font-bold">
          {userData && userData.blogName}
        </h1>
      </div>
      <div className="w-[80%] mx-auto flex p-4">
        <div className="w-[250px] mb-4">
          <UserProfile memberId={id} setActiveTab={setActiveTab} />
        </div>
        <div className="w-[100%] ml-[50px]">
          <div className="flex justify-between mb-4 ml-4 text-2xl">
            <div className="flex space-x-4">
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${
                  activeTab === TABS.TICKET ? 'bg-[#ffe3ea] border-2 border-[#fa3463]' : 'border border-[#cfcfcf]'
                }`}
                onClick={() => setActiveTab(TABS.TICKET)}
              >
                <span className={activeTab === TABS.TICKET ? 'text-[#fa3463]' : ''}>티켓</span>
              </button>
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${
                  activeTab === TABS.OOTD ? 'bg-[#ffe3ea] border-2 border-[#fa3463]' : 'border border-[#cfcfcf]'
                }`}
                onClick={() => setActiveTab(TABS.OOTD)}
              >
                <span className={activeTab === TABS.OOTD ? 'text-[#fa3463]' : ''}>OOTD</span>
              </button>
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${
                  activeTab === TABS.BADGE ? 'bg-[#ffe3ea] border-2 border-[#fa3463]' : 'border border-[#cfcfcf]'
                }`}
                onClick={() => setActiveTab(TABS.BADGE)}
              >
                <span className={activeTab === TABS.BADGE ? 'text-[#fa3463]' : ''}>뱃지</span>
              </button>
              <button
                className={`px-8 py-2 rounded-[999px] justify-center items-center ${
                  activeTab === TABS.BOOKMARK ? 'bg-[#ffe3ea] border-2 border-[#fa3463]' : 'border border-[#cfcfcf]'
                }`}
                onClick={() => setActiveTab(TABS.BOOKMARK)}
              >
                <span className={activeTab === TABS.BOOKMARK ? 'text-[#fa3463]' : ''}>북마크</span>
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                className={`pr-8 py-2 ${
                  activeTab === TABS.FOLLOWER ? 'text-rose-500 font-bold' : 'bg-white'
                }`}
                onClick={() => setActiveTab(TABS.FOLLOWER)}
              >
                팔로워
              </button>
              <button
                className={`pr-8 py-2 ${
                  activeTab === TABS.FOLLOWING ? 'text-rose-500 font-bold' : 'bg-white'
                }`}
                onClick={() => setActiveTab(TABS.FOLLOWING)}
              >
                팔로윙
              </button>
            </div>
          </div>
          <hr className="mb-4 w-full h-[1px]" />

          <div className="w-full ml-4">
            {activeTab === TABS.TICKET && <UserTicket />}
            {activeTab === TABS.OOTD && <UserOotd memberId={id} />}
            {activeTab === TABS.BADGE && <UserBadge />}
            {activeTab === TABS.BOOKMARK && <UserBookmark />}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
