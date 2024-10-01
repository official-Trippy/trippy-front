import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Image from "next/image";
import { fetchBookmarkedOotd, fetchBookmarkCount, fetchBookmarkedPost } from "@/services/bookmark/bookmark";
import HeartIcon from '../../../public/heartedIcon.svg';
import EmptyHeartIcon from '../../../public/heartIcon-default.svg';
import CommentIcon1 from '../../../public/commentIcon-default.svg';
import { fetchLikedPosts } from "@/services/ootd.ts/ootdComments";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import DefaultImage from '../../../public/defaultImage.svg';
import { MyAirSVG, MyBusSVG, MyBycicleSVG, MyCarSVG, MyTrainSVG } from "../transportsvg/mypage";
import { colorTicket } from "@/types/board";

const PAGE_SIZE = 12;

const MyBookmark = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [pageOotd, setPageOotd] = useState(0);
  const [pagePost, setPagePost] = useState(0);
  const [totalOotdCount, setTotalOotdCount] = useState(0);
  const [totalPostCount, setTotalPostCount] = useState(0);
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

  useQuery("bookmarkCount", fetchBookmarkCount, {
    onSuccess: (data) => {
      setTotalPostCount(data.postCount);
    },
  });

  const { data: ootdData, isLoading: isOotdLoading } = useQuery(
    ["bookmarkedOotd", pageOotd],
    () => fetchBookmarkedOotd(pageOotd, PAGE_SIZE),
    {
      enabled: activeTab === "ootd" && totalOotdCount > 0,
    }
  );

  const { data: postData, isLoading: isPostLoading } = useQuery(
    ["bookmarkedPost", pagePost],
    () => fetchBookmarkedPost(pagePost, PAGE_SIZE),
    {
      enabled: activeTab === "posts" && totalPostCount > 0,
    }
  );

  console.log(postData)

  const handlePageClick = (pageIndex: number) => {
    setPageOotd(pageIndex);
  };

  const handlePostClick = (postId: number) => {
    router.push(`/ootd/${postId}`);
  };

  const handleBoardLink = (postId: number) => {
    router.push(`/board/${postId}`);
  }

  const renderPagination = (totalCount: number, currentPage: number) => {
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    // totalPages가 1보다 클 때만 페이지네이션 렌더링
    return (
      <>
        {totalPages > 1 && (
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
        )}
      </>
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
          <div>
            <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
              {postData?.result.map((ticektDatas: any) => {

                const getTransportImage = (transport: string, ticketColor: any) => {
                  switch (transport) {
                    case 'Airplane':
                      return <MyAirSVG fillColor={colorTicket[ticketColor]} />;
                    case 'Car':
                      return <MyCarSVG fillColor={colorTicket[ticketColor]} />;
                    case 'Bus':
                      return <MyBusSVG fillColor={colorTicket[ticketColor]} />;
                    case 'Bicycle':
                      return <MyBycicleSVG fillColor={colorTicket[ticketColor]} />;
                    case 'Train':
                      return <MyTrainSVG fillColor={colorTicket[ticketColor]} />;
                    default:
                      return null; // 기본값 또는 대체 이미지
                  }
                };

                console.log(colorTicket[ticektDatas.ticket.ticketColor])
                return (
                  <div key={ticektDatas.ticket.id} className={`flex-1 cursor-pointer `} onClick={() => { handleBoardLink(ticektDatas.post.id) }} >
                    {/* {ticektDatas.post.images.length > 0 && ( */}
                    <div className={`relative w-full pb-[100%] rounded-[1rem] ${colorTicket[ticektDatas.ticket.ticketColor] ? `bg-[${colorTicket[ticektDatas.ticket.ticketColor]}]` : ''}`}> {/* 컨테이너를 정사각형으로 설정 */}
                      <Image
                        src={ticektDatas?.ticket.image.accessUri}
                        alt="OOTD"
                        className="absolute inset-0 w-full h-full object-cover rounded-[1rem] p-[1.3rem]"
                        width={200} // Width and height are for aspect ratio purposes
                        height={200}
                      />
                    </div>
                    {/* )} */}
                    <div className="font-normal font-['Pretendard'] shadowall rounded-[1rem] px-[0.7rem] pb-[0.7rem] pt-[0.3rem] flex">
                      <div className="mx-auto mt-[0.2rem] lg:mt-[1rem] sm-700:mt-[0.2rem]">
                        <div className="flex flex-col">
                          <span className={`text-[0.8rem] lg:text-[0.8rem] xl:text-[1.2rem] font-extrabold font-akira`} style={{ color: colorTicket[ticektDatas.ticket.ticketColor] || 'inherit' }}>
                            PASSENGER
                          </span>
                          <span className="text-[0.8rem] font-medium text-[#6B6B6B]">{ticektDatas.member.memberId}</span>
                        </div>
                        <div className="flex flex-col mt-[0.5rem]">
                          <span className={`text-[1.2rem] font-extrabold font-akira`} style={{ color: colorTicket[ticektDatas.ticket.ticketColor] || 'inherit' }}>DATE</span>
                          <span className="text-[1.2rem] font-medium text-[#6B6B6B]">{ticektDatas.ticket.startDate} ~<br /> {ticektDatas.ticket.endDate}</span>
                        </div>
                        <div className="flex flex-col mt-[0.5rem]">
                          <span className={`text-[1.2rem] font-extrabold font-akira`} style={{ color: colorTicket[ticektDatas.ticket.ticketColor] || 'inherit' }}>GROUP</span>
                          <span className="text-[1.2rem] font-medium text-[#6B6B6B]">{ticektDatas.ticket.memberNum}</span>
                        </div>
                      </div>
                      <div className="mx-auto border border-dashed border-[#CFCFCF]" />
                      <div className="flex flex-col font-extrabold font-akira mx-auto pl-[1rem]">
                        <span className="text-[1.8rem] sm:text-[2.8rem] md:text-[2.4rem] lg:text-[1.8rem] xl:text-[3.2rem]">{ticektDatas.ticket.departureCode}</span>
                        <div className="mx-auto">
                          {getTransportImage(ticektDatas.ticket.transport, ticektDatas.ticket.ticketColor)}
                        </div>
                        <span className="text-[1.8rem] sm:text-[2.8rem] md:text-[2.4rem] lg:text-[1.8rem] xl:text-[3.2rem]">{ticektDatas.ticket.destinationCode}</span>
                      </div>
                    </div>

                  </div>
                )
              }

              )}
            </div>
            <div className="flex w-full justify-center my-16">
              {Array.from({ length: totalPostCount }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageClick(index)}
                  className={`mx-1 py-2 px-4 ${pagePost === index ? 'text-[#fa3463] font-semibold' : 'text-[#cfcfcf] font-normal'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        {activeTab === "ootd" && (
          <div className="h-full">
            {isOotdLoading ? (
              <></>
            ) : (
              <>
                <div className="grid grid-cols-2 md-1000:grid-cols-3 gap-12">
                  {ootdData?.result?.map((item: any) => (
                    <div
                      key={item.ootd.id}
                      className="flex-1 cursor-pointer overflow-hidden"
                      onClick={() => handlePostClick(item.post.id)}
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
                      <div className="mt-4 text-[#6b6b6b] text-xl font-normal text-ellipsis overflow-hidden whitespace-nowrap">
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
                      <div className="flex items-center mt-2 pb-4 justify-start">
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
                    </div>
                  ))}
                </div>
                <div className="mb-[90px] sm-700:mb-0">
                  {renderPagination(totalOotdCount, pageOotd)}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookmark;
