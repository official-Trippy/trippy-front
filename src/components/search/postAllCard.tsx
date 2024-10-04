"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Hearticon from "../../../public/icon_heart.png";
import Commenticon from "../../../public/serchComment.svg";

interface PostCardProps {
  posts: {
    post?: {
      images: { accessUri: string }[];
      title: string;
      body: string;
      tags: string[];
      nickName: string;
      likeCount: number;
      viewCount: number;
      id: number;
      email: string;
      commentCount: number;
    };
    ticket?: {
      image: {
        accessUri: string;
      };
    };

    ootd?: {
      images: string;

      description: string;
      id: number;
    };
    member?: {
      nickName: string;
      profileUrl: string;
    };
    blogIntroduction?: string;
    blogName?: string;
    blogTitleImgUrl?: string;
    memberId?: string;
    nickName?: string;
    profileImgUrl: string;

    email?: string;
  }[];
  selectedSearchType: string;
}

const PostAllCard: React.FC<PostCardProps> = ({
  posts = [],

  selectedSearchType,
}) => {
  const [tagCount, setTagCount] = useState(5);

  // Effect to update tag count based on window size
  useEffect(() => {
    const handleResize = () => {
      setTagCount(window.innerWidth < 640 ? 3 : 5); // 640px corresponds to Tailwind's `sm` breakpoint
    };

    // Set initial value based on current window size
    handleResize();

    // Add event listener to update on resize
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!Array.isArray(posts) || posts.length === 0) {
    return <p>No posts available</p>;
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };





  return (
    <div className="flex flex-col items-stretch gap-[25.012px] h-174px w-789px">
      {posts.map((post, index) => {
        const getTextFromHtml = (html: any) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          return doc.body.innerText; // 텍스트만 반환
        };

        const {
          post: postDetails,
          ootd: ootdDetails,
          ticket: ticketDetails,
          member,
          blogIntroduction,
          blogName,
          profileImgUrl,
          memberId,
          nickName,
        } = post;

        const bodyText = getTextFromHtml(post.post?.body);

        // 타입에 따른 링크 경로 설정
        let linkPath = "#"; // 기본값은 빈 링크
        if (selectedSearchType === "POST" && postDetails?.id) {
          linkPath = `/board/${postDetails?.id}`;
        } else if (selectedSearchType === "OOTD" && postDetails?.id) {
          linkPath = `/ootd/${postDetails?.id}`;
        } else if (selectedSearchType === "NICKNAME" && memberId) {
          linkPath = `/user/${memberId}`;
        } else if (selectedSearchType === "BLOG" && memberId) {
          linkPath = `/user/${memberId}`;
        }

        // blog 또는 nickname일 때 다른 스타일 적용
        const isBlogOrNickname =
          selectedSearchType === "BLOG" || selectedSearchType === "NICKNAME";

        return (
          <Link
            href={linkPath} // 동적 링크 경로 사용
            key={index}
            className="no-underline"
          >
            <div

              className={`flex items-start sm:p-6 mb-6 ${
                isBlogOrNickname
                  ? "sm:w-[403px] sm:h-[72px] w-[326.231px] h-auto" // 모바일에서는 326.231px, 데스크탑에서는 403px로 적용
                  : "w-[100%] sm:h-[174px] sm:bg-white rounded-lg shadow-md"
              } sm:flex `}

            >
              {/* Image */}

              <div
                className={`${isBlogOrNickname
                  ? "w-[72px] h-[72px]"
                  : "sm:w-1/3 sm:h-full w-[107px] h-[107px] pr-6"
                  } flex-shrink-0 ${isBlogOrNickname ? "rounded-full" : ""}`}
              >
                {selectedSearchType === "OOTD" ? (
                  <img
                    src={
                      postDetails?.images[0]?.accessUri || "/placeholder.png"
                    }
                    alt="OOTD Image"
                    className={`object-cover ${isBlogOrNickname
                      ? "rounded-full"
                      : "rounded-lg w-full h-full"
                      }`}
                    style={
                      isBlogOrNickname ? { width: "72px", height: "72px" } : {}
                    }
                  />
                ) : selectedSearchType === "BLOG" ||
                  selectedSearchType === "NICKNAME" ? (
                  <img
                    src={profileImgUrl || "/placeholder.png"}
                    alt={blogName || "Blog Image"}
                    className={`object-cover ${isBlogOrNickname
                      ? "rounded-full"
                      : "rounded-lg sm:w-full sm:h-full w-[107px] h-[107px]"
                      }`}
                    style={
                      isBlogOrNickname ? { width: "72px", height: "72px" } : {}
                    }
                  />
                ) : (
                  <img
                    src={ticketDetails?.image.accessUri || "/placeholder.png"}
                    alt={postDetails?.title || "Post Image"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Post, OOTD, or Blog Details */}
              <div
                className={`ml-4 pr-3 ${isBlogOrNickname ? "flex flex-col justify-center" : "w-full"
                  }`}
              >
                {selectedSearchType === "BLOG" ? (
                  <>
                    <h2 className="text-[2.4rem] font-semibold mt-[0.7rem]">
                      {blogName || "Unnamed Blog"}
                    </h2>
                    <p className="text-[1.2rem] text-[#9D9D9D] mt-[0.5rem]">
                      @{memberId || "Anonymous"}
                    </p>
                  </>
                ) : selectedSearchType === "NICKNAME" ? (
                  <>
                    <h2 className="text-[2.4rem] md:text-[2.4rem] font-semibold mt-[0.7rem]">
                      {nickName || "데이터 실패"}
                    </h2>
                    <p className="text-[1.2rem] md:text-[1.2rem] text-[#9D9D9D] mt-[0.5rem]">
                      @{memberId || "Unnamed Blog"}
                    </p>
                  </>
                ) : selectedSearchType === "OOTD" ? (
                  <>
                    <div className="flex items-center space-x-2 sm:my-[1rem]">
                      <img
                        src={member?.profileUrl || "/default-profile.png"}
                        alt={member?.nickName || "Profile"}
                        className="w-[2rem] h-[2rem] md:w-[30px] md:h-[30px] rounded-full"
                      />
                      <p className="text-gray-800 font-semibold">
                        {member?.nickName || "Anonymous"}
                      </p>
                    </div>

                    <p className="text-gray-800 sm:min-h-[5rem] min-h-[1rem] py-2">
                      {truncateText(
                        postDetails?.body || "No description available",
                        60
                      )}
                    </p>
                    <div className="flex flex-wrap gap-1 sm:mb-2">
                      {postDetails?.tags
                        ?.slice(0, tagCount) // Use dynamic `tagCount` based on screen size
                        .map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-4 py-1 bg-neutral-100 rounded-3xl text-xl justify-center items-center gap-2.5 inline-flex text-[#9d9d9d]"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    <div className="flex space-x-4 mt-[0.5rem]">
                      <div className="flex">
                        <Image
                          src={Hearticon}
                          alt="heart"
                          width={20}
                          height={10}
                        />
                        <p className="text-[#CFCFCF] text-[1rem] md:text-[1.5rem]">
                          {postDetails?.likeCount || 0}
                        </p>
                      </div>
                      <div className="flex">
                        <Image
                          src={Commenticon}
                          alt="heart"
                          width={20}
                          height={10}
                        />
                        <p className="text-[#CFCFCF] text-[1rem] md:text-[1.5rem]">
                          {postDetails?.commentCount || 0}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-[1.4rem] md:text-3xl font-semibold sm:py-3">
                      {postDetails?.title || "Untitled"}
                    </h2>
                    <p className="text-gray-800 sm:min-h-[5rem] min-h-[4rem] py-2">
                      {truncateText(
                        bodyText || "No content available",

                        60
                      )}
                    </p>
                    <div className="flex flex-wrap gap-1 sm:mb-2">
                      {postDetails?.tags
                        ?.slice(0, tagCount) // Use dynamic `tagCount` based on screen size
                        .map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-neutral-100 rounded-3xl text-xl justify-center items-center gap-2.5 inline-flex text-[#9d9d9d]"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4 justify-between sm:mt-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src={member?.profileUrl || "/default-profile.png"}
                          alt={member?.nickName || "Profile"}
                          className="w-[2rem] h-[2rem] md:w-[30px] md:h-[30px] rounded-full"
                        />
                        <p className="text-gray-800 font-semibold">
                          {member?.nickName || "Anonymous"}
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <div className="flex">
                          <Image
                            src={Hearticon}
                            alt="heart"
                            width={20}
                            height={10}
                          />
                          <p className="text-[#CFCFCF] text-[1rem] md:text-[1.5rem]">
                            {postDetails?.likeCount || 0}
                          </p>
                        </div>
                        <div className="flex">
                          <Image
                            src={Commenticon}
                            alt="heart"
                            width={20}
                            height={10}
                          />
                          <p className="text-[#CFCFCF] text-[1rem] md:text-[1.5rem]">
                            {postDetails?.commentCount || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PostAllCard;
