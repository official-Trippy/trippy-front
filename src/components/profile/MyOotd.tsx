import React from "react";
import { useQuery } from "react-query";
import { fetchOotdPosts } from "@/services/ootd.ts/ootdGet";
import { UserInfoType } from "@/types/auth";
import { OotdGetResponse } from "@/types/ootd";

const PAGE_SIZE = 9; 

interface MyOotdProps {
  userInfo: UserInfoType;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

const MyOotd: React.FC<MyOotdProps> = ({ userInfo }) => {
  const [page, setPage] = React.useState(0);

  const { data, isLoading, isError } = useQuery<OotdGetResponse>(
    ['ootdPosts', page],
    () => fetchOotdPosts()
  );

  const totalCount = data?.result?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageClick = (pageIndex: number) => {
    setPage(pageIndex);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error fetching data</div>;
  }

  const ootdList = data.result.ootdList;

  const pages = Array.from({ length: totalPages }, (_, index) =>
    ootdList.slice(index * PAGE_SIZE, index * PAGE_SIZE + PAGE_SIZE)
  );

  return (
    <div className="h-full">
      <h3 className="text-2xl font-bold my-12">나의 OOTD</h3>
      {pages[page] && (
        <div className="grid grid-cols-3 gap-12">
          {pages[page].map((item, index) => (
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
                {item.post.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-neutral-100 rounded-2xl text-xl justify-center items-center gap-2.5 inline-flex">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
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
