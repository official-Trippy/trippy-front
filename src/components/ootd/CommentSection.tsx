import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import Image from 'next/image';
import { useUserStore } from '@/store/useUserStore';
import { formatTime } from '@/constants/dateFotmat';
import { FetchCommentsResponse, createComment, createReply, deleteComment, fetchComments, updateComment } from '@/services/ootd.ts/ootdComments';
import { checkIfLiked, likePost, unlikePost, likePostList } from '@/services/ootd.ts/ootdComments';
import HeartIcon from '../../../public/heartedIcon.svg';
import EmptyHeartIcon from '../../../public/heartIcon-default.svg';
import EmptyHeartIcon2 from '../../../public/heartIcon-fill.svg';
import CommentIcon from '../../../public/commentIcon-fill.svg';
import CommentIcon1 from '../../../public/commentIcon-default.svg';
import DownIcon from '../../../public/arrow_down.svg';
import UpIcon from '../../../public/icon_up.svg';
import { Comment } from '@/types/ootd';
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import DefaultImage from '../../../public/defaultImage.svg';
import CabapIcon from "../../../public/cabap.svg";


interface CommentSectionProps {
  postId: number;
  initialLikeCount: number;
  initialCommentCount: number;
  memberId: string;
  refetchPostDetail: () => Promise<any>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, initialLikeCount, initialCommentCount, memberId, refetchPostDetail }) => {
  const userInfo = useUserStore((state) => state.userInfo);
  const [newComment, setNewComment] = useState('');
  const [replyComment, setReplyComment] = useState('');
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyToNickname, setReplyToNickname] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showLikes, setShowLikes] = useState<boolean>(false);
  const [likeList, setLikeList] = useState<any[]>([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState<boolean>(false);
  const [ootdMemberId, setOotdMemberId] = useState(memberId);
  const [isMenuOpen, setIsMenuOpen] = useState<Record<number, boolean>>({});
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState<string>('');

  const handleEditClick = (comment: Comment) => {
    setEditCommentId(comment.id); // 수정할 댓글 ID 저장
    setEditedComment(comment.content); // 기존 댓글 내용 저장
  };
  const handleEditSubmit = () => {
    if (editedComment.trim() && editCommentId !== null) {
      // 수정 API 호출
      editCommentMutation.mutate({
        id: editCommentId,
        content: editedComment,
      });
      setEditCommentId(null); // 수정 모드 종료
      setEditedComment(''); // 입력란 비우기
    }
  };
  
  const editCommentMutation = useMutation(
    ({ id, content }: { id: number; content: string }) => updateComment(id, content),
    {
      onSuccess: () => {
        refetch(); // 댓글 목록 갱신
        refetchPostDetail(); // 포스트 세부 정보 갱신
      },
    }
  );
    

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;

  const accessToken = Cookies.get("accessToken");

  const [showComments, setShowComments] = useState<boolean>(!!accessToken);


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
        refetchPostDetail();
        setNewComment('');
      },
    }
  );

  const replyMutation = useMutation(
    ({ content, parentId, mentionMemberId, mentionMemberNickName, mentionCommentId }: { 
        content: string, 
        parentId: number, 
        mentionMemberId: string, 
        mentionMemberNickName: string, 
        mentionCommentId: number 
      }) => createReply(postId, content, parentId, mentionMemberId, mentionMemberNickName, mentionCommentId), 
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
          setIsLiked(true); // 좋아요 상태 변경
          setLikeCount((prevCount) => prevCount + 1); // 좋아요 수 증가
          refetchPostDetail(); // 상위 데이터 다시 불러오기
        }
      },
    }
  );

  const unlikeMutation = useMutation(
    () => unlikePost(postId),
    {
      onSuccess: (data) => {
        if (data.isSuccess) {
          setIsLiked(false); // 좋아요 취소 상태 변경
          setLikeCount((prevCount) => Math.max(prevCount - 1, 0)); // 좋아요 수 감소
          refetchPostDetail(); // 상위 데이터 다시 불러오기
        }
      },
    }
  );

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      commentMutation.mutate(newComment);
    }
  };

  useEffect(() => {
    console.log('댓글 데이터:', comments);
  }, [comments]);

    // 재귀적으로 commentId에 해당하는 댓글을 찾는 함수
    const findCommentById = (comments: Comment[], commentId: number): Comment | undefined => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          return comment;
        }
    
        // children에 대댓글이 있다면, 대댓글에서도 검색
        if (comment.children && comment.children.length > 0) {
          const found = findCommentById(comment.children, commentId);
          if (found) return found;
        }
      }
    
      // 찾지 못하면 undefined 반환
      return undefined;
    };
    

    const handleReplySubmit = () => {
      if (replyComment.trim() && replyTo !== null) {
        const currentReplyTarget = findCommentById(comments, replyTo); // 재귀 함수로 댓글 찾기
        console.log(replyTo);
        console.log(currentReplyTarget);
    
        if (!currentReplyTarget) {
          console.log('댓글을 찾을 수 없습니다.');
          return;
        }
    
        const mentionCommentId = replyTo;  // 대댓글의 ID
        const mentionMemberId = currentReplyTarget.member?.memberId || ''; // 대댓글 작성자의 ID
        const mentionMemberNickName = currentReplyTarget.member?.nickName || ''; // 대댓글 작성자의 닉네임
    
        // 대댓글의 parentId는 원본 댓글의 ID가 되어야 함
        const parentId = currentReplyTarget.parentId || replyTo; 
    
        const formattedReply = `@${mentionMemberNickName} ${replyComment}`;
    
        // API 요청 전송
        replyMutation.mutate({
          content: formattedReply,
          parentId,  // 원본 댓글의 ID
          mentionMemberId,  // 대댓글 작성자의 ID
          mentionMemberNickName,  // 대댓글 작성자의 닉네임
          mentionCommentId,  // 대댓글 ID
        });
      } else {
        console.log('댓글 내용을 입력해주세요.');
      }
    };
    
  

  const handleReplyClick = (commentId: number, nickName: string) => {
    if (replyTo === commentId) {
      // 이미 열린 상태면 닫음 (취소)
      setReplyTo(null);
      setReplyToNickname(null);
    } else {
      // 답글 입력 레이아웃 열기
      setReplyTo(commentId);
      setReplyToNickname(nickName);
    }
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
  
  const handleCabapIconClick = (commentId: number) => {
    setIsMenuOpen((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], 
    }));
  };

  const handleDelete = async (commentId: number) => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (confirmed) {
      try {
        await deleteComment(commentId); 
   
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
      }
    }
  };
  

  const renderComments = (comments: Comment[], depth = 0) => {
    return comments.map((comment) => (
      <div key={comment.id} className={`comment ${depth === 0 ? 'px-4' : ''}`}>
        {/* 댓글 표시 */}
        <div className='comment-section p-4 rounded-lg'>
          <div className='flex flex-row items-center'>
            <div className="relative w-[28px] h-[28px]">
              <Image 
                src={comment.member.profileUrl || DefaultImage} 
                alt="사용자 프로필" 
                layout="fill" 
                objectFit="cover" 
                className="rounded-full" 
              />
            </div>
            <div className="text-[#292929] text-sm font-semibold ml-[5px]">
              {comment.member?.nickName}
            </div>
            {ootdMemberId === comment.member.memberId && (
              <div className='ml-[10px] bg-[#FFE3EA] text-xs text-[#FB3463] border border-[#FB3463] px-2 py-1 rounded-xl'>블로그 주인</div>
            )}
            {userInfo.memberId === comment.member.memberId && (
              <div className='relative ml-auto'>
                <Image
                  src={CabapIcon}
                  alt="cabap"
                  width={2}
                  height={10}
                  onClick={() => handleCabapIconClick(comment.id)}
                  className="cursor-pointer"
                />
                {isMenuOpen[comment.id] && (
                  <div className="absolute w-[60px] right-0 mt-1 bg-white rounded shadow-lg z-10">
                    <div className="py-2 px-4 text-[#ff4f4f] hover:bg-gray-100 cursor-pointer text-center" onClick={() => handleDelete(comment.id)}>
                      삭제
                    </div>
                    <hr />
                    <div className="py-2 px-4 text-black hover:bg-gray-100 cursor-pointer text-center" onClick={() => handleEditClick(comment)}>
                      수정
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="ml-[3.7rem] items-center mr-0 sm-700:mr-[2rem]">
            {editCommentId === comment.id ? ( // 수정 중인 댓글이면
              <div>
                <input
                  type="text"
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)} // 입력 값 업데이트
                  className="border rounded p-1"
                />
                <button onClick={handleEditSubmit} className="ml-2">완료</button>
                <button onClick={() => setEditCommentId(null)} className="ml-2">취소</button>
              </div>
            ) : (
              <div>{comment.content}</div>
            )}
            <div className='flex flex-row my-2'>
              <div className="text-gray-600">{formatTime(comment.createDateTime)}</div>
              <div>&nbsp;&nbsp;|&nbsp;&nbsp;</div>
              <button onClick={() => handleReplyClick(comment.id, comment.member?.nickName || '')} className="text-gray-500">
                {replyTo === comment.id ? '답글취소' : '답글쓰기'}
              </button>
            </div>
          </div>
        </div>
  
        {/* 답글쓰기 입력창 */}
        {replyTo === comment.id && (
          <div className={`flex flex-col p-4 mt-2 bg-white rounded-lg shadow-md border border-[#cfcfcf] ${depth === 0 ? 'mx-4 sm-700:mx-12' : ''}`}>
            <div className='flex flex-row items-center flex-1'>
              <div className="relative w-[28px] h-[28px]">
                <Image
                  src={userInfo.profileImageUrl || DefaultImage}
                  alt="사용자 프로필"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div className="text-[#292929] font-semibold ml-[8px]">{userInfo?.nickName}</div>
            </div>
            <div className='flex-1 flex gap-2'>
              <input
                type="text"
                className="mt-2 p-2 rounded-l flex-1"
                value={replyComment}
                onChange={(e) => setReplyComment(e.target.value)}
                placeholder={`@${replyToNickname || ''}에게 답글쓰기`}
              />
              <button
                onClick={handleReplySubmit}
                className={`ml-auto mt-auto mb-[2px] px-8 py-1 rounded-lg justify-center items-center inline-flex text-center text-base font-semibold ${replyComment.trim() ? 'bg-[#fa3463] text-white' : 'bg-neutral-100 text-zinc-800'}`}
                disabled={!replyComment.trim()} 
              >
                입력
              </button>
            </div>
          </div>
        )}
  
        {/* 대댓글이 있는 경우 */}
        {comment.children.length > 0 && (
          <div className="mr-4 ml-4 sm-700:ml-12 sm-700:mr-12 my-4 bg-neutral-100 rounded-lg">
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
      <div className='w-full bg-white rounded-lg shadow-md py-4 mt-8'>
        <div className="grid grid-cols-3 gap-4">
          {paginatedLikes.map((like, index) => (
            <div key={index} className='my-4 like-section p-4'>
              <div className="flex items-center justify-center py-2">
                <div className="w-12 h-12 relative mr-4">
                  <Image
                    src={like.profileUrl || DefaultImage}
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

  if (!accessToken) {
    return (
      <div className="w-[90%] sm-700:w-[66%] sm-700:max-w-7xl mx-auto">
        <div className="flex items-center pt-12">
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
            <Image src={showComments ? CommentIcon : CommentIcon1} alt="댓글" width={20} height={20} />
            <span className={`mx-2 ${showComments ? 'text-[#FB3463]' : ''}`}>{commentCount}</span>
            <button className="flex items-center" onClick={handleToggleComments}>
              <Image src={showComments ? UpIcon : DownIcon} alt="펼치기/접기" width={24} height={24} />
            </button>
          </div>
        </div>
        {showLikes && (
          <div className='flex flex-col space-y-4 w-full h-[200px] my-4 p-4 bg-neutral-100 rounded-lg shadow-md items-center text-black justify-center'>
            <div className="text-2xl font-medium">
              트리피 회원이면 좋아요를 달 수 있어요
            </div>
            <div className="w-[220px] py-4 bg-[#fa3463] rounded-lg justify-center items-center inline-flex">
              <button className="text-center text-white text-2xl font-semibold font-['Pretendard'] items-center justify-center" onClick={handleLogin}>로그인 하러가기</button>
            </div>
          </div>
        )}
        {showComments && (
          <div className='flex flex-col space-y-4 w-full h-[200px] my-4 p-4 bg-neutral-100 rounded-lg shadow-md items-center text-black justify-center'>
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
    <div className="w-[90%] sm-700:w-[66%] sm-700:max-w-7xl mx-auto">
      <div className="flex items-center pt-12">
        <button className="flex items-center" onClick={handleLikeClick}>
          <Image
            src={
              isLiked
                ? HeartIcon
                : (showLikes ? EmptyHeartIcon2 : EmptyHeartIcon)
            }
            alt={isLiked ? "좋아요" : "좋아요 취소"}
            width={20}
            height={20}
          />
          <span className={`min-w-[10px] mx-2 ${showLikes ? 'text-[#FB3463]' : ''}`}>{likeCount}</span>
        </button>
        <button className="flex items-center" onClick={handleToggleLikes}>
          <Image src={showLikes ? UpIcon : DownIcon} alt="펼치기/접기" width={24} height={24} />
        </button>
        <div className='flex items-center ml-[10px]'>
          <Image src={showComments ? CommentIcon : CommentIcon1} alt="댓글" width={20} height={20} />
          <span className={`min-w-[10px] mx-2 ${showComments ? 'text-[#FB3463]' : ''}`}>{commentCount}</span>
          <button className="flex items-center" onClick={handleToggleComments}>
            <Image src={showComments ? UpIcon : DownIcon} alt="펼치기/접기" width={24} height={24} />
          </button>
        </div>
      </div>
      {showComments && (
        <>
          <div className="comment-section w-full p-4 bg-white rounded-lg shadow flex items-center mt-8">
            <div className='w-[90%] flex flex-col'>
              <div className='w-full flex-1'>
                <div className='flex flex-row items-center'>
                    <><div className="relative w-[28px] h-[28px]">
                      <Image
                        src={userInfo.profileImageUrl || DefaultImage}
                        alt="사용자"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full" />
                    </div></>
                  <div className="text-[#292929] font-semibold ml-[8px]">{userInfo?.nickName}</div>
                </div>
              </div>
              <div className="flex-1 ml-12 mr-1">
                <input
                  type="text"
                  className="mt-2 p-2 rounded w-[97%] sm-700:w-full focus:outline-normal"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="블로그가 훈훈해지는 댓글 부탁드립니다."
                />
              </div>
            </div>
            <button
              onClick={handleCommentSubmit}
              className={`flex-shrink-0 ml-auto mt-auto mb-[2px] px-8 py-1 rounded-lg justify-center items-center inline-flex text-center text-base font-semibold font-['Pretendard'] ${newComment.trim() ? 'bg-[#fa3463] text-white' : 'bg-neutral-100 text-zinc-800'}`}
              disabled={!newComment.trim()}
            >
              입력
            </button>
          </div>
          <div
          className={`comment-section w-full bg-white rounded-lg shadow-md items-center mt-16 ${comments.length > 0 ? 'pb-4' : ''}`}
        >
          {isLoading ? (
            <div></div>
          ) : (
            comments.length === 0 ? (
              <div className='pb-0'></div>
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
