import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchUserOotdPosts, getUserTotalOotdCount } from "@/services/ootd.ts/ootdGet";
import { OotdGetResponse } from "@/types/ootd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeartIcon from '../../../public/heartedIcon.svg';
import EmptyHeartIcon from '../../../public/heartIcon-default.svg';
import CommentIcon1 from '../../../public/commentIcon-default.svg';
import Cookies from "js-cookie";
import { fetchLikedPosts } from "@/services/ootd.ts/ootdComments";
import DefaultImage from '../../../public/defaultImage.svg';

const PAGE_SIZE = 12;

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
     <div className="grid grid-cols-2 md-1000:grid-cols-3 gap-12">
        {ootdList.map((item) => (
          <div
            key={item.ootd.id}
            className="flex-1 cursor-pointer overflow-hidden"
            onClick={() => handleOotdItemClick(item.post.id)}
          >
            <div className="flex items-center pb-4">
              <div className="relative w-[24px] h-[24px]">
              <Image
                src={item.member.profileUrl || DefaultImage}
                alt="User Profile"
                objectFit="cover"
                layout="fill"
                className="rounded-full mr-2"
              />
              </div>
              <div className="ml-[5px] flex-1 overflow-hidden">
                <div className="text-[#6b6b6b] text-xl font-normal font-['Pretendard'] overflow-hidden text-ellipsis whitespace-nowrap"  style={{
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',   
                  textOverflow: 'ellipsis'
                }}>
                  {item.member.nickName}
                </div>
              </div>
            </div>
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
          <div className="mt-4 text-[#6b6b6b] text-xl font-normal font-['Pretendard'] overflow-hidden text-ellipsis whitespace-nowrap">
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
            <div className="flex items-center mt-2 my-4 justify-start">
              <Image
                src={likedPosts.includes(item.post.id) ? HeartIcon : EmptyHeartIcon}
                alt="좋아요"
                width={20}
                height={10}
                style={{
                    width: '20px',
                    height: '18px',
                }}
              />
              <span className="mx-2 text-[#cfcfcf]"> {item.post.likeCount}</span>
              <Image
                src={CommentIcon1}
                alt="댓글"
                width={20}
                height={20}
                style={{
                    width: '20px',
                    height: '18px',
                }}
              />
              <span className="mx-2 text-[#cfcfcf]"> {item.post.commentCount}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8">
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
