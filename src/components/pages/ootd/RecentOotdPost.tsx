"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import { useQuery } from "react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { OotdGetResponse } from "@/types/ootd";
import {
  fetchAllOotdPostCount,
  fetchAllOotdPosts,
  fetchFollowOotdPosts,
  fetchOotdFollowPostCount,
} from "@/services/ootd.ts/ootdGet";
import { fetchLikedPosts } from "@/services/ootd.ts/ootdComments";
import CustomSelect from "./CustomSelect";
import { useUserStore } from "@/store/useUserStore";
import DefaultImage from "../../../../public/defaultImage.svg";
import HeartIcon from "../../../../public/heartedIcon.svg";
import EmptyHeartIcon from "../../../../public/heartIcon-default.svg";
import CommentIcon1 from "../../../../public/commentIcon-default.svg";
import { TagContainerProps } from "@/types/tag";
import Cookies from "js-cookie";

import SkeletonRecommendOotdPost from './SkeletonRecommendOotdPost';
import SkeletonRecentOotdPost from './SkeletonRecentOotdPost';


const PAGE_SIZE = 12;

const TagContainer: React.FC<TagContainerProps> = ({ item }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleTags, setVisibleTags] = useState<string[]>(item.post.tags);
  const router = useRouter();

  const calculateVisibleTags = () => {
    const container = containerRef.current;
    if (!container) return;

    const tags = Array.from(container.children) as HTMLElement[];
    let totalWidth = 0;
    let visibleCount = 0;

    tags.forEach((tag, index) => {
      totalWidth += tag.offsetWidth + parseInt(getComputedStyle(tag).marginRight);
      if (totalWidth <= container.offsetWidth) {
        visibleCount = index + 1;
      }
    });

    setVisibleTags(item.post.tags.slice(0, visibleCount));
  };

  useEffect(() => {
    // DOM이 완전히 로드된 후 태그 계산
    setTimeout(calculateVisibleTags, 100);

    // 창 크기 변경 시 태그 계산
    window.addEventListener('resize', calculateVisibleTags);

    return () => {
      window.removeEventListener('resize', calculateVisibleTags);
    };
  }, [item.post.tags]);

  const handleTagClick = (tag: string) => {
    router.push(`/search/${encodeURIComponent(tag)}`); // Redirect to the search page with the clicked tag
  };

  return (
    <div className="mt-4">
      <div className="text-[#6b6b6b] text-xl font-normal font-['Pretendard'] text-ellipsis overflow-hidden whitespace-nowrap">
        {item.post.body}
      </div>
      <div className="tag-container" ref={containerRef}>
        {visibleTags.map((tag, index) => (
          <span


            key={index}
            className="tag-item px-4 py-1 bg-neutral-100 rounded-3xl text-xl justify-center items-center gap-2.5 inline-flex text-[#9d9d9d]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const RecentOotdPost: React.FC = () => {
  const [page, setPage] = useState(0);
  const [orderType, setOrderType] = useState("LATEST");
  const [tab, setTab] = useState<"ALL" | "FOLLOWING" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const router = useRouter();
  const { userInfo, loading } = useUserStore((state) => ({
    userInfo: state.userInfo,
    loading: state.loading,
  }));
  const accessToken = Cookies.get("accessToken");
  const [token, setToken] = useState(false);

  const isGuest = userInfo?.role === "GUEST";

  useEffect(() => {
    if (token) {
      setToken(true);
    }
  }, [accessToken]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = sessionStorage.getItem("tab");
      if (!userInfo) {
        setTab("ALL"); // 유저 정보가 없으면 무조건 'ALL'로 설정
      } else if (savedTab) {
        setTab(savedTab as "ALL" | "FOLLOWING");
      } else {
        setTab(!isGuest ? "FOLLOWING" : "ALL");
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (tab) {
        sessionStorage.setItem("tab", tab);
      }
    }
  }, [tab]);

  useEffect(() => {
    if (userInfo) {
      fetchLikedPosts().then(setLikedPosts);
    }
  }, [userInfo]);

  const isTabInitialized = tab !== null;

  const { data: totalCount, isLoading: isCountLoading } = useQuery<number>(
    ["ootdPostCount", tab],
    () =>
      tab === "ALL" ? fetchAllOotdPostCount() : fetchOotdFollowPostCount(),
    {
      enabled: isTabInitialized,
    }
  );

  const { data: allPostsData, isLoading: isAllPostsLoading } =
    useQuery<OotdGetResponse>(
      ["ootdPosts", page, orderType],
      () => fetchAllOotdPosts(page, PAGE_SIZE, orderType),
      {
        enabled: tab === "ALL" && isTabInitialized,
      }
    );

  const { data: followingPostsData, isLoading: isFollowingPostsLoading } =
    useQuery<OotdGetResponse>(
      ["followingOotdPosts", page, orderType],
      () => fetchFollowOotdPosts(page, PAGE_SIZE, orderType),
      {
        enabled: tab === "FOLLOWING" && isTabInitialized,
      }
    );

  const ootdList =
    tab === "ALL"
      ? allPostsData?.result || []
      : followingPostsData?.result || [];
  const isLoading =
    isCountLoading ||
    (tab === "ALL" ? isAllPostsLoading : isFollowingPostsLoading);

  const totalPages = totalCount ? Math.ceil(totalCount / PAGE_SIZE) : 0;

  const handlePageClick = (pageIndex: number) => {
    setPage(pageIndex);
  };

  const handleOotdItemClick = (id: number) => {
    router.push(`/ootd/${id}`);
  };

  const handleOrderTypeChange = (value: string) => {
    setOrderType(value);
    setPage(0);
  };

  const handleTabChange = (newTab: "ALL" | "FOLLOWING") => {
    startTransition(() => {
      setTab(newTab);
      setPage(0);
    });
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 클라이언트에서만 실행되도록 체크
      const delay = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000); // 스켈레톤을 1초 동안 유지

      return () => clearTimeout(delay);
    }
  }, [isLoading]);

  if (loading || showSkeleton || isLoading) {
    return <SkeletonRecentOotdPost />;
  }

  return (
    <div className="w-[90%] sm-700:w-[66%]  mx-auto pt-[5rem] mb-[90px]">
      {!isLoading && (
        <div>
          <h1 className="font-bold text-[2rem]">
            최근 업로드된 OOTD를 만나보세요
          </h1>
        </div>
      )}

      <div className={`flex text-[1.6rem] py-12`}>
        {userInfo && (
          <span
            className={`pr-[1rem] cursor-pointer ${tab === "ALL" ? "font-bold text-[#fa3463]" : ""}`}
            onClick={() => handleTabChange("ALL")}
          >
            전체글
          </span>
        )}
        {userInfo && (
          <span
            className={`px-[1rem] cursor-pointer ${tab === "FOLLOWING" ? "font-bold text-[#fa3463]" : ""}`}
            onClick={() => handleTabChange("FOLLOWING")}
          >
            팔로잉
          </span>
        )}
        <div className="ml-auto">
          <CustomSelect
            orderType={orderType}
            onOrderTypeChange={handleOrderTypeChange}
          />
        </div>
      </div>

      {/* 게시글이 있을 때와 없을 때 조건부 렌더링 */}
      <div
        className={`${ootdList.length > 0 ? "grid grid-cols-2 sm-700:grid-cols-3 lg:grid-cols-4 gap-8" : "flex justify-center items-center"}`}
      >
        {ootdList.length > 0 ? (
          ootdList.map((item) => (
            <div
              key={item.post.id}
              className="flex flex-col overflow-hidden cursor-pointer overflow-hidden text-ellipsis"
              onClick={() => handleOotdItemClick(item.post.id)}
            >
              <div className="flex items-center pb-4">
                <div className="relative w-[24px] h-[24px]">
                  <Image
                    src={item.member.profileUrl || DefaultImage}
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <span
                    className="text-[#6B6B6B] ml-[5px] overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.member.nickName}
                  </span>
                </div>
              </div>
              {item.post.images.length > 0 && (
                <div
                  className="relative w-full"
                  style={{ aspectRatio: "303 / 381" }}
                >
                  <Image
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
                    src={item.post.images[0].accessUri}
                    alt="OOTD"
                    layout="fill"
                  />
                </div>
              )}
              <TagContainer item={item} />
              <div className="pb-4">
                <div className="flex items-center justify-start">
                  <div className="flex items-center mt-2">
                    <Image
                      src={
                        likedPosts.includes(item.post.id)
                          ? HeartIcon
                          : EmptyHeartIcon
                      }
                      alt="좋아요"
                      width={20}
                      height={10}
                      style={{
                        width: "20px",
                        height: "18px",
                      }}
                    />
                    <span className="mx-2 text-[#cfcfcf]">
                      {" "}
                      {item.post.likeCount}
                    </span>
                    <Image
                      src={CommentIcon1}
                      alt="댓글"
                      width={20}
                      height={20}
                      style={{
                        width: "20px",
                        height: "18px",
                      }}
                    />
                    <span className="mx-2 text-[#cfcfcf]">
                      {" "}
                      {item.post.commentCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // 팔로우한 유저가 없거나 게시물이 없을 때 메시지 표시
          <div className="h-full flex flex-col text-[2rem] text-neutral-900 dark:text-white  my-auto items-center justify-center font-medium font-['Pretendard'] py-[50px]">
            {userInfo ? (
              <div className="flex flex-row">
                <span className="text-[#FB3463]">팔로우</span>한 유저의 OOTD가
                없어요!
              </div>
            ) : (
              <>
                <div className="flex flex-row">
                  <span className="text-neutral-900 dark:text-white ">
                    트리피 로그인 후 팔로잉 게시글을 확인하세요!
                  </span>
                </div>
                <div
                  className="bg-btn-color text-white text-2xl rounded-[8px] font-semibold mt-[20px] px-8 py-4 cursor-pointer"
                  onClick={handleLogin}
                >
                  OOTD 게시글 작성하러 가기
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(index)}
            className={`mx-2 pt-8 px-3  ${
              page === index
                ? "text-[#fa3463] font-semibold"
                : "text-[#cfcfcf] font-normal"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentOotdPost;
