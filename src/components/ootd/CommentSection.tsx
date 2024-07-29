import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import Image from 'next/image';
import { useUserStore } from '@/store/useUserStore';
import { formatTime } from '@/constants/dateFotmat';
import { FetchCommentsResponse, createComment, createReply, fetchComments } from '@/services/ootd.ts/ootdComments';
import { checkIfLiked, likePost, unlikePost, likePostList } from '@/services/ootd.ts/ootdComments';
import HeartIcon from '../../../public/icon_heart.svg';
import EmptyHeartIcon from '../../../public/empty_heart_default.svg';
import EmptyHeartIcon2 from '../../../public/empty_heart_open.svg';
import CommentIcon from '../../../public/empty_comment_open.svg';
import CommentIcon1 from '../../../public/empty_comment_default.svg';
import DownIcon from '../../../public/arrow_down.svg';
import UpIcon from '../../../public/icon_up.svg';
import { Comment } from '@/types/ootd';
import { useRouter } from "next/navigation";


interface CommentSectionProps {
  postId: number;
  initialLikeCount: number;
  initialCommentCount: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, initialLikeCount, initialCommentCount }) => {
  const userInfo = useUserStore((state) => state.userInfo);
  const [newComment, setNewComment] = useState('');
  const [replyComment, setReplyComment] = useState('');
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyToNickname, setReplyToNickname] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showLikes, setShowLikes] = useState<boolean>(false);
  const [likeList, setLikeList] = useState<any[]>([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const router = useRouter();

  const { data: commentData, refetch, isLoading } = useQuery<FetchCommentsResponse>(
    ['comments', postId],
    () => fetchComments(postId),
    {
      enabled: !!userInfo,
    }
  );

  const comments: Comment[] = commentData ? Object.values(commentData.result) : [];

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (userInfo) {
        const result = await checkIfLiked(postId);
        if (result.isSuccess) {
          setIsLiked(result.result);
        }
      }
    };
    fetchLikeStatus();
  }, [postId, userInfo]);

  useEffect(() => {
    const fetchLikeList = async () => {
      setIsLoadingLikes(true);
      try {
        const result = await likePostList(postId);
        console.log(result);
        if (result.isSuccess && Array.isArray(result.result.likeList)) {
          setLikeList(result.result.likeList);
        } else {
          setLikeList([]); 
        }
      } catch (error) {
        console.error('Error fetching like list:', error);
        setLikeList([]); 
      }
      setIsLoadingLikes(false);
    };
  
    if (showLikes) {
      fetchLikeList();
    }
  }, [showLikes, postId]);

  const commentMutation = useMutation(
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
        setReplyToNickname(null);
      },
    }
  );

  const likeMutation = useMutation(
    () => likePost(postId),
    {
      onSuccess: (data) => {
        if (data.isSuccess) {
          setLikeCount((prevCount) => prevCount + 1);
          setIsLiked(true);
        }
      },
    }
  );

  const unlikeMutation = useMutation(
    () => unlikePost(postId),
    {
      onSuccess: (data) => {
        if (data.isSuccess) {
          setLikeCount((prevCount) => Math.max(prevCount - 1, 0));
          setIsLiked(false);
        }
      },
    }
  );

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      commentMutation.mutate(newComment);
    }
  };

  const handleReplySubmit = () => {
    if (replyComment.trim() && replyTo !== null) {
      const formattedReply = `@${replyToNickname} ${replyComment}`;
      replyMutation.mutate({ content: formattedReply, parentId: replyTo });
    }
  };

  const handleReplyClick = (commentId: number, nickName: string) => {
    setReplyTo(commentId);
    setReplyToNickname(nickName);
  };

  const handleLikeClick = () => {
    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) setShowLikes(false);  
  };

  const handleToggleLikes = () => {
    setShowLikes(!showLikes);
    if (!showLikes) setShowComments(false);  
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const renderComments = (comments: Comment[], depth = 0, isChild = false) => {
    return comments.map((comment) => (
      <div key={comment.id} className={`${isChild ? '' : ''}`}>
        <div className='my-4 comment-section p-4 bg-white rounded-lg shadow-md'>
          <div className='flex flex-row items-center'>
            {comment.member?.profileUrl && (
              <Image src={comment.member.profileUrl} alt="사용자 프로필" width={32} height={32} className="rounded-full" />
            )}
            <div className="text-zinc-800 text-sm font-normal font-['Pretendard'] ml-[5px]">{comment.member?.nickName}</div>
          </div>
          <div className="ml-[3.7rem] items-center">
            <div>
              {comment.content}
            </div>
            <div className='flex flex-row my-2'>
              <div className="text-gray-600">{formatTime(comment.createDateTime)}</div>
              <div>&nbsp;&nbsp;|&nbsp;&nbsp;</div>
              <button onClick={() => handleReplyClick(comment.id, comment.member?.nickName || '')} className="text-gray-500">
                답글쓰기
              </button>
            </div>
          </div>
        </div>
        {replyTo === comment.id && (
          <div className="flex flex-col p-4 mt-2 bg-white rounded-lg shadow-md">
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
                placeholder={`@${replyToNickname || ''}에게 답글쓰기`}
                style={{ color: replyComment.startsWith(`@${replyToNickname}`) ? '#ffb9ca' : 'inherit' }}
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
          <div className={depth === 0 ? "my-4 ml-12 mr-4 p-4 bg-neutral-100 rounded-lg" : ""}>
            {renderComments(comment.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const renderLikeList = (likes: any[]) => {
    if (!Array.isArray(likes)) {
      return null;
    }
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLikes = likes.slice(startIndex, endIndex);
  
    const totalPages = Math.ceil(likes.length / itemsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
    return (
      <div className='w-full bg-white rounded-lg shadow-md py-4'>
      <div className="grid grid-cols-3 gap-4">
        {paginatedLikes.map((like, index) => (
          <div key={index} className='my-4 like-section p-4'>
            <div className="flex items-center justify-center py-2">
              <div className="w-12 h-12 relative mr-4">
                <Image 
                  src={like.profileUrl} 
                  alt="프로필 이미지" 
                  layout="fill" 
                  objectFit="cover" 
                  className='rounded-full'
                />
              </div>
              <div className="">
                <div className="text-gray-800">{like.nickName}</div>
                <div className="text-gray-800">{like.blogName}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
  <div className="flex justify-center">
    {pages.map((pageNumber) => (
      <button
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
        className={`px-4 py-2 mx-1 rounded ${currentPage === pageNumber ? 'text-[#fa3463] font-semibold' : 'text-[#cfcfcf] font-normal'}`}
      >
        {pageNumber}
      </button>
    ))}
  </div>
</div>

    );
  };
  
  
  
  if (!userInfo) {
    return (
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex items-center pb-4">
        <button className="flex items-center" onClick={handleLikeClick}>
        <Image
          src={
            isLiked 
              ? HeartIcon 
              : (showLikes ? EmptyHeartIcon2 : EmptyHeartIcon)
          }
          alt={isLiked ? "좋아요" : "좋아요 취소"}
          width={24}
          height={24}
        />
          <span className={`mx-2 ${showLikes ? 'text-[#FB3463]' : ''}`}>{likeCount}</span>
        </button>
        <button className="flex items-center" onClick={handleToggleLikes}>
            <Image src={showLikes ? UpIcon : DownIcon} alt="펼치기/접기" width={24} height={24} />
          </button>
        <div className='flex items-center ml-[10px]'>
          <Image src={showComments ? CommentIcon : CommentIcon1} alt="댓글" width={24} height={24} />
          <span className={`mx-2 ${showComments ? 'text-[#FB3463]' : ''}`}>{commentCount}</span>
          <button className="flex items-center" onClick={handleToggleComments}>
            <Image src={showComments ? UpIcon : DownIcon} alt="펼치기/접기" width={24} height={24} />
          </button>
        </div>
      </div>
      {showLikes && (
        <div className='flex flex-col space-y-4 w-full h-[200px] mb-4 n p-4 bg-neutral-100 rounded-lg shadow-md items-center text-black justify-center'>
        <div className="text-2xl font-medium">
          트리피 회원이면 좋아요를 달 수 있어요
        </div>
        <div className="w-[220px] py-4 bg-[#fa3463] rounded-lg justify-center items-center inline-flex">
          <button className="text-center text-white text-2xl font-semibold font-['Pretendard'] items-center justify-center" onClick={handleLogin}>로그인 하러가기</button>
        </div>
        </div>
      )}
        {showComments && (
        <div className='flex flex-col space-y-4 w-full h-[200px] my-4 n p-4 bg-neutral-100 rounded-lg shadow-md items-center text-black justify-center'>
        <div className="text-2xl font-medium">
          트리피 회원이면 댓글을 달 수 있어요
        </div>
        <div className="w-[220px] py-4 bg-[#fa3463] rounded-lg justify-center items-center inline-flex">
          <button className="text-center text-white text-2xl font-semibold font-['Pretendard'] items-center justify-center" onClick={handleLogin}>로그인 하러가기</button>
        </div>
        </div>
      )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full mx-auto">
      <div className="flex items-center pb-4">
        <button className="flex items-center" onClick={handleLikeClick}>
        <Image
          src={
            isLiked 
              ? HeartIcon 
              : (showLikes ? EmptyHeartIcon2 : EmptyHeartIcon)
          }
          alt={isLiked ? "좋아요" : "좋아요 취소"}
          width={24}
          height={24}
        />
          <span className={`mx-2 ${showLikes ? 'text-[#FB3463]' : ''}`}>{likeCount}</span>
        </button>
        <button className="flex items-center" onClick={handleToggleLikes}>
            <Image src={showLikes ? UpIcon : DownIcon} alt="펼치기/접기" width={24} height={24} />
          </button>
        <div className='flex items-center ml-[10px]'>
          <Image src={showComments ? CommentIcon : CommentIcon1} alt="댓글" width={24} height={24} />
          <span className={`mx-2 ${showComments ? 'text-[#FB3463]' : ''}`}>{commentCount}</span>
          <button className="flex items-center" onClick={handleToggleComments}>
            <Image src={showComments ? UpIcon : DownIcon} alt="펼치기/접기" width={24} height={24} />
          </button>
        </div>
      </div>
      {showComments && (
        <>
          <div className="comment-section w-full p-4 bg-white rounded-lg shadow-md flex items-center 4 p-4">
            <div className='w-[90%] flex flex-col'>
              <div className='w-full flex-1'>
                <div className='flex flex-row items-center'>
                  {userInfo?.profileImageUrl && (
                    <Image src={userInfo.profileImageUrl} alt="사용자" width={32} height={32} className="rounded-full" />
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
          <div className="">
            {isLoading ? (
              <div></div>
            ) : (
              comments.length === 0 ? (
                <div></div>
              ) : (
                renderComments(comments)
              )
            )}
          </div>
        </>
      )}
      {showLikes && (
        <div className="">
          {isLoadingLikes ? (
            <div></div>
          ) : (
            likeList.length === 0 ? (
              <div></div>
            ) : (
              renderLikeList(likeList)
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
