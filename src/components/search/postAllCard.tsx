// components/PostAllCard.tsx

import React from "react";

// Define the props interface to expect an array of posts
interface PostCardProps {
  posts: {
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
  }[];
}

const PostAllCard: React.FC<PostCardProps> = ({ posts = [] }) => {
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
        const { post: postDetails, member } = post;
        return (
          <div
            key={index}
            className="flex justify-center items-start p-6 bg-white rounded-lg shadow-md mb-6 h-[174px] w-[789px]"
          >
            {/* Image */}
            <div className="w-1/3 pr-6 flex-shrink-0 h-full">
              <img
                src={postDetails?.images[0]?.accessUri || "/placeholder.png"}
                alt={postDetails?.title || "Post Image"}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Post Details */}
            <div className="w-2/3 ml-[10px]">
              <h2 className="text-3xl font-semibold mb-3">
                {postDetails?.title || "Untitled"}
              </h2>

              <p className="text-gray-800 mb-3">
                {truncateText(postDetails?.body || "No content available", 100)}
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

              {/* Metadata */}
              <div className="flex items-center space-x-6 justify-between mt-4 mt-[2rem]">
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
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostAllCard;
