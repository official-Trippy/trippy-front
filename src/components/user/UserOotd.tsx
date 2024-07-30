import React from 'react';
import { useQuery } from 'react-query';
import { fetchUserOotdPosts } from '@/services/ootd.ts/ootdGet';
import { OotdGetResponse } from '@/types/ootd';
import { formatDate } from '@/constants/dateFotmat';

interface UserOotdProps {
  memberId: string;
}

const UserOotd: React.FC<UserOotdProps> = ({ memberId }) => {
  const { data, isLoading, error } = useQuery<OotdGetResponse>(
    ['userOotdPosts', memberId],
    () => fetchUserOotdPosts(memberId, 0, 9),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching OOTD posts</div>;
  if (!data) return <div>No data</div>;

  const ootdList = data.result;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {ootdList.map((item) => (
          <div key={item.post.id} className="border p-4 rounded-lg">
            {item.post.images.length > 0 && (
              <img
                src={item.post.images[0].accessUri}
                alt="OOTD"
                className="w-full h-auto rounded-lg"
              />
            )}
            <div className="mt-2">
              <div className="text-gray-600">{item.post.nickName}</div>
              <div className="text-gray-400">{formatDate(item.post.createDateTime)}</div>
              <p>{item.post.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOotd;
