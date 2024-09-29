import React from "react";
import Link from "next/link";

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
                  : "sm:w-[789px] sm:h-[174px] w-[326.231px] h-[107px] sm:bg-white rounded-lg shadow-md"
              } sm:flex `}
            >
              {/* Image */}

              <div
                className={`${
                  isBlogOrNickname
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
                    className={`object-cover ${
                      isBlogOrNickname
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
                    className={`object-cover ${
                      isBlogOrNickname
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
                className={`ml-[20px] ${
                  isBlogOrNickname ? "flex flex-col justify-center" : ""
                }`}
              >
                {selectedSearchType === "BLOG" ? (
                  <>
                    <h2 className="text-[2.4rem] font-semibold pb-2">
                      {blogName || "Unnamed Blog"}
                    </h2>

                    <p className="text-[1.2rem] text-[#9D9D9D] pt-2">
                      @{memberId || "Anonymous"}
                    </p>
                  </>
                ) : selectedSearchType === "NICKNAME" ? (
                  <>
                    <h2 className="text-[2.4rem] font-semibold pb-2">
                      {nickName || "데이터 실패"}
                    </h2>

                    <p className="text-[1.2rem] text-[#9D9D9D] pt-2">
                      @{memberId || "Unnamed Blog"}
                    </p>
                  </>
                ) : selectedSearchType === "OOTD" ? (
                  <>
                    <div className="flex items-center space-x-2 my-[1rem]">
                      <img
                        src={member?.profileUrl || "/default-profile.png"}
                        alt={member?.nickName || "Profile"}
                        className="sm:w-[30px] sm:h-[30px] w-[2rem] h-[2rem] rounded-full"
                      />
                      <p className="text-gray-800 font-semibold">
                        {member?.nickName || "Anonymous"}
                      </p>
                    </div>

                    <p className="text-gray-800 my-[0.5rem] sm:my-[1rem]">
                      {truncateText(
                        postDetails?.body || "No description available",
                        100
                      )}
                    </p>
                    <div className="flex flex-wrap gap-1 my-[0.5rem] mt-[0rem] sm:mt-[3rem]">
                      {postDetails?.tags?.slice(0, 4).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gray-200 text-gray-800 px-2 py-0 rounded-full sm:text-sm sm:px-4 sm:py-2 sm:gap-px text-xs" // 크기 조정
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <p className="text-gray-600 text-[1rem] sm:text-[1.5rem]">
                        ❤️ {postDetails?.likeCount || 0}
                      </p>
                      <p className="text-gray-600 text-[1rem] sm:text-[1.5rem]">
                        💬 {postDetails?.viewCount || 0}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="sm:text-3xl font-semibold sm:mb-3 text-[1.7rem]">
                      {postDetails?.title || "Untitled"}
                    </h2>
                    <p className="text-gray-800 mb-3 text-ellipsis overflow-hidden theboki1">
                      {truncateText(
                        postDetails?.body || "No content available",
                        100
                      )}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4 sm:mt-[2rem]">
                      {postDetails?.tags?.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full sm:text-sm sm:px-4 sm:py-2 sm:gap-px text-xs" // 크기 조정
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-6 justify-between mt-4">
                      <div className="flex space-x-4">
                        <p className="text-gray-600 text-[1rem] sm:text-[1.5rem]">
                          ❤️ {postDetails?.likeCount || 0}
                        </p>
                        <p className="text-gray-600 text-[1rem] sm:text-[1.5rem]">
                          💬 {postDetails?.viewCount || 0}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <img
                          src={member?.profileUrl || "/default-profile.png"}
                          alt={member?.nickName || "Profile"}
                          className="sm:w-[30px] sm:h-[30px] w-[2rem] h-[2rem] rounded-full"
                        />
                        <p className="text-gray-800 font-semibold">
                          {member?.nickName || "Anonymous"}
                        </p>
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
