import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Image from 'next/image';
import { useUserStore } from '@/store/useUserStore';
import { formatDate } from '@/constants/dateFotmat';
import { createComment, fetchComments } from '@/services/ootd.ts/ootdComments';
import HeartIcon from '../../../public/icon_heart.svg'; 
import CommentIcon from '../../../public/icon_comment.svg'; 
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface CommentSectionProps {
  postId: number;
  initialLikeCount: number;
  initialCommentCount: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, initialLikeCount, initialCommentCount }) => {
  const userInfo = useUserStore((state) => state.userInfo);
  const [newComment, setNewComment] = useState('');
  const [likeCount] = useState(initialLikeCount);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const queryClient = useQueryClient();

  const { data: comments, refetch, isLoading } = useQuery(
    ['comments', postId],
    () => fetchComments(postId),
    { enabled: false } 
  );

  const mutation = useMutation(
    (content: string) => createComment(postId, content),
    {
      onSuccess: () => {
        refetch();
        setCommentCount((prev) => prev + 1);
        setNewComment('');
      },
    }
  );

  const handleCommentSubmit = () => {
    console.log(postId)
    if (newComment.trim()) {
      mutation.mutate(newComment);
    }
  };

  return (
    <div className="comment-section">
      <div className="flex items-center space-x-4">
        <button>
          <Image src={HeartIcon} alt="Like" width={24} height={24} />
          <span>{likeCount}</span>
        </button>
        <button>
          <Image src={CommentIcon} alt="Comment" width={24} height={24} />
          <span>{commentCount}</span>
        </button>
      </div>
      <div className="flex items-center mt-4">
        <Image src={userInfo.profileImageUrl} alt="User" width={32} height={32} className="rounded-full" />
        <input
          type="text"
          className="ml-4 p-2 border rounded flex-1"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          onClick={handleCommentSubmit}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </div>
      <div className="mt-4">
        {isLoading ? (
          <div></div>
        ) : (
          comments?.map((comment: { id: React.Key | null | undefined; profileImageUrl: string | StaticImport; memberId: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined; createDateTime: any; content: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
            <div key={comment.id} className="mb-4">
              <div className="flex items-center">
                <Image src={comment.profileImageUrl} alt='user profile' width={32} height={32} className="rounded-full" />
                <div className="ml-4">
                  <div className="font-bold">{comment.memberId}</div>
                  <div className="text-gray-600">{formatDate(comment.createDateTime)}</div>
                  <div>{comment.content}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
