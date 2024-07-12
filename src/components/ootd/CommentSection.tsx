import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import Image from 'next/image';
import { useUserStore } from '@/store/useUserStore';
import { formatDate } from '@/constants/dateFotmat';
import { FetchCommentsResponse, createComment, fetchComments } from '@/services/ootd.ts/ootdComments';
import HeartIcon from '../../../public/icon_heart.svg'; 
import CommentIcon from '../../../public/icon_comment.svg'; 
import { Comment } from '@/types/ootd';

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

  const { data: commentData, refetch, isLoading } = useQuery<FetchCommentsResponse>(
    ['comments', postId],
    () => fetchComments(postId)
  );

  const comments: Comment[] = commentData?.result ? Object.values(commentData.result) : [];

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
    if (newComment.trim()) {
      mutation.mutate(newComment);
    }
  };

  return (
    <div className="comment-section">
      <div className="flex items-center space-x-4">
        <button>
          <Image src={HeartIcon} alt="좋아요" width={24} height={24} />
          <span>{likeCount}</span>
        </button>
        <button>
          <Image src={CommentIcon} alt="댓글" width={24} height={24} />
          <span>{commentCount}</span>
        </button>
      </div>
      <div className="flex items-center mt-4">
        {userInfo.profileImageUrl && (
          <Image src={userInfo.profileImageUrl} alt="사용자" width={32} height={32} className="rounded-full" />
        )}
        <input
          type="text"
          className="ml-4 p-2 border rounded flex-1"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력해주세요..."
        />
        <button
          onClick={handleCommentSubmit}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          등록
        </button>
      </div>
      <div className="mt-4">
        {isLoading ? (
          <div>로딩 중...</div>
        ) : (
          comments.length === 0 ? (
            <div>댓글이 없습니다.</div>
          ) : (
            comments.map((comment: Comment) => (
              <div key={comment.id} className="mb-4">
                <div className="flex items-center">
                  {comment.profileImageUrl && (
                    <Image src={comment.profileImageUrl} alt="사용자 프로필" width={32} height={32} className="rounded-full" />
                  )}
                  <div className="ml-4">
                    <div className="font-bold">{comment.memberId}</div>
                    <div className="text-gray-600">{formatDate(comment.createDateTime)}</div>
                    <div>{comment.content}</div>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default CommentSection;
