import React from "react";
import { useQuery } from "react-query";
import { fetchOotdPostCount, fetchOotdPosts } from "@/services/ootd.ts/ootdGet";
import Cookies from "js-cookie";
import { UserInfoType } from "@/types/auth";
import { OotdGetResponse } from "@/types/ootd";
import EmptyHeartIcon from '../../../public/empty_heart_default.svg';
import CommentIcon1 from '../../../public/empty_comment_default.svg';
import Image from "next/image";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 9; 

interface MyOotdProps {
  userInfo: UserInfoType;
}

const MyOotd: React.FC<MyOotdProps> = ({ userInfo }) => {
  const [page, setPage] = React.useState(0);

  const accessToken = Cookies.get('accessToken');

  const { data: totalCount, isLoading: isCountLoading, isError: isCountError } = useQuery<number>(
    'ootdPostCount',
    fetchOotdPostCount,
    { enabled: !!accessToken }  
  );
  
  const { data, isLoading, isError } = useQuery<OotdGetResponse>(
    ['ootdPosts', page],
    () => fetchOotdPosts(page, PAGE_SIZE),
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
      <div className="grid grid-cols-3 gap-12">
        {ootdList.map((item) => (
          <div key={item.ootd.id} className="flex-1" onClick={() => handleOotdItemClick(item.post.id)}>
            {item.post.images.length > 0 && (
              <img src={item.post.images[0].accessUri} alt="OOTD" className="w-full h-auto rounded-lg" />
            )}
            <div className="flex items-center my-4">
              <img
                src={userInfo.profileImageUrl}
                alt="User Profile"
                className="w-10 h-10 rounded-full mr-2"
              />
              <div className="flex-1">
                <div className="text-[#6b6b6b] text-xl font-normal font-['Pretendard']">{item.member.nickName}</div>
              </div>
              <Image
                  src={EmptyHeartIcon}
                  alt="좋아요"
                  width={20}
                  height={18}
                />
                <span className="mx-2 text-[#cfcfcf]"> {item.post.likeCount}</span>
                <Image
                  src={CommentIcon1}
                  alt="좋아요"
                  width={18}
                  height={18}
                />
                  <span className="mx-2 text-[#cfcfcf]"> {item.post.commentCount}</span>
            </div>
            <div className="text-[#6b6b6b] text-xl font-normal font-['Pretendard']">{item.post.body}</div>
            <div className="flex gap-2 mt-2">
              {item.post.tags.map((tag: string, index: number) => (
                <span key={index} className="px-4 py-1 bg-neutral-100 rounded-3xl text-xl justify-center items-center gap-2.5 inline-flex text-[#9d9d9d]">
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

export default MyOotd;
