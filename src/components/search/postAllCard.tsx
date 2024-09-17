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
    };
    ootd?: {
      images: { accessUri: string }[];
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
    profileImgUrl: { accessUri2: string }[];
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
        } else if (selectedSearchType === "OOTD" && ootdDetails?.id) {
          linkPath = `/ootd/${ootdDetails?.id}`;
        } else if (selectedSearchType === "NICKNAME" && memberId) {
          linkPath = `/user/${memberId}`;
        } else if (selectedSearchType === "BLOG" && memberId) {
          linkPath = `/user/${memberId}`;
        }

        return (
          <Link
            href={linkPath} // 동적 링크 경로 사용
            key={index}
            className="no-underline"
          >
            <div className="flex justify-center items-start p-6 bg-white rounded-lg shadow-md mb-6 h-[174px] w-[789px]">
              {/* Image */}
              <div className="w-1/3 pr-6 flex-shrink-0 h-full">
                {selectedSearchType === "OOTD" ? (
                  <img
                    src={
                      ootdDetails?.images[0]?.accessUri || "/placeholder.png"
                    }
                    alt="OOTD Image"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : selectedSearchType === "BLOG" ||
                  selectedSearchType === "NICKNAME" ? (
                  <img
                    src={post.member?.profileUrl || "/placeholder.png"}
                    alt={blogName || "Blog Image"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <img
                    src={
                      postDetails?.images[0]?.accessUri || "/placeholder.png"
                    }
                    alt={postDetails?.title || "Post Image"}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Post, OOTD, or Blog Details */}
              <div className="w-2/3 ml-[20px] ">
                {selectedSearchType === "BLOG" ? (
                  <>
                    <h2 className="text-5xl font-semibold mb-3">
                      {blogName || "Unnamed Blog"}
                    </h2>
                    <p className="text-gray-800 mb-3 mt-3 text-2xl">
                      {truncateText(
                        blogIntroduction || "No introduction available",
                        100
                      )}
                    </p>
                    <div className="flex items-center space-x-6 justify-between mt-4">
                      <p className="text-gray-800 font-semibold mt-20 text-2xl">
                        회원명 : {member?.nickName || "Anonymous"}
                      </p>
                    </div>
                  </>
                ) : selectedSearchType === "NICKNAME" ? (
                  <>
                    <h2 className="text-5xl font-semibold mb-3">
                      {member?.nickName || "데이터 실패"}
                    </h2>
                    <p className="text-gray-800 mb-3 mt-3 text-2xl">
                      {truncateText(
                        blogIntroduction || "No introduction available",
                        100
                      )}
                    </p>
                    <h2 className="text-2xl font-semibold mb-3 mt-20 text-gray-800">
                      블로그 이름 : {blogName || "Unnamed Blog"}
                    </h2>
                  </>
                ) : selectedSearchType === "ootd" ? (
                  <>
                    <h2 className="text-3xl font-semibold mb-3">OOTD</h2>
                    <p className="text-gray-800 mb-3">
                      {truncateText(
                        ootdDetails?.description || "No description available",
                        100
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-semibold mb-3">
                      {postDetails?.title || "Untitled"}
                    </h2>
                    <p className="text-gray-800 mb-3">
                      {truncateText(
                        postDetails?.body || "No content available",
                        100
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4 mt-[2rem]">
                      {postDetails?.tags?.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-[50px] text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-6 justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src={member?.profileUrl || "/default-profile.png"}
                          alt={member?.nickName || "Profile"}
                          className="w-[30px] h-[30px] rounded-full"
                        />
                        <p className="text-gray-800 font-semibold">
                          {member?.nickName || "Anonymous"}
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <p className="text-gray-600 text-[1.5rem]">
                          ❤️ {postDetails?.likeCount || 0}
                        </p>
                        <p className="text-gray-600 text-[1.5rem]">
                          💬 {postDetails?.viewCount || 0}
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
