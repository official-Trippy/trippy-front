// components/PostCard.tsx

import React from "react";

interface PostCardProps {
  post: {
    post: {
      images: { accessUri: string }[];
      title: string;
      body: string;
      tags: string[];
      nickName: string;
      likeCount: number;
      viewCount: number;
    };
    member: {
      nickName: string;
      profileUrl: string;
    };
  };
}

const PostAllCard: React.FC<PostCardProps> = ({ post }) => {
  const { post: postDetails, member } = post;

  return (
    <div className="flex p-6 bg-white rounded-lg shadow-md mb-6 w-[789px] h-[174px] mr-[100px] pt-[25px]">
      {/* 이미지 */}
      <div className="w-1/3 pr-6">
        <img
          src={postDetails?.images[0]?.accessUri}
          alt={postDetails?.title}
          className="w-full h-auto rounded-lg"
        />
      </div>

      <div className="w-2/3">
        <h2 className="text-3xl font-semibold mb-3">{postDetails?.title}</h2>

        <p className="text-gray-800 mb-3">{postDetails?.body}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {postDetails?.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-[50px] text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* 메타데이터 */}
        <div className="flex items-center space-x-6">
          <p className="text-gray-800 font-semibold">{member?.nickName}</p>
          <p className="text-gray-600 text-sm">
            {postDetails?.likeCount} Likes
          </p>
          <p className="text-gray-600 text-sm">
            {postDetails?.viewCount} Views
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostAllCard;
