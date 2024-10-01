"use client";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import {
  useRouter,
  useSearchParams,
  useServerInsertedHTML,
} from "next/navigation";
import Header from "@/components/shared/header/Header";
import { useQuery } from "react-query";
import { getBoardBookMark, getPost } from "@/services/board/get/getBoard";
import heartImg from "@/dummy/heart.svg";
import bottomimg from "@/dummy/sebu.svg";
import nonheartImg from "@/dummy/heartbin.svg";
import moment from "@/dummy/moment.svg";
import { MemberInfo } from "@/services/auth";
import Cookies from "js-cookie";
import postComments from "@/services/board/post/postComment";
import getBoardComment from "@/services/board/get/getBoardComment";
import { useUserStore } from "@/store/useUserStore";
import postBoardLike from "@/services/board/post/postBoardLike";
import getBoardLike from "@/services/board/get/getBoardLike";
import deleteLike from "@/services/board/delete/deleteLike";
import upup from "@/dummy/upup.svg";
import commentPink from "@/dummy/comentpink.svg";
import { useFollowingStore } from "@/store/useFollowingStore";
import { doFollow, unfollow } from "@/services/follow";
import FollowButton from "@/components/followControl/followButton";
import { colorTicket } from "@/types/board";
import deleteBoard from "@/services/board/delete/deleteBoard";
import Swal from "sweetalert2";
import menubars from "@/dummy/menubars.svg";
import deleteReply from "@/services/board/delete/deleteReply";
import {
  PostAirSVG,
  PostBusSVG,
  PostBycicleSVG,
  PostCarSVG,
  PostTrainSVG,
} from "@/components/transportsvg/post";
import backbutton from "@/dummy/backbutton.svg";
import { updatePostComment } from "@/services/board/patch/editComments";
import BookmarkIcon from "../../../../public/icon_bookmark.svg";
import BookmarkedIcon from "../../../../public/bookmark-fill.svg";
import { addBookmark, deleteBookmark } from "@/services/bookmark/bookmark";
import { formatDate, formatTimetoDays } from "@/constants/dateFotmat";
import { likePostList } from "@/services/ootd.ts/ootdComments";
import DownIcon from '../../../../public/arrow_down.svg';
import UpIcon from '../../../../public/icon_up.svg';
import HeartIcon from '../../../../public/heartedIcon.svg';
import EmptyHeartIcon from '../../../../public/heartIcon-default.svg';
import EmptyHeartIcon2 from '../../../../public/heartIcon-fill.svg';
import CommentIcon from '../../../../public/commentIcon-fill.svg';
import CommentIcon1 from '../../../../public/commentIcon-default.svg';
import { fetchRecommendedSpots } from "@/services/ootd.ts/ootdGet";
import SkeletonOotdDetailRecommend from "@/components/pages/ootd/SkeletonOotdDetailRecommend";
import RecommendedSpot from "@/components/ootd/RecommendedSpot";



