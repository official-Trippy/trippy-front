import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Image from "next/image";
import { fetchBookmarkedOotd, fetchBookmarkCount } from "@/services/bookmark/bookmark";
import HeartIcon from '../../../public/heartedIcon.svg';
import EmptyHeartIcon from '../../../public/heartIcon-default.svg';
import CommentIcon1 from '../../../public/commentIcon-default.svg';
import { fetchLikedPosts } from "@/services/ootd.ts/ootdComments";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import DefaultImage from '../../../public/defaultImage.svg';

const PAGE_SIZE = 9;

const MyBookmark = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [pageOotd, setPageOotd] = useState(0); 
  const [totalOotdCount, setTotalOotdCount] = useState(0); 
  const [likedPosts, setLikedPosts] = useState<number[]>([]);  
  const accessToken = Cookies.get('accessToken');
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      fetchLikedPosts().then(setLikedPosts);  
    }
  }, [accessToken]);

  useQuery("bookmarkCount", fetchBookmarkCount, {
    onSuccess: (data) => {
      setTotalOotdCount(data.ootdCount);
    },
  });

  const { data: ootdData, isLoading: isOotdLoading } = useQuery(
    ["bookmarkedOotd", pageOotd],
    () => fetchBookmarkedOotd(pageOotd, PAGE_SIZE),
    {
      enabled: activeTab === "ootd" && totalOotdCount > 0,
    }
  );

  const handlePageClick = (pageIndex: number) => {
    setPageOotd(pageIndex);
  };

  const handlePostClick = (postId: number) => {
    router.push(`/ootd/${postId}`); 
  };

  const renderPagination = (totalCount: number, currentPage: number) => {
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    return (
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index)}
            className={`mx-1 py-2 px-4 ${currentPage === index ? 'text-[#fa3463] font-semibold' : 'text-[#cfcfcf] font-normal'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="h-[400px]">
      <div className="flex">
        <button
          className={`p-2 text-2xl ${activeTab === "posts" ? "text-[#fa3463] font-semibold" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          게시글
        </button>
        <button
          className={`ml-[10px] p-2 text-2xl ${activeTab === "ootd" ? "text-[#fa3463] font-semibold" : ""}`}
          onClick={() => setActiveTab("ootd")}
        >
          OOTD
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        {activeTab === "posts" && (
          // todo: bookmark 한 게시글 post 레이아웃 영역 //
          <></>
        )}
        {activeTab === "ootd" && (
          <div className="h-full">
            {isOotdLoading ? (
              <></>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-12">
                  {ootdData?.result?.map((item: any) => (
                    <div 
                      key={item.ootd.id} 
                      className="flex-1 cursor-pointer"
                      onClick={() => handlePostClick(item.post.id)} 
                    >
                        <div className="flex items-center pb-4">
                        <img
                          src={item.member.profileUrl || DefaultImage}
                          alt="User Profile"
                          className="w-10 h-10 rounded-full mr-2"
                        />
                        <div className="flex-1 overflow-hidden">
                          <div className="text-[#6b6b6b] text-xl font-normal font-['Pretendard'] overflow-hidden text-ellipsis whitespace-nowrap"
                            style={{
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden',   
                              textOverflow: 'ellipsis'
                            }}>
                            {item.member.nickName}
                          </div>
                        </div>
                      </div>
                      {item.post.images?.length > 0 && (
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
                      <div className="flex items-center my-4 justify-end">
                        <Image
                          src={likedPosts.includes(item.post.id) ? HeartIcon : EmptyHeartIcon} 
                          alt="좋아요"
                          width={20}
                          height={20}
                        />
                        <span className="mx-2 text-[#cfcfcf]">{item.post.likeCount}</span>
                        <Image
                          src={CommentIcon1}
                          alt="댓글"
                          width={20}
                          height={20}
                        />
                        <span className="mx-2 text-[#cfcfcf]">{item.post.commentCount}</span>
                      </div>
                      <div className="text-[#6b6b6b] text-xl font-normal text-ellipsis overflow-hidden whitespace-nowrap">
                        {item.post.body}
                      </div>
                      <div className="tag-container">
                        {item.post.tags?.map((tag: string, index: number) => (
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
                {renderPagination(totalOotdCount, pageOotd)}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookmark;
