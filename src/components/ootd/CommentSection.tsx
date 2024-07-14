import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import Image from 'next/image';
import { useUserStore } from '@/store/useUserStore';
import { formatDate } from '@/constants/dateFotmat';
import { FetchCommentsResponse, createComment, createReply, fetchComments } from '@/services/ootd.ts/ootdComments';
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
  const [replyComment, setReplyComment] = useState('');
  const [likeCount] = useState(initialLikeCount);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const { data: commentData, refetch, isLoading } = useQuery<FetchCommentsResponse>(
    ['comments', postId],
    () => fetchComments(postId)
  );

  const comments: Comment[] = commentData ? Object.values(commentData.result) : [];

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

  const replyMutation = useMutation(
    ({ content, parentId }: { content: string, parentId: number }) => createReply(postId, content, parentId),
    {
      onSuccess: () => {
        refetch();
        setCommentCount((prev) => prev + 1);
        setReplyComment('');
        setReplyTo(null);
      },
    }
  );

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      mutation.mutate(newComment);
    }
  };

  const handleReplySubmit = () => {
    if (replyComment.trim() && replyTo !== null) {
      replyMutation.mutate({ content: replyComment, parentId: replyTo });
    }
  };

  const handleReplyClick = (commentId: number) => {
    setReplyTo(commentId);
    setReplyComment('');
  };

  const renderComments = (comments: Comment[], depth = 0) => {
    return comments.map((comment) => (
      <div key={comment.id} className={`mb-4 ${depth > 0 ? 'ml-8' : ''}`}>
        <div className="">
            <div className='flex flex-row items-center'>
          {comment.member?.profileUrl && (
            <Image src={comment.member.profileUrl} alt="사용자 프로필" width={32} height={32} className="rounded-full" />
          )}
           <div className="text-zinc-800 text-sm font-normal font-['Pretendard'] ml-[5px]">{comment.member?.nickName}</div>
          </div>
          <div className="ml-14 items-center">
            <div>{comment.content}</div>
            <div className='flex flex-row my-2'>
            <div className="text-gray-600">{formatDate(comment.createDateTime)}</div>
            <div>&nbsp;&nbsp;|&nbsp;&nbsp;</div>
            <button onClick={() => handleReplyClick(comment.id)} className="text-gray-500">
              답글쓰기
            </button>
            </div>
          </div>
        </div>
        {replyTo === comment.id && (
        <div className="w-[95%] flex flex-col p-4 mt-2 ml-8 bg-white rounded-lg shadow-md">
        <div className='flex flex-row items-center flex-1'>
            {userInfo?.profileImageUrl && (
                <Image src={userInfo.profileImageUrl} alt="사용자" width={24} height={24} className="rounded-full" />
            )}
            <div className="font-bold ml-[5px]">{userInfo?.nickName}</div>
        </div>
            <div className='flex-1 flex'>
                <input
                    type="text"
                    className="w-[80%] max-w-[570px] mt-2 p-2 rounded-l flex-1"
                    value={replyComment}
                    onChange={(e) => setReplyComment(e.target.value)}
                    placeholder="답글을 입력해주세요..."
                />
                <button
                    onClick={handleReplySubmit}
                    className="ml-auto mt-auto mb-[2px] px-8 py-1 bg-neutral-100 rounded-lg justify-center items-center inline-flex text-center text-zinc-800 text-base font-semibold font-['Pretendard']"
                >
                    입력
                </button>
                </div>
             </div>
            )}
        {comment.children.length > 0 && (
          <div className="my-4 ml-8 mr-6 p-4 bg-neutral-100 rounded-lg">
            {renderComments(comment.children, depth + 1)}
          </div>
        )}
    </div>
    ));
  };

  

  return (
    <div className="max-w-6xl w-full mx-auto">
      <div className="flex items-center space-x-4">
        <button className="flex items-center">
          <Image src={HeartIcon} alt="좋아요" width={24} height={24} />
          <span className="ml-2">{likeCount}</span>
        </button>
        <button className="flex items-center">
          <Image src={CommentIcon} alt="댓글" width={24} height={24} />
          <span className="ml-2">{commentCount}</span>
        </button>
      </div>
      <div className="comment-section w-full p-4 bg-white rounded-lg shadow-md flex items-center mt-4 p-4">
        <div className='w-[90%] flex flex-col'>
            <div className='w-full flex-1'>
                <div className='flex flex-row items-center'>
                {userInfo?.profileImageUrl && (
                <Image src={userInfo.profileImageUrl} alt="사용자" width={24} height={24} className="rounded-full" />
                )}
                <div className="font-bold ml-[5px]">{userInfo?.nickName}</div>
            </div>
        </div>
        <div className="w-[100%] flex-1 ml-1">
          <input
            type="text"
            className="mt-2 p-2 rounded w-full"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="블로그가 훈훈해지는 댓글 부탁드립니다."
          />
        </div>
        </div>
        <button
          onClick={handleCommentSubmit}
          className="ml-auto mt-auto mb-[2px] px-8 py-1 bg-neutral-100 rounded-lg justify-center items-center inline-flex text-center text-zinc-800 text-base font-semibold font-['Pretendard']"
        >
          입력
        </button>
      </div>
      <div className="my-4 comment-section p-4 bg-white rounded-lg shadow-md">
        {isLoading ? (
          <div></div>
        ) : (
          comments.length === 0 ? (
            <div>댓글이 없습니다.</div>
          ) : (
            renderComments(comments)
          )
        )}
      </div>
    </div>
  );
};

export default CommentSection;
