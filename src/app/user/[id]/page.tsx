
import React from 'react';
import UserProfile from '@/components/user/userProfile';
import UserOotd from '@/components/user/userOotd';

const UserPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <div className="p-4">
      <UserProfile memberId={id} />
      <UserOotd memberId={id} />
    </div>
  );
};

export default UserPage;
