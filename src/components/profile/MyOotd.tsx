import React from "react";
import { useQuery } from "react-query";
import { fetchOotdPostCount, fetchOotdPosts } from "@/services/ootd.ts/ootdGet";
import Cookies from "js-cookie";
import { UserInfoType } from "@/types/auth";
import { OotdGetResponse } from "@/types/ootd";
import { formatDate } from "@/constants/dateFotmat";

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
          <div key={item.ootd.id} className="flex-1">
            {item.post.images.length > 0 && (
              <img src={item.post.images[0].accessUri} alt="OOTD" className="w-full h-auto" />
            )}
            <div className="flex items-center my-4">
              <img
                src={userInfo.profileImageUrl}
                alt="User Profile"
                className="w-20 h-20 rounded-full mr-2"
              />
              <div className="flex-1">
                <div className="text-neutral-500 text-2xl font-normal font-['Pretendard']">{item.post.nickName}</div>
              </div>
              <div className="ml-auto text-neutral-400 text-2xl font-normal font-['Pretendard']">{formatDate(item.post.createDateTime)}</div>
            </div>
            <div className="text-neutral-500 text-2xl font-normal font-['Pretendard']">{item.post.body}</div>
            <div className="flex gap-2 mt-2">
              {item.post.tags.map((tag: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-neutral-100 rounded-2xl text-xl justify-center items-center gap-2.5 inline-flex">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index)}
            className={`mx-1 py-2 px-4 border ${page === index ? 'bg-gray-200' : 'bg-white'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MyOotd;
