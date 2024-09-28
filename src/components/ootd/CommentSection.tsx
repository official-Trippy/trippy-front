import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'react-query';
import Image from 'next/image';
import { useUserStore } from '@/store/useUserStore';
import { formatTime, formatTimetoDays } from '@/constants/dateFotmat';
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
import Swal from 'sweetalert2';


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
    const contentWithoutMention = comment.content.split(' ').filter(word => !word.startsWith('@')).join(' ').trim();
    setEditedComment(contentWithoutMention); // 멘션 제거한 원래 댓글 내용 설정
    // 댓글의 멘션 사용자 이름을 replyToNickname에 설정
    const mention = comment.content.split(' ').find(word => word.startsWith('@'));
    if (mention) {
        setReplyToNickname(mention.substring(1)); // '@'를 제거하고 설정
    }
};
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({}); // 각 메뉴의 ref

  // 메뉴 열기/닫기
  const handleCabapIconClick = (commentId: number) => {
    setIsMenuOpen((prev) => ({
      ...prev,
      [commentId]: !prev[commentId], // 현재 메뉴를 토글
    }));
  };

  // 메뉴 외부 클릭 감지
  const handleClickOutside = (event: MouseEvent) => {
    Object.keys(menuRefs.current).forEach((commentId) => {
      const ref = menuRefs.current[Number(commentId)];
      if (ref && !ref.contains(event.target as Node)) {
        setIsMenuOpen((prev) => ({
          ...prev,
          [Number(commentId)]: false, // 메뉴 닫기
        }));
      }
    });
  };

  useEffect(() => {
    if (Object.values(isMenuOpen).some((open) => open)) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

// 수정 제출 시 멘션 추가
const handleEditSubmit = () => {
    setIsMenuOpen({});
    if (editedComment.trim() && editCommentId !== null) {
        // replyToNickname이 없으면 기본값으로 설정하거나 예외처리
        const mention = replyToNickname ? `@${replyToNickname}` : ''; // replyToNickname이 없으면 빈 문자열
        const updatedContent = `${mention} ${editedComment}`.trim(); // 수정된 내용에 멘션 추가
        // 수정 API 호출
        editCommentMutation.mutate({
            id: editCommentId,
            content: updatedContent,
        });
        setEditCommentId(null); // 수정 모드 종료
        setEditedComment(''); // 입력란 비우기
        setReplyToNickname(''); // 멘션 초기화
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
          
          // 좋아요 리스트에 현재 유저 추가 (즉각 반영)
          setLikeList((prevList) => [
            ...prevList,
            {
              nickName: userInfo.nickName,  // 현재 유저의 닉네임
              profileUrl: userInfo?.profileUrl, // 현재 유저의 프로필 이미지
            }
          ]);
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
  
          // 좋아요 리스트에서 현재 유저 제거 (즉각 반영)
          setLikeList((prevList) =>
            prevList.filter((user) => user.nickName !== userInfo.nickName)
          );
        }
      },
    }
  );

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      commentMutation.mutate(newComment);
      setIsMenuOpen({});
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
        setIsMenuOpen({});
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
  

  const handleDelete = async (commentId: number) => {
    const result = await Swal.fire({
      title: '정말 삭제하시겠습니까?',
      icon: 'warning',
      iconColor: '#FB3463',
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니오',
      confirmButtonColor: '#FB3463',
      customClass: {
        popup: 'swal-custom-popup',
        icon: 'swal-custom-icon'
      }
    });
  
    if (result.isConfirmed) {
      try {
        await deleteComment(commentId);
        refetch();
        await Swal.fire({
          icon: 'success',
          title: '댓글을 삭제하였습니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463',
          customClass: {
            popup: 'swal-custom-popup',
            icon: 'swal-custom-icon'
          }
        });
      } catch (error) {
        await Swal.fire(
          '오류 발생',
          '댓글 삭제 중 문제가 발생했습니다. 다시 시도해주세요.',
          'error'
        );
        console.error('댓글 삭제 실패:', error);
      }
    }
  };

  const handleProfileClick = (memberId: string | undefined) => {
    if (!memberId) return; // memberId가 없으면 함수 종료
    if (accessToken) {
      if (memberId === userInfo?.memberId) {
        router.push("/mypage");
      } else {
        router.push(`/user/${memberId}`);
      }
    } else {
      router.push(`/user/${memberId}`);
    }
  };

  console.log('댓글 데이터 구조:', commentData?.result)


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
                className="rounded-full cursor-pointer" 
                onClick={() => handleProfileClick(comment.member?.memberId)}
              />
            </div>
            <div className="text-[#292929] text-sm font-semibold ml-[5px] cursor-pointer" onClick={() => handleProfileClick(comment.member?.memberId)}>
              {comment.member?.nickName}
            </div>
            {ootdMemberId === comment.member.memberId && (
              <div className='ml-[10px] bg-[#FFE3EA] text-xs text-[#FB3463] border border-[#FB3463] px-2 py-1 rounded-xl'>블로그 주인</div>
            )}
            {userInfo.memberId === comment.member.memberId && (
              <div className='relative ml-auto min-w-[10px] cursor-pointer'  onClick={() => handleCabapIconClick(comment.id)}>
                <Image
                  src={CabapIcon}
                  alt="cabap"
                  width={2}
                  height={10}
                  className="mx-auto cursor-pointer"
                />
             {isMenuOpen[comment.id] && (
            <div 
              ref={(el) => {
                menuRefs.current[comment.id] = el; // 반환하지 않음
              }} 
              className="absolute w-[60px] right-[4px] mt-[5px] bg-white rounded shadow-lg z-10"
            >
              <div className="pt-3 pb-2 px-4 text-[#fa3463] cursor-pointer text-center flex-shrink-0" onClick={() => handleDelete(comment.id)}>
                삭제
              </div>
              <div className="border-t border-gray-300 my-2" /> 
              <div className="pt-2 pb-3 px-4 text-neutral-900 cursor-pointer text-center flex-shrink-0" onClick={() => handleEditClick(comment)}>
                수정
              </div>
            </div>
          )}
              </div>
            )}
          </div>
          <div className="ml-[3.7rem] items-center mr-0">
            {editCommentId === comment.id ? ( // 수정 중인 댓글이면
              <div className='flex flex-col'>
              <div className='flex-1 flex gap-2 mt-2 items-center'>
              <input
                type="text"
                className="p-2 rounded-lg flex-1  border border-[#cfcfcf]"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)} 
                placeholder={`@${replyToNickname || ''}에게 답글쓰기`}
              />
            </div>
            <div className='flex justify-end gap-2 mt-2'>
            <button
                onClick={handleEditSubmit}
                className="mt-auto mb-[2px] px-8 py-1 rounded-lg justify-center items-center inline-flex text-center text-base font-semibold bg-[#fa3463] text-white flex-shrink-0"
              >
                수정
              </button>
              <button
                onClick={() => setEditCommentId(null)}
                className="mt-auto mb-[2px] px-8 py-1 rounded-lg justify-center items-center inline-flex text-center text-base font-semibold border border-[#cfcfcf] text-[#cfcfcf] flex-shrink-0"
              >
                취소
              </button>
            </div>
              </div>
            ) : (
              <><div className='sm-700:mr-[2rem] break-words'>
                  {comment.content.split(' ').map((word) => {
                    return word.startsWith('@') ? (
                      <span key={word} className="text-[#FB3463]">{word} </span>
                    ) : (
                      `${word} `
                    );
                  })}
                </div><div className='flex flex-row my-2'>
                    <div className="text-gray-600">{formatTimetoDays(comment.createDateTime)}</div>
                    <div>&nbsp;&nbsp;|&nbsp;&nbsp;</div>
                    <button onClick={() => handleReplyClick(comment.id, comment.member?.nickName || '')} className="text-gray-500">
                      {replyTo === comment.id ? '답글취소' : '답글쓰기'}
                    </button>
                  </div></>
            )}
          </div>
        </div>
  
        {/* 답글쓰기 입력창 */}
        {replyTo === comment.id && (
          <div className={`flex flex-col p-4 mt-2 bg-white rounded-lg shadow-md border border-[#cfcfcf] ${depth === 0 ? 'mx-4 sm-700:mx-12' : ''}`}>
            <div className='flex flex-row items-center flex-1'>
              <div className="relative w-[28px] h-[28px]">
                <Image
                  src={userInfo?.profileImageUrl || DefaultImage}
                  alt="사용자 프로필"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div className="text-[#292929] font-semibold ml-[8px]">{userInfo?.nickName}</div>
            </div>
            <div className='flex-1 flex gap-2 mt-2'>
              <input
                type="text"
                className="p-2 rounded-l flex-1"
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
          <div className="mr-4 ml-4 sm-700:ml-12 sm-700:mr-12 mb-4 bg-neutral-100 rounded-lg">
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
      <div className="w-full bg-white rounded-lg shadow-md py-4 mt-8">
      <div className="grid grid-cols-2 xs-400:grid-cols-3 gap-0">
        {paginatedLikes.map((like, index) => (
          <div key={index} className="my-4 like-section px-4 py-0 sm-700:px-4 sm-700:py-4">
            <div className="flex items-center ml-[20px] xs-400:justify-center xs-400:ml-0 py-2">
              <div className="min-w-12 min-h-12 w-12 h-12 sm-700:w-16 sm-700:h-16 relative mr-4">
                <Image
                  src={like.profileUrl || userInfo.profileImageUrl}
                  alt="프로필 이미지"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div>
              <div className="text-gray-800 text-sm sm:text-base truncate whitespace-nowrap overflow-hidden">
                {like.nickName}
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    
      {/* 페이지네이션 버튼 */}
      {totalPages > 1 && (
      <div className="flex justify-center mt-4">
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
      )}
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
              width={20}
              height={20}
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
          <div className='flex flex-col space-y-4 w-full h-[200px] my-4 p-4 bg-neutral-100 rounded-lg shadow-md items-center text-neutral-900 justify-center'>
            <div className="text-2xl font-medium">
              트리피 회원이면 좋아요를 달 수 있어요
            </div>
            <div className="w-[220px] py-4 bg-[#fa3463] rounded-lg justify-center items-center inline-flex">
              <button className="text-center text-white text-2xl font-semibold font-['Pretendard'] items-center justify-center" onClick={handleLogin}>로그인 하러가기</button>
            </div>
          </div>
        )}
        {showComments && (
          <div className='flex flex-col space-y-4 w-full h-[200px] my-4 p-4 bg-neutral-100 rounded-lg shadow-md items-center text-neutral-900 justify-center'>
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
                        src={userInfo?.profileImageUrl || DefaultImage}
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
