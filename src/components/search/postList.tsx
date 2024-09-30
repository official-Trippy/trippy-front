import React from "react";

type Post = {
  id: number;
  title: string;
  content: string;
};

type PostListProps = {
  posts: Post[];
};

const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div className="space-y-4 width-[820px]">
      {posts.map((post) => {

        return (
          <div
            key={post.id}
            className="bg-black p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-700 mt-2">{post.content}</p>
          </div>
        )
      })}
    </div>
  );
};

export default PostList;
