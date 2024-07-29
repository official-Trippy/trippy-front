'use client';

import React from 'react';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { fetchUserProfile } from '@/services/ootd.ts/ootdGet';
import { UserProfileResponse } from '@/types/ootd';

interface UserProfileProps {
  memberId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ memberId }) => {
  const { data, isLoading, error } = useQuery<UserProfileResponse>(
    ['userProfile', memberId],
    () => fetchUserProfile(memberId),
    {
      staleTime: Infinity,
      cacheTime: Infinity, 
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user profile</div>;
  if (!data) return <div>No data</div>;

  const { profileImageUrl, blogName, blogIntroduce } = data.result;

  return (
    <div className="flex items-center">
      <Image
        src={profileImageUrl}
        alt="Profile Image"
        width={100}
        height={100}
        className="rounded-full"
      />
      <div className="ml-4">
        <h1 className="text-2xl font-bold">{blogName}</h1>
        <p>{blogIntroduce}</p>
      </div>
    </div>
  );
};

export default UserProfile;