export default function BoardPage({ params }: { params: { boardId: number } }) {
  const accessToken = Cookies.get("accessToken");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [comment, setComment] = useState("");
  const [replyComment, setReplyComment] = useState("");
  const { userInfo, loading, fetchUserInfo } = useUserStore();
  const [replyId, setReplyId] = useState(0);
  const [replymemId, setReplyMemId] = useState("");
  const [replyNickname, setReplyNickname] = useState("");
  const [isReplyOpen, setIsReplyOpen] = useState(true);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [parentIds, setParentIds] = useState(0);
  const [soloReply, setSoloReply] = useState(false);
  const [replyStates, setReplyStates] = useState<boolean[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [showComments, setShowComments] = useState<boolean>(!!accessToken);
  const [showLikes, setShowLikes] = useState<boolean>(false);
  const [isLoadingLikes, setIsLoadingLikes] = useState<boolean>(false);
  const [likeList, setLikeList] = useState<any[]>([]);


  useEffect(() => {
    const fetchLikeList = async () => {
      setIsLoadingLikes(true);
      try {
        const result = await likePostList(Number(params.boardId));
        if (result.isSuccess && Array.isArray(result.result.likeList)) {
          setLikeList(result.result.likeList);
        } else {
          setLikeList([]);
        }
      } catch (error) {
        console.error('Error fetching like list:', error);
        setLikeList([]);
      }
      setIsLoadingLikes(false);
    };

    if (showLikes) {
      fetchLikeList();
    }
  }, [showLikes, Number(params.boardId)]);

  const [editingIndexes, setEditingIndexes] = useState<{
    [key: number]: boolean;
  }>({}); // 수정 상태를 관리할 객체
  const [updateReply, setUpdateReply] = useState("");
  const [myUpdateReply, setMyUpdateReply] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleEdit = (index: number) => {
    setEditingIndexes((prev) => ({
      ...prev,
      [index]: !prev[index], // 해당 인덱스의 수정 상태 토글
    }));
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toggleMyEdit = (index: number) => {
    setMyUpdateReply((prev) => ({
      ...prev,
      [index]: !prev[index], // 해당 인덱스의 수정 상태 토글
    }));
  };

  const handleEditContent = (index: number, content: string) => {
    // 수정된 내용을 처리하는 로직 추가
    setUpdateReply(content);
    toggleEdit(index); // 수정 상태 다시 토글
  };

  console.log(editingIndexes);

  const { data: postData, refetch: postRefetch, isLoading: postLoading } = useQuery({
    queryKey: ["postData"],
    queryFn: () => getPost(Number(params.boardId)),
  });

  const { data: postCommentData, refetch: commentRefetch } = useQuery({
    queryKey: ["postCommentData"],
    queryFn: () => getBoardComment(Number(params.boardId)),
  });

  const [replyOpen, setReplyOpen] = useState(
    Array(postCommentData?.result.length).fill(false)
  );
  const [rreplyOpen, setRreplyOpen] = useState(
    Array(postCommentData?.result.length).fill(false)
  );
  console.log(replyOpen, postCommentData);

  const { data: postLikeData, refetch: LikeRefetch } = useQuery({
    queryKey: ["postLikeData"],
    queryFn: () => getBoardLike(Number(params.boardId)),
  });

  const {
    data: memberDatas,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["member"],
    queryFn: () => MemberInfo(accessToken),
    onError: (error) => {
      // 에러 처리 로직
      console.error(error);
    },
  });

  const { data: bookmark, refetch: bookmarkRefetch, isLoading: bookMarkLoading } = useQuery({
    queryKey: ["bookmark"],
    queryFn: () => getBoardBookMark(Number(params.boardId)),
    enabled: !!Number(params.boardId),
  });

  console.log(bookmark);

  console.log(postData?.result.member.memberId);
  console.log(memberDatas);
  const postMemberId = postData?.result.member.memberId;
  const userMemberId = memberDatas?.result.memberId;

  const { following, fetchFollowing } = useFollowingStore();

  useEffect(() => {
    if (postData) {
      fetchFollowing(userMemberId);
    }
  }, [postData]);
  console.log(following);

  const handleGoProfile = (memberId: string) => {
    if (memberId) {
      router.push(`/user/${memberId}`);
    } else {
      router.push('/mypage'); // memberId가 없을 경우 내 페이지로 이동
    }
  };

  const isFollowing =
    Array.isArray(following.followings) &&
    following.followings.some(
      (follow) => follow.memberId === postData?.result.member.memberId
    );

  console.log("Post Member ID:", postMemberId);
  console.log("Is Following:", following);
  console.log(isFollowing);

  const followHandler = async (memberId: string | undefined) => {
    if (!memberId) return; // memberId가 undefined인 경우 함수를 종료
    if (!isFollowing) {
      try {
        const response = await doFollow(memberId);
        console.log("Follow response:", response);
        if (accessToken) {
          fetchFollowing(postMemberId);
        }
      } catch (error) {
        console.error("Error following member:", error);
      }
    } else {
      try {
        await unfollow(memberId);
        if (accessToken) {
          fetchFollowing(postMemberId);
        }
      } catch (error) {
        console.error("Error unfollowing member:", error);
      }
    }
  };

  const createdAt = postData?.result.post.createDateTime;
  const formattedDate = formatDate(createdAt);

  const handleProfileClick = () => {
    console.log("click");
    if (postData.result.member.memberId == userInfo.memberId) {
      router.push("/mypage");
    } else {
      router.push(`/user/${postData.result.member.memberId}`);
    }
  };

  console.log(postData, userInfo);

  const LikeHandler = async () => {
    try {
      await postBoardLike(Number(params.boardId));
      LikeRefetch();
      postRefetch();
    } catch (e) { }
  };

  const LikeDeleteHandler = async () => {
    try {
      await deleteLike(Number(params.boardId));
      LikeRefetch();
      postRefetch();
    } catch (e) { }
  };

  const commentHandler = async () => {
    const commentData = {
      postId: Number(params.boardId),
      content: comment,
      status: "PUBLIC",
    };
    try {
      console.log(commentData);
      await postComments(commentData);
      setComment("");
      commentRefetch();
      postRefetch();
    } catch (e) { }
  };

  const commentEditHandler = async (commentIds: number) => {
    try {
      await updatePostComment(commentIds, updateReply);
      toggleEdit(commentIds);
      setUpdateReply("");
      commentRefetch();
    } catch (e) { }
  };
  const commentReplyHandler = async (
    replymemIds: string,
    replyNicknames: string,
    mentionCommentIds: number
  ) => {
    const commentData = {
      postId: Number(params.boardId),
      content: replyComment,
      status: "PUBLIC",
      parentId: parentIds,
      mentionMemberId: replymemIds,
      mentionMemberNickName: replyNicknames,
      mentionCommentId: mentionCommentIds,
    };

    try {
      console.log(commentData);
      await postComments(commentData);
      setReplyComment("");
      setReplyOpen(Array(postCommentData?.result.length).fill(false));
      setReplyStates(Array(postCommentData?.result.length).fill(false));
      commentRefetch();
      postRefetch();
    } catch (e) { }
  };

  const toggleReply = (index: number) => {
    const updatedReplyOpen = [...replyOpen];
    updatedReplyOpen[index] = !updatedReplyOpen[index]; // 해당 인덱스의 상태 토글
    setReplyOpen(updatedReplyOpen);
  };

  const toggleRreply = (index: number) => {
    const updatedRreplyOpen = [...rreplyOpen];
    updatedRreplyOpen[index] = !updatedRreplyOpen[index]; // 해당 인덱스의 상태 토글
    setRreplyOpen(updatedRreplyOpen);
  };



  const replaceImagesInBody = (body: any, images: any) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, "text/html");
    const imgTags = doc.querySelectorAll("img");

    imgTags.forEach((imgTag, index) => {
      if (images[index]) {
        const newImage = document.createElement("div"); // 새로운 div로 대체
        newImage.innerHTML = `<Image class="max-w-[60rem] max-h-[60rem]" src="${images[index].accessUri}" alt="" width="900" height="900" />`;
        imgTag.replaceWith(newImage);
      }
    });

    return doc.body.innerHTML; // 변환된 HTML 반환
  };

  const deleteBoardHandler = async () => {
    await deleteBoard(params.boardId);
    Swal.fire({
      icon: "success",
      title: "정상적으로 삭제되었습니다.",
      confirmButtonText: "확인",
      confirmButtonColor: "#FB3463",
      customClass: {
        popup: "swal-custom-popup",
        icon: "swal-custom-icon",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/");
      }
    });
  };
  console.log(userInfo);
  const deleteReplyHandler = async (replyIdx: number) => {
    await deleteReply(replyIdx);
    Swal.fire({
      icon: "success",
      title: "정상적으로 삭제되었습니다.",
      confirmButtonText: "확인",
      confirmButtonColor: "#FB3463",
      customClass: {
        popup: "swal-custom-popup",
        icon: "swal-custom-icon",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        commentRefetch();
      }
    });
  };

  const editBoardEdit = () => {
    router.push(`/edits/${params.boardId}`);
  };

  const loginEdit = () => {
    router.push(`/login`);
  };

  const images = postData?.result.post.images || [];
  const bodyWithImages = replaceImagesInBody(
    postData?.result.post.body,
    images
  );

  const handleReplyToggle = (
    index: number,
    id: number,
    nickName: string,
    memberId: string
  ) => {
    // 해당 인덱스의 답글 입력란 상태를 토글
    setReplyStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index]; // 현재 상태를 반전
      return newStates;
    });
    setParentIds(id);
    setReplyNickname(nickName);
    setReplyMemId(memberId);
  };
  console.log(replyId);

  const getTransportImage = (transport: string, ticketColor: any) => {
    switch (transport) {
      case "Airplane":
        return <PostAirSVG fillColor={colorTicket[ticketColor]} />;
      case "Car":
        return <PostCarSVG fillColor={colorTicket[ticketColor]} />;
      case "Bus":
        return <PostBusSVG fillColor={colorTicket[ticketColor]} />;
      case "Bicycle":
        return <PostBycicleSVG fillColor={colorTicket[ticketColor]} />;
      case "Train":
        return <PostTrainSVG fillColor={colorTicket[ticketColor]} />;
      default:
        return null; // 기본값 또는 대체 이미지
    }
  };


  const handleToggleLikes = () => {
    setShowLikes(!showLikes);

    if (!showLikes) setIsReplyOpen(false);
  };

  const bookMarkHandler = async () => {
    try {
      if (bookmark.result) {
        await deleteBookmark(Number(params.boardId));
      } else {
        await addBookmark(Number(params.boardId));
      }

      postRefetch();
      bookmarkRefetch();
    } catch (e) {
    } finally {
    }
  };
  // const router = useRouter();

  const handleBackButtonClick = () => {
    router.back(); // 이전 페이지로 이동
  };

  const handleTagClick = (tag: string) => {
    router.push(`/search/${encodeURIComponent(tag)}`);
  };
  console.log(postCommentData)


  const itemsPerPage = 18;

  const renderLikeList = (likes: any[]) => {
    if (!Array.isArray(likes)) {
      return null;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLikes = likes.slice(startIndex, endIndex);

    const totalPages = Math.ceil(likes.length / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <div className="w-full bg-white rounded-lg shadow-md py-4 mt-8">
        <div className="grid grid-cols-2 xs-400:grid-cols-3 gap-0">
          {paginatedLikes.map((like, index) => (
            <div key={index} className="my-4 like-section px-4 py-0 sm-700:px-4 sm-700:py-4">
              <div className="flex items-center ml-[20px] xs-400:justify-center xs-400:ml-0 py-2 cursor-pointer" onClick={() => handleGoProfile(like.memberId)}>
                <div className="min-w-12 min-h-12 w-12 h-12 sm-700:w-16 sm-700:h-16 relative mr-4">
                  <Image
                    src={like.profileUrl || userInfo.profileImageUrl}
                    alt="프로필 이미지"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div>
                  <div className="text-gray-800 text-sm sm:text-base truncate whitespace-nowrap overflow-hidden">
                    {like.nickName}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 버튼 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            {pages.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 mx-1 rounded ${currentPage === pageNumber ? 'text-[#fa3463] font-semibold' : 'text-[#cfcfcf] font-normal'}`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };


  if (postLoading || isLoading || bookMarkLoading) {
    return <SkeletonOotdDetailRecommend />; // 데이터가 로딩 중일 때
  }

  return (
    <div>
      {/* {window.innerWidth > 600 && (<Header />)} */}
      <div className="w-[90%] sm-700:w-[50%] mx-auto ">
        <div className="flex text-[#6B6B6B] font-semibold text-[2rem]">
          {window.innerWidth > 600 ? (
            <span className="mt-[8rem]">
              {postData?.result.member.blogName}
            </span>
          ) : (
            <div className="flex w-full items-center justify-center mt-[1.2rem]">
              <button onClick={handleBackButtonClick}>
                <Image src={backbutton} alt="" />
              </button>
              <span className="text-[#171717] flex mx-auto">
                {postData?.result.member.blogName}
              </span>
            </div>
          )}
          {memberDatas?.result.blogName ===
            postData?.result.member.blogName && (
              <div className="flex ml-auto mt-[1rem] gap-[1rem]">
                <Image
                  className="cursor-pointer"
                  src={menubars}
                  alt=""
                  onClick={() => {
                    setIsOpenMenu(!isOpenMenu);
                  }}
                />
                {isOpenMenu && (
                  <div
                    className="absolute text-[1.2rem] flex flex-col bg-white shadow-md rounded-md mt-[6rem] shadow-2xl -ml-[5rem] animate-dropdown z-20 rounded-[0.8rem]"
                    style={{ opacity: 0, transform: "translateY(-10px)" }}
                  >
                    {" "}
                    {/* 스타일 추가 */}
                    <span
                      className="pb-3 pt-2 px-[2rem] text-neutral-900 dark:text-white cursor-pointer text-center font-bold"
                      onClick={editBoardEdit}
                    >
                      수정
                    </span>
                    <div className="border-t border-gray-300" />
                    <span
                      className="pb-2 pt-3 px-[2rem] text-[#ff4f4f] cursor-pointer text-center font-bold"
                      onClick={deleteBoardHandler}
                    >
                      삭제
                    </span>
                  </div>
                )}
              </div>
            )}
        </div>
        <div className="flex items-center mt-[2.6rem]">
          <h1 className="text-[2.4rem] xl:text-[3.6rem] sm-700:text-[2.4rem] font-bold">
            {postData?.result.post.title}
          </h1>
        </div>
        <div className="py-[2rem] ">
          <div className="flex mb-[3rem] items-center">
            <div className="flex w-full h-[9rem] border-b border-[#CFCFCF] items-center]">
              <Image
                src={postData?.result.member.profileUrl}
                className="w-[6rem] h-[6rem] rounded-[6rem]"
                alt=""
                width={60}
                height={60}
                onClick={handleProfileClick}
              />
              <div className="flex flex-col text-[2rem] ml-[2rem]">
                <span className="font-medium text-neutral-900 dark:text-white">
                  {postData?.result.member.nickName}
                </span>
                <span className="text-[#9D9D9D] font-normal">
                  {formattedDate}
                </span>
              </div>
              <div className="ml-auto flex items-center">
                <FollowButton
                  postMemberId={postMemberId}
                  userMemberId={userMemberId}
                />
                <div className="ml-[4rem] flex">
                  <Image
                    className="cursor-pointer"
                    src={bookmark?.result ? BookmarkedIcon : BookmarkIcon}
                    alt=""
                    onClick={() => {
                      bookMarkHandler();
                    }}
                  />
                  <span className="text-[#9D9D9D] text-[1.2rem] ml-[0.5rem] items-end flex">
                    {postData?.result.post.bookmarkCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-[11rem] xl:h-[32rem] lg:h-[20rem] sm:h-[11rem] border border-[#D9D9D9] rounded-[1rem] flex mt-[5rem] shadowall">
            <div
              className={`w-[1.4rem] xl:w-[5rem] lg:w-[3rem] sm:w-[1.4rem] h-full ${colorTicket[postData.result.ticket.ticketColor] ? `bg-[${colorTicket[postData.result.ticket.ticketColor]}]` : ""} rounded-l-[1rem]`}
            ></div>
            <div className="w-full mt-[1.7rem] xl:mt-[5rem] lg:mt-[3rem] sm:mt-[1.7rem] relative">
              <div className="flex justify-center">
                <div>
                  <h1 className="text-[2rem] xl:text-[6rem] lg:text-[3rem] sm:text-[2rem] text-[#292929] font-extrabold font-akira">
                    {postData?.result.ticket.departureCode}
                  </h1>
                  <div className="w-[5rem] xl:w-[16rem] lg:w-[10rem] sm:w-[5rem] pl-[2rem] rounded-[0.8rem] flex">

                    <span className={`text-[#9D9D9D] text-[0.8rem] font-semibold ${postData?.result.ticket.departure?.length > 5 || postData?.result.ticket.destination?.length > 5 ? 'text-[2rem]' : 'xl:text-[2.4rem] lg:text-[2rem] sm:text-[0.8rem]'}`}>
                      {postData?.result.ticket.departure}
                    </span>
                  </div>
                </div>
                <div className="relative flex bg-white mt-0 xl:mt-[2.8rem] lg:mt-[0.8rem] sm:mt-0 w-[1.7rem] lg:w-[3.2rem] sm:w-[1.7rem] h-[1.7rem] lg:h-[2.8rem] sm:h-[1.7rem] z-10 mx-[3%] xl:mx-[9%] sm:mx-[3%]">
                  {getTransportImage(
                    postData?.result.ticket.transport,
                    postData?.result.ticket.ticketColor
                  )}
                </div>
                <div className="">
                  <h1 className="text-[2rem] xl:text-[6rem] lg:text-[3rem] sm:text-[2rem] text-[#292929] font-extrabold font-akira">
                    {postData?.result.ticket.destinationCode}
                  </h1>
                  <div className="w-[5rem] xl:w-[16rem] lg:w-[10rem] sm:w-[5rem] pl-[2rem] rounded-[0.8rem] flex">
                    <span className={`text-[#9D9D9D] text-[0.8rem] font-semibold ${postData?.result.ticket.destination?.length > 5 || postData?.result.ticket.departure?.length > 5 ? 'text-[2rem]' : 'xl:text-[2.4rem] lg:text-[2rem] sm:text-[0.8rem]'}`}>
                      {postData?.result.ticket.destination}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-[95%] border xl:border-2 sm:border border-dashed border-[#CFCFCF] my-[1.1rem] xl:my-[4rem] lg:my-[2rem] sm:my-[1.1rem] mx-auto relative z-0" />
              <div
                className={`flex justify-center text-[0.5rem] xl:text-[1.4rem] lg:text-[1rem] sm:text-[0.5rem] font-extrabold text-[#55FBAF] font-akira`}
                style={{
                  color:
                    colorTicket[postData?.result.ticket.ticketColor] ||
                    "inherit",
                }}
              >
                <span className="w-[5rem] xl:w-[16rem] lg:w-[10rem] sm:w-[5rem]">
                  PASSENGER
                </span>
                <span className="w-[10rem] xl:w-[25rem] lg:w-[18rem] sm:w-[10rem] ml-[1rem]">
                  DATE
                </span>
                <span className="w-[2rem] xl:w-[8rem] lg:w-[4rem] sm:w-[2rem]">
                  GROUP
                </span>
              </div>
              <div
                className={`flex justify-center text-[0.5rem] xl:text-[1.4rem] lg:text-[1rem] sm:text-[0.5rem] font-extrabold text-[#6B6B6B]`}
              >
                <span className="w-[5rem] xl:w-[16rem] lg:w-[10rem] sm:w-[5rem]">
                  {postMemberId}
                </span>
                <span className="w-[10rem] xl:w-[25rem] lg:w-[18rem] sm:w-[10rem] ml-[1rem]">
                  {postData?.result.ticket.startDate} ~{" "}
                  {postData?.result.ticket.endDate}
                </span>
                <span className="w-[2rem] xl:w-[8rem] lg:w-[4rem] sm:w-[2rem]">
                  {postData?.result.ticket.memberNum}
                </span>
              </div>
            </div>
            <div
              className={`w-[15rem] xl:w-[40rem] lg:w-[20rem] sm:w-[15rem] h-full ${colorTicket[postData.result.ticket.ticketColor] ? `bg-[${colorTicket[postData.result.ticket.ticketColor]}]` : ""}  rounded-r-[1rem] ml-auto`}
            >
              <div className="absolute">
                <div className="relative bg-white w-[1.3rem] xl:w-[4rem] sm:w-[1.3rem] h-[1.3rem] xl:h-[4rem] sm:h-[1.3rem] rounded-full -mt-[0.6rem] xl:-mt-[2rem] sm:-mt-[0.6rem] -ml-[0.8rem] xl:-ml-[2rem] sm:-ml-[0.8rem]"></div>
                <div className="relative bg-white w-[1.3rem] xl:w-[4rem] sm:w-[1.3rem] h-[1.3rem] xl:h-[4rem] sm:h-[1.3rem] rounded-full mt-[9.4rem] xl:mt-[28rem] sm:mt-[9.4rem] -ml-[0.8rem] xl:-ml-[2rem] sm:-ml-[0.8rem]"></div>
              </div>
              <label className="w-full h-full flex" htmlFor="input-file">
                <div className="flex flex-col m-auto">
                  <Image
                    className="w-[9rem] xl:w-[22rem] lg:w-[18rem] sm:w-[9rem] h-[9rem] xl:h-[26rem] lg:h-[18rem] sm:h-[9rem] rounded-[1rem] object-cover"
                    src={postData?.result.ticket.image.accessUri}
                    alt=""
                    width={230}
                    height={260}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="py-[5rem] min-h-[100rem] ">
          {/* {images.map((image, index) => (
                        <Image
                            className="max-w-[60rem] max-h-[60rem]"
                            src={image.accessUri}
                            alt=""
                            key={index}
                            width={900}
                            height={900}
                        />
                    ))} */}
          <span
            className="text-[1.6rem] font-medium"
            dangerouslySetInnerHTML={{ __html: bodyWithImages }}
          />
        </div>
        <div className="flex flex-wrap">
          {postData?.result.post.tags.map((tagData: string, index: number) => (
            <span
              key={index}
              className="cursor-pointer w-fit px-[0.8rem] py-[0.4rem] mt-[1.2rem] mr-[0.5rem] bg-[#F5F5F5] text-[1.3rem] text-[#9d9d9d] rounded-[1.6rem]"
              onClick={() => {
                handleTagClick(tagData);
              }}
            >
              {tagData}
            </span>
          ))}
        </div>
        {/* 댓글기능 */}
        <div className="w-full h-[7.5rem] mt-[8rem] flex items-center">
          {postLikeData?.result ? (
            <Image
              className="cursor-pointer"
              src={HeartIcon}
              alt=""
              width={24}
              height={24}
              onClick={LikeDeleteHandler}
            />
          ) : (
            <Image
              className="cursor-pointer"
              src={showLikes ? EmptyHeartIcon2 : EmptyHeartIcon}
              alt=""
              width={24}
              height={24}
              onClick={LikeHandler}
            />
          )}
          <span className="text-[1.6rem] font-normal text-[#6B6B6B] mx-[0.5rem]">
            {postData?.result.post.likeCount}
          </span>
          <Image src={showLikes ? UpIcon : DownIcon} alt="" width={24} height={24} onClick={handleToggleLikes} />

          {isReplyOpen ? (
            <Image
              className="ml-[2rem]"
              src={CommentIcon}
              alt=""
              width={24}
              height={24}
            />
          ) : (
            <Image
              className="ml-[2rem]"
              src={CommentIcon1}
              alt=""
              width={24}
              height={24}
            />
          )}
          <span
            className={`text-[1.6rem] font-normal mx-[0.5rem] ${isReplyOpen ? "text-[#FB3463]" : "text-[#6B6B6B]"} `}
          >
            {postData?.result.post.commentCount}
          </span>
          {isReplyOpen ? (
            <Image
              className="cursor-pointer"
              src={upup}
              alt=""
              width={24}
              height={24}
              onClick={() => setIsReplyOpen(false)}
            />
          ) : (
            <Image
              className="cursor-pointer"
              src={bottomimg}
              alt=""
              width={24}
              height={24}
              onClick={() => { setIsReplyOpen(true); setShowLikes(false); }}
            />
          )}
        </div>
        {accessToken ? (
          <div className="mb-[10rem]">
            {isReplyOpen && (
              <div>
                {userInfo && (
                  <div className="w-full h-[9.3rem] shadowall pl-[1.7rem] pt-[1.4rem] flex rounded-[0.8rem]">
                    <div className="w-full">
                      <div className="flex items-center">
                        <Image
                          className="w-[2.8rem] h-[2.8rem] flex items-center rounded-[4.5rem]"
                          src={memberDatas?.result.profileImageUrl}
                          alt=""
                          width={28}
                          height={28}
                        />
                        <span className="ml-[1.4rem] text-[1.8rem] font-semibold flex items-center">
                          {memberDatas?.result.nickName}
                        </span>
                      </div>
                      <input
                        className="w-full outline-none ml-[4.5rem] text-[1.4rem] font-normal"
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="블로그가 훈훈해지는 댓글 부탁드립니다."
                      />
                    </div>
                    <button
                      className="hover:bg-[#292929] hover:text-white bg-[#F5F5F5] text-[#292929] rounded-[0.8rem] text-[1.6rem] font-semibold w-[8.6rem] h-[3.5rem] flex ml-auto mr-[1.4rem] items-center justify-center"
                      onClick={commentHandler}
                    >
                      입력
                    </button>
                  </div>
                )}
                {postCommentData?.result.length !== 0 && (
                  <div
                    className={`w-full h-full shadowall px-[2rem] lg:px-[4.7rem] sm:px-[2rem] py-[1.4rem] my-[3.5rem] flex flex-col rounded-[0.8rem]`}
                  >
                    {postCommentData?.result &&
                      Object.entries(postCommentData.result).map(
                        ([key, coData]: [string, any], index: number) => {

                          const isEditing = editingIndexes[coData.id] || false;
                          const openEditing = myUpdateReply[coData.id] || false;

                          return (
                            <div className="mb-[2.5rem]" key={key}>
                              <div className={`pt-[1rem] py-[0.5rem] mr-[2rem]`}>
                                <div className="flex items-center">
                                  <Image
                                    className="w-[2.8rem] h-[2.8rem] flex items-center rounded-full mt-[0.2em]"
                                    src={coData.member.profileUrl}
                                    alt=""
                                    width={28}
                                    height={28}
                                  />
                                  <span className="ml-[1.4rem] text-[1.8rem] font-semibold flex items-center">
                                    {coData.member.nickName}
                                  </span>
                                  {userInfo?.memberId ===
                                    coData.member.memberId && (
                                      <div className="flex ml-auto">
                                        <Image
                                          className="w-[2.8rem] h-[2.8rem] cursor-pointer"
                                          width={28}
                                          height={28}
                                          src={menubars}
                                          alt=""
                                          onClick={() => toggleMyEdit(coData.id)}
                                        />
                                        {openEditing && (
                                          <div
                                            className="absolute flex flex-col ml-auto bg-white shadow-md rounded-md -ml-[4.5rem] mt-[2.3rem] animate-dropdown z-20 rounded-[0.8rem]"
                                            style={{
                                              opacity: 0,
                                              transform: "translateY(-10px)",
                                            }}
                                          >
                                            <span
                                              className="px-[2rem] py-[1rem] cursor-pointer text-red-500"
                                              onClick={() => {
                                                deleteReplyHandler(coData.id);
                                                toggleMyEdit(coData.id);
                                              }}
                                            >
                                              삭제
                                            </span>
                                            <span
                                              className="px-[2rem] py-[1rem] cursor-pointer"
                                              onClick={() => {
                                                handleEditContent(
                                                  coData.id,
                                                  coData.content
                                                );
                                                toggleMyEdit(coData.id);
                                              }}
                                            >
                                              수정
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                </div>
                                {isEditing ? (
                                  <div className="w-full ml-[2.5rem] mt-[0.5rem]">
                                    <div className="w-[95%] h-[3.3rem] relative shadowall flex flex-col border border-[#CFCFCF] bg-white rounded-[0.8rem]">
                                      <input
                                        className="w-full h-fit outline-none text-[1.4rem] font-normal mt-[0.5rem] pl-[1.5rem]"
                                        type="text"
                                        placeholder={`블로그가 훈훈해지는 댓글 부탁드립니다.`}
                                        value={updateReply}
                                        onChange={(e) =>
                                          setUpdateReply(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="w-full flex mt-[1rem] ml-auto pr-[2rem]">
                                      <button
                                        className="ml-auto hover:bg-[#292929] hover:text-white bg-[#FB3463] text-white rounded-[0.8rem] text-[1.6rem] font-semibold w-[6.6rem] h-[2.5rem] flex mr-[1.4rem] items-center justify-center"
                                        onClick={() => {
                                          commentReplyHandler(
                                            replymemId,
                                            replyNickname,
                                            replyId
                                          );
                                          commentEditHandler(coData.id);
                                        }}
                                      >
                                        수정
                                      </button>
                                      <button
                                        className="hover:bg-[#292929] hover:text-white bg-[#9D9D9D] text-white rounded-[0.8rem] text-[1.6rem] font-semibold w-[6.6rem] h-[2.5rem] flex mr-[1.4rem] items-center justify-center"
                                        onClick={() => {
                                          commentReplyHandler(
                                            replymemId,
                                            replyNickname,
                                            replyId
                                          );
                                          handleEditContent(
                                            coData.id,
                                            coData.content
                                          );
                                        }}
                                      >
                                        취소
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="ml-[4rem] my-[0.5rem]">
                                      <span className="text-[1.4rem] font-normal text-[#292929]">
                                        {coData.content}
                                      </span>
                                    </div>
                                    <div className="flex ml-[4rem] text-[1.2rem] text-[#9D9D9D] items-center">
                                      <span>{formatTimetoDays(coData.createDateTime)}</span>
                                      <hr className="mx-[1rem] h-[1rem] w-[0.1rem] bg-[#9D9D9D]" />
                                      <span
                                        className="cursor-pointer"
                                        onClick={() =>
                                          handleReplyToggle(
                                            index,
                                            coData.id,
                                            coData.member.nickName,
                                            coData.member.memberId
                                          )
                                        }
                                      >
                                        {replyStates[index]
                                          ? "답글취소"
                                          : "답글달기"}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {replyStates[index] && (
                                  <div className="w-[95%] h-[9.3rem] shadowall mt-[2rem] ml-[4rem] pl-[1.7rem] pt-[1.4rem] flex border border-[#CFCFCF] rounded-[0.8rem] relative">
                                    <div className="w-full">
                                      <div className="flex items-center">
                                        <Image
                                          className="w-[2.8rem] h-[2.8rem] flex items-center rounded-full"
                                          src={
                                            memberDatas?.result.profileImageUrl
                                          }
                                          alt=""
                                          width={28}
                                          height={28}
                                        />
                                        <span className="ml-[1.4rem] text-[1.8rem] font-semibold flex items-center">
                                          {memberDatas?.result.nickName}
                                        </span>
                                      </div>
                                      <div className="relative">
                                        <input
                                          className="w-[70%] outline-none ml-[2.5rem] text-[1.4rem] font-normal pl-[1.5rem]"
                                          type="text"
                                          placeholder={`${coData.member.nickName}에게 답글쓰기`}
                                          value={replyComment}
                                          onChange={(e) =>
                                            setReplyComment(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                    <button
                                      className="hover:bg-[#292929] hover:text-white bg-[#F5F5F5] text-[#292929] rounded-[0.8rem] text-[1.6rem] font-semibold w-[8.6rem] h-[3.5rem] flex ml-auto mr-[1.4rem] items-center justify-center"
                                      onClick={() =>
                                        commentReplyHandler(
                                          replymemId,
                                          replyNickname,
                                          replyId
                                        )
                                      }
                                    >
                                      입력
                                    </button>
                                  </div>
                                )}
                              </div>
                              {coData?.children.map(
                                (childData: any, childIndex: number) => {
                                  const isEditing =
                                    editingIndexes[childData.id] || false;
                                  const openEditing =
                                    myUpdateReply[childData.id] || false;

                                  console.log(childData, isEditing);
                                  return (
                                    <div
                                      className={`bg-[#F5F5F5] w-[95%] pt-[2rem] ${isEditing ? "pb-[4rem]" : "pb-[2rem] "} px-[1.6rem] mx-[4rem] rounded-[0.8rem]`}
                                      key={childIndex}
                                    >
                                      <div className="flex items-center">
                                        <Image
                                          className="w-[2.8rem] h-[2.8rem] flex items-center rounded-full"
                                          src={childData.member.profileUrl}
                                          alt=""
                                          width={28}
                                          height={28}
                                        />
                                        <span className="ml-[1.4rem] text-[1.8rem] font-semibold flex items-center">
                                          {childData.member.nickName}
                                        </span>
                                        {userInfo?.memberId ===
                                          childData.member.memberId && (
                                            <div className="flex ml-auto">
                                              <Image
                                                className="w-[2.8rem] h-[2.8rem] cursor-pointer"
                                                width={28}
                                                height={28}
                                                src={menubars}
                                                alt=""
                                                onClick={() =>
                                                  toggleMyEdit(childData.id)
                                                }
                                              />
                                              {openEditing && (
                                                <div
                                                  className="absolute flex flex-col ml-auto bg-white shadow-md rounded-md -ml-[4.5rem] mt-[2.3rem] animate-dropdown z-20 rounded-[0.8rem]"
                                                  style={{
                                                    opacity: 0,
                                                    transform: "translateY(-10px)",
                                                  }}
                                                >
                                                  <span
                                                    className="px-[2rem] py-[1rem] cursor-pointer"
                                                    onClick={() => {
                                                      handleEditContent(
                                                        childData.id,
                                                        childData.content
                                                      );
                                                      toggleMyEdit(childData.id);
                                                    }}
                                                  >
                                                    수정
                                                  </span>
                                                  <span
                                                    className="px-[2rem] py-[1rem] cursor-pointer text-red-500"
                                                    onClick={() => {
                                                      deleteReplyHandler(
                                                        childData.id
                                                      );
                                                      toggleMyEdit(childData.id);
                                                    }}
                                                  >
                                                    삭제
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                      </div>
                                      {isEditing ? (
                                        <div className="w-[90%] h-[3.3rem] shadowall my-[1rem] ml-[4rem] pt-[0.6rem] flex flex-col border border-[#CFCFCF] bg-white rounded-[0.8rem] relative">
                                          <div className="w-full">
                                            <div className="relative">
                                              <input
                                                className="w-full h-fit outline-none text-[1.4rem] font-normal pl-[1.5rem]"
                                                type="text"
                                                placeholder={`${coData.member.nickName}에게 답글쓰기`}
                                                value={updateReply}
                                                onChange={(e) =>
                                                  setUpdateReply(e.target.value)
                                                }
                                              />
                                            </div>
                                          </div>
                                          <div className="flex ml-auto mt-[1rem]">
                                            <button
                                              className="hover:bg-[#292929] hover:text-white bg-[#FB3463] text-white rounded-[0.8rem] text-[1.6rem] font-semibold w-[6.6rem] h-[2.5rem] flex ml-auto mr-[1.4rem] items-center justify-center"
                                              onClick={() => {
                                                commentReplyHandler(
                                                  replymemId,
                                                  replyNickname,
                                                  replyId
                                                );
                                                commentEditHandler(childData.id);
                                              }}
                                            >
                                              수정
                                            </button>
                                            <button
                                              className="hover:bg-[#292929] hover:text-white bg-[#9D9D9D] text-white rounded-[0.8rem] text-[1.6rem] font-semibold w-[6.6rem] h-[2.5rem] flex ml-auto mr-[1.4rem] items-center justify-center"
                                              onClick={() => {
                                                commentReplyHandler(
                                                  replymemId,
                                                  replyNickname,
                                                  replyId
                                                );
                                                handleEditContent(
                                                  childData.id,
                                                  childData.content
                                                );
                                              }}
                                            >
                                              취소
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div>
                                          <div className="text-[1.4rem] font-normal ml-[4.4rem] text-[#292929] my-[0.5rem] pr-[3rem]">
                                            <span className="text-[#FFBACA] text-[1.4rem] mr-[1rem]">
                                              @{childData.mentionMemberNickName}
                                            </span>
                                            {childData.content}
                                          </div>
                                          <div className="flex ml-[4.5rem] text-[1.2rem] text-[#9D9D9D] items-center">
                                            <span>{formatTimetoDays(childData.createDateTime)}</span>
                                            <hr className="mx-[1rem] h-[1rem] w-[0.1rem] bg-[#9D9D9D]" />
                                            <div>
                                              {replyOpen[index] &&
                                                rreplyOpen[childData.id] ? (
                                                <span
                                                  className="cursor-pointer"
                                                  onClick={() => {
                                                    toggleReply(index);
                                                    toggleRreply(childData.id);
                                                  }}
                                                >
                                                  답글취소
                                                </span>
                                              ) : (
                                                <span
                                                  className="cursor-pointer"
                                                  onClick={() => {
                                                    toggleReply(index);
                                                    toggleRreply(childData.id);
                                                    setParentIds(
                                                      childData.parentId
                                                    );
                                                    setReplyId(childData.id);
                                                    setReplyNickname(
                                                      childData.member.nickName
                                                    );
                                                    setReplyMemId(
                                                      childData.member.memberId
                                                    );
                                                  }}
                                                >
                                                  답글달기
                                                </span>
                                              )}

                                              {/* 답글이 열렸을 때 추가적인 요소를 보여줄 수 있습니다 */}
                                              {replyOpen[index] && (
                                                <div className="reply-input">
                                                  {/* 답글 입력 폼이나 추가적인 내용을 여기에 추가할 수 있습니다 */}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}

                              {replyOpen[index] && userInfo && (
                                <div className="w-[95%] h-[9.3rem] shadowall mt-[2rem] ml-[4rem] pl-[1.7rem] pt-[1.4rem] flex border border-[#CFCFCF] rounded-[0.8rem] relative">
                                  <div className="w-full">
                                    <div className="flex items-center">
                                      <Image
                                        className="flex items-center"
                                        src={memberDatas?.result.profileImageUrl}
                                        alt=""
                                        width={28}
                                        height={28}
                                      />
                                      <span className="ml-[1.4rem] text-[1.8rem] font-semibold flex items-center">
                                        {memberDatas?.result.nickName}
                                      </span>
                                      {userInfo?.memberId ===
                                        coData.member.memberId && (
                                          <Image
                                            className="w-[2.8rem] h-[2.8rem] ml-auto"
                                            src={menubars}
                                            alt=""
                                          />
                                        )}
                                    </div>
                                    <div className="relative">
                                      <input
                                        className="w-[70%] outline-none ml-[2.5rem] text-[1.4rem] font-normal pl-[1.5rem]" // padding-left 추가
                                        type="text"
                                        value={replyComment}
                                        onChange={(e) =>
                                          setReplyComment(e.target.value)
                                        }
                                        placeholder={`${replyNickname}에게 답글쓰기`}
                                      />
                                    </div>
                                  </div>
                                  <button
                                    className="hover:bg-[#292929] hover:text-white bg-[#F5F5F5] text-[#292929] rounded-[0.8rem] text-[1.6rem] font-semibold w-[8.6rem] h-[3.5rem] flex ml-auto mr-[1.4rem] items-center justify-center"
                                    onClick={() =>
                                      commentReplyHandler(
                                        replymemId,
                                        replyNickname,
                                        replyId
                                      )
                                    }
                                  >
                                    입력
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                  </div>
                )}

              </div>
            )}
            {showLikes && (
              <div className="">
                {isLoadingLikes ? (
                  <div></div>
                ) : (
                  likeList.length === 0 ? (
                    <div></div>
                  ) : (
                    renderLikeList(likeList)
                  )
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-[25rem] bg-[#F5F5F5]">
            <div className="flex flex-col pt-[6rem]">
              <span className="flex text-center mx-auto text-[1.6rem] font-medium">
                트리피 회원이면 댓글을 달 수 있어요
              </span>
              <button
                className="flex text-center font-semibold mx-auto bg-[#FB3463] text-[1.6rem] py-[0.7rem] px-[6rem] rounded-[0.8rem] text-white mt-[1rem]"
                onClick={loginEdit}
              >
                로그인 하러가기
              </button>
            </div>
          </div>
        )}
      </div>
      {/* {isSpotsLoading ? (
          <SkeletonOotdDetailRecommend />
        ) : (
          <RecommendedSpot 
          recommendedSpots={recommendedSpots?.result || []}
          location={formattedLocation}
        />
        )} */}
    </div>
  );
}
