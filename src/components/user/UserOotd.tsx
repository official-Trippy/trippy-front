import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchUserOotdPosts, getUserTotalOotdCount } from "@/services/ootd.ts/ootdGet";
import { OotdGetResponse } from "@/types/ootd";
import EmptyHeartIcon from '../../../public/empty_heart_default.svg';
import CommentIcon1 from '../../../public/empty_comment_default.svg';
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeartIcon from '../../../public/icon_heart.svg';
import Cookies from "js-cookie";
import { fetchLikedPosts } from "@/services/ootd.ts/ootdComments";

const PAGE_SIZE = 9;

interface UserOotdProps {
  memberId: string;
}

const UserOotd: React.FC<UserOotdProps> = ({ memberId }) => {
  const [page, setPage] = useState(0); 
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const accessToken = Cookies.get('accessToken');

  useEffect(() => {
    if (accessToken) {
      fetchLikedPosts().then(setLikedPosts);
    }
  }, [accessToken]);

  const { data: totalCount, isLoading: isCountLoading, isError: isCountError } = useQuery<number>(
    ['userOotdPostCount', memberId],
    () => getUserTotalOotdCount(memberId),
    { enabled: !!memberId }
  );


  const { data, isLoading, isError } = useQuery<OotdGetResponse>(
    ['userOotdPosts', memberId, page],
    () => fetchUserOotdPosts(memberId, page, PAGE_SIZE),  
    { enabled: !!totalCount }
  );

  const totalPages = totalCount ? Math.ceil(totalCount / PAGE_SIZE) : 0;

  const handlePageClick = (pageIndex: number) => {
    setPage(pageIndex);
  };

  const router = useRouter();

  const handleOotdItemClick = (id: number) => {
    router.push(`/ootd/${id}`);
  };

  if (isCountLoading || isLoading) {
    return null;
  }

  if (isCountError || isError || !data) {
    return null;
  }

  const ootdList = data.result;

  return (
    <div className="h-full">
      <div className="grid grid-cols-2 gap-12 lg:grid-cols-3">
        {ootdList.map((item) => (
          <div
            key={item.ootd.id}
            className="flex-1 cursor-pointer"
            onClick={() => handleOotdItemClick(item.post.id)}
          >
            {item.post.images.length > 0 && (
              <div className="relative w-full pb-[100%]">
                <Image
                  src={item.post.images[0].accessUri}
                  alt="OOTD"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  width={200}
                  height={200}
                />
              </div>
            )}
            <div className="flex items-center my-4">
              <img
                src={item.member.profileUrl}
                alt="User Profile"
                className="w-10 h-10 rounded-full mr-2"
              />
              <div className="flex-1">
                <div className="text-[#6b6b6b] text-xl font-normal font-['Pretendard']">
                  {item.member.nickName}
                </div>
              </div>
              <Image
                src={likedPosts.includes(item.post.id) ? HeartIcon : EmptyHeartIcon}
                alt="좋아요"
                width={20}
                height={18}
              />
              <span className="mx-2 text-[#cfcfcf]"> {item.post.likeCount}</span>
              <Image
                src={CommentIcon1}
                alt="댓글"
                width={18}
                height={18}
              />
              <span className="mx-2 text-[#cfcfcf]"> {item.post.commentCount}</span>
            </div>
            <div className="text-[#6b6b6b] text-xl font-normal font-['Pretendard'] text-ellipsis overflow-hidden whitespace-nowrap">
              {item.post.body}
            </div>
            <div className="tag-container">
              {item.post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="tag-item px-4 py-1 bg-neutral-100 rounded-3xl text-xl text-[#9d9d9d]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center my-16">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index)}
            className={`mx-1 py-2 px-4 ${page === index ? 'text-[#fa3463] font-semibold' : 'text-[#cfcfcf] font-normal'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserOotd;
