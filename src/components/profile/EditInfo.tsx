'use client';

import { swear_words_arr } from "@/constants/wearWordsArr";
import useUserInfo from "@/hooks/useUserInfo";
import { checkBlogNameDuplicate, checkNickNameDuplicate, uploadImage } from "@/services/blog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { blogInterests } from "@/constants/blogPreference";
import { getMyInfo, updateMemberInfo } from "@/services/auth";
import { UpdateMemberInfoRequest } from "@/types/auth";
import backgroundImg from "../../../public/DefaultBlogImg.svg";
import backgroundAddIcon from "../../../public/AddBlogImageIcon.svg";
import { useMutation, useQuery, useQueryClient } from "react-query";
import RightIcon from '../../../public/icon_right.svg';
import UpIcon from '../../../public/arrow_up.svg';
import DownIcon from '../../../public/arrow_down.svg';
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import DefaultImage from '../../../public/defaultImage.svg';
import { getByteLength } from "@/constants/getByteLength";
import OOtdDeleteImage from '../../../public/ootdImageDelete.svg';

const EditInfo = () => {
  const { updateUserInfo } = useUserStore(); // userInfo를 전역상태에서 가져오지 않고 API 호출로 처리
  const queryClient = useQueryClient();
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const handleImageUploadClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click(); 
    }
  };

  const [profileImage, setProfileImage] = useState<{
    accessUri: string;
    authenticateId: string;
    imgUrl: string;
  } | null>(null); 

  const [blogImage, setBlogImage] = useState<{
    accessUri: string;
    authenticateId: string;
    imgUrl: string;
  } | null>(null); 

  const [nickName, setNickName] = useState<string>('');
  const [nickNameError, setNickNameError] = useState<string>('');
  const [blogName, setBlogName] = useState<string>('');
  const [blogNameError, setBlogNameError] = useState<string>('');
  const [blogIntroduce, setBlogIntroduce] = useState<string>('');
  const [blogIntroduceError, setBlogIntroduceError] = useState<string>('');
  const [imageBlogUploaded, setImageBlogUploaded] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [likeAlert, setLikeAlert] = useState(true);
  const [commentAlert, setCommentAlert] = useState(true);
  const [ticketScope, setTicketScope] = useState<"public" | "private" | "protected">("public");
  const [ootdScope, setOotdScope] = useState<"public" | "private" | "protected">("public");
  const [badgeScope, setBadgeScope] = useState<"public" | "private" | "protected">("public");
  const [followScope, setFollowScope] = useState<"public" | "private" | "protected">("public");
  const [tempSelectedInterests, setTempSelectedInterests] = useState<string[]>([]);

  const [isProfileImageChanged, setIsProfileImageChanged] = useState(false);
  const [isBlogImageChanged, setIsBlogImageChanged] = useState(false);


  const [warningMessage, setWarningMessage] = useState('');

  const fetchUserInfo = async () => {
    try {
      const data = await getMyInfo(); 
      setProfileImage(data.profileImageUrl || null)
      setBlogImage(data.blogTitleImgUrl || null);
      setNickName(data.nickName || '');
      setBlogName(data.blogName || '');
      setBlogIntroduce(data.blogIntroduce || '');
      setSelectedInterests(data.koreanInterestedTypes || []);
      setLikeAlert(data.likeAlert || true);
      setCommentAlert(data.commentAlert || true);
      setTicketScope(data.ticketScope || "public");
      setOotdScope(data.ootdScope || "public");
      setBadgeScope(data.badgeScope || "public");
      setFollowScope(data.followScope || "public");
      updateUserInfo(data); // 전역 상태를 최신화
    } catch (error) {
      console.error('내 정보 조회 중 오류 발생:', error);
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchUserInfo(); // 컴포넌트가 마운트될 때 유저 정보 불러옴
  }, []);

  console.log('유저 사진:', profileImage);
  console.log('유저 블로그사진:', blogImage);
  console.log('유저 닉네임:', nickName);
  

  const router = useRouter();

  const checkSwearWords = (value: string) => {
    const lowerValue = value.toLowerCase();
    return swear_words_arr.some((swearWord: string) =>
      lowerValue.includes(swearWord)
    );
  };

  const handleNickName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const byteLength = getByteLength(value);
    if (byteLength > 16) return;

    setNickName(value);

    if (checkSwearWords(value)) {
      setNickNameError("욕설이 포함되었습니다. 다시 입력해주세요.");
      return;
    }

    if (!validateNickName(value)) {
      setNickNameError("형식이 올바르지 않습니다. 다시 입력해 주세요.");
    } else {
      setNickNameError("");
      await handleNickNameBlur(value);
    }
  };

  const handleNickNameBlur = async (value: string) => {
    try {
      const { duplicated } = await checkNickNameDuplicate(value);
      if (duplicated) {
        setNickNameError("이미 존재하는 닉네임입니다.");
      } else {
        setNickNameError("사용 가능한 닉네임입니다.");
      }
    } catch (error) {
      console.error("Error checking nickname duplication:", error);
      setNickNameError(
        "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  };

  const validateNickName = (nickName: string) => {
    const regex = /^[가-힣a-zA-Z0-9]{2,16}$/;
    return regex.test(nickName);
  };

  const handleBlogName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const byteLength = getByteLength(value);
    if (byteLength > 30) return;

    setBlogName(value);

    if (checkSwearWords(value)) {
      setBlogNameError("욕설이 포함되었습니다. 다시 입력해주세요.");
      return;
    }

    if (!validateBlogName(value)) {
      setBlogNameError("형식이 올바르지 않습니다. 다시 입력해 주세요.");
    } else {
      setBlogNameError("");
      await handleBlogNameBlur(value);
    }
  };

  const handleBlogNameBlur = async (value: string) => {
    try {
      const { duplicated } = await checkBlogNameDuplicate(value);
      if (duplicated) {
        setBlogNameError("중복된 블로그 이름입니다.");
      } else {
        setBlogNameError("사용 가능한 블로그 이름입니다.");
      }
    } catch (error) {
      console.error("Error checking blog name duplication:", error);
      setBlogNameError(
        "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  };

  const validateBlogName = (blogName: string) => {
    const regex = /^[가-힣a-zA-Z0-9]{2,30}$/;
    return regex.test(blogName);
  };


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const response = await uploadImage(file);
        setProfileImage(response.result);
        setImageUploaded(true);
        setIsProfileImageChanged(true);
      } catch (error: unknown) {
        console.error("Image upload failed:", error);
  
        if (error instanceof AxiosError) {
          if (error.response && error.response.status === 413) {
            Swal.fire({
              icon: 'error',
              title: '이미지 용량이 너무 큽니다.',
              text: '5MB 이하의 이미지를 선택해주세요.',
              confirmButtonText: '확인',
              confirmButtonColor: '#FB3463',
              customClass: {
                popup: 'swal-custom-popup',
                icon: 'swal-custom-icon'
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: '이미지 업로드 실패',
              text: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
              confirmButtonText: '확인',
              confirmButtonColor: '#FB3463',
              customClass: {
                popup: 'swal-custom-popup',
                icon: 'swal-custom-icon'
              }
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: '알 수 없는 오류 발생',
            text: '다시 시도해주세요.',
            confirmButtonText: '확인',
            confirmButtonColor: '#FB3463',
            customClass: {
              popup: 'swal-custom-popup',
              icon: 'swal-custom-icon'
            }
          });
        }
      }
    }
  };
  

  const handleImageDelete = () => {
    setProfileImage(null);
    setIsProfileImageChanged(true);
  };

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const response = await uploadImage(file);
        setBlogImage(response.result);
        setImageBlogUploaded(true);
        setIsBlogImageChanged(true);
      } catch (error: unknown) {
        console.error("Image upload failed:", error);
  
        if (error instanceof AxiosError) {
          if (error.response && error.response.status === 413) {
            Swal.fire({
              icon: 'error',
              title: '이미지 용량이 너무 큽니다.',
              text: '5MB 이하의 이미지를 선택해주세요.',
              confirmButtonText: '확인',
              confirmButtonColor: '#FB3463',
              customClass: {
                popup: 'swal-custom-popup',
                icon: 'swal-custom-icon'
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: '이미지 업로드 실패',
              text: '이미지 업로드에 실패했습니다. 다시 시도해주세요.',
              confirmButtonText: '확인',
              confirmButtonColor: '#FB3463',
              customClass: {
                popup: 'swal-custom-popup',
                icon: 'swal-custom-icon'
              }
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: '알 수 없는 오류 발생',
            text: '다시 시도해주세요.',
            confirmButtonText: '확인',
            confirmButtonColor: '#FB3463',
            customClass: {
              popup: 'swal-custom-popup',
              icon: 'swal-custom-icon'
            }
          });
        }
      }
    }
  };
  

  const handleBlogImageDelete = () => {
    setBlogImage(null);
    setIsBlogImageChanged(true);
  };

  const handleBlogIntroduce = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBlogIntroduce(value);

    if (checkSwearWords(value)) {
      setBlogIntroduceError("욕설이 포함되었습니다. 다시 입력해주세요.");
      return;
    }

    setBlogIntroduceError("");
  };

  const handleInterestClick = (interest: string) => {
    setSelectedInterests((prevSelected) => {
      if (prevSelected.includes(interest)) {
        return prevSelected.filter((item) => item !== interest);
      } else if (prevSelected.length < 5) {
        return [...prevSelected, interest];
      } else {
        return prevSelected;
      }
    });
  };

  useEffect(() => {
    console.log('Selected Interests:', selectedInterests);
  }, [selectedInterests]);


  const updateUserInfoMutation = useMutation(updateMemberInfo, {
    onSuccess: () => {
      queryClient.invalidateQueries('userInfo');
      Swal.fire({
        icon: 'success',
        title: `회원 정보를 성공적으로<br/>업데이트하였습니다!`,
        confirmButtonText: '확인',
        confirmButtonColor: '#FB3463', 
        customClass: {
          popup: 'swal-custom-popup',
          icon: 'swal-custom-icon'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/mypage');
        }
      });
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: '회원 정보 업데이트에 실패했습니다. 다시 시도해주세요.',
        confirmButtonText: '확인',
        confirmButtonColor: '#FB3463', 
        customClass: {
          popup: 'swal-custom-popup',
          icon: 'swal-custom-icon'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/editProfile')
        }
      });
    }
  });

  const handleOpenModal = () => {
    setTempSelectedInterests([...selectedInterests]);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (tempSelectedInterests.length < 2) {
      setWarningMessage('관심분야를 2개 이상 선택해주세요!');
    } else {
      // 선택한 관심분야를 blogInterests의 순서대로 정렬하여 저장
      const sortedInterests = blogInterests.filter((interest) => tempSelectedInterests.includes(interest));
      setSelectedInterests(sortedInterests);
      setIsModalOpen(false);
      setWarningMessage(''); 
    }
  };

  const handleCloseModal = () => {
    setTempSelectedInterests(tempSelectedInterests);
    setIsModalOpen(false);
  };
  
  const handleTempInterestClick = (interest: string) => {
    setTempSelectedInterests((prevSelected) => {
      if (prevSelected.includes(interest)) {
        return prevSelected.filter((item) => item !== interest);
      } else if (prevSelected.length < 5) {
        return [...prevSelected, interest];
      } else {
        return prevSelected;
      }
    });
  };

  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isOotdOpen, setIsOotdOpen] = useState(false);
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);
  const [isFollowOpen, setIsFollwOpen] = useState(false);

  const options = [
    { value: "public", label: "전체 공개" },
    { value: "protected", label: "팔로워만" },
    { value: "private", label: "비공개" },
  ];

  const handleTicketSelect = (value: any) => {
    setTicketScope(value);
    setIsTicketOpen(false);
  };

  const handleOotdSelect = (value: any) => {
    setOotdScope(value);
    setIsOotdOpen(false);
  };

  const handleBadgeSelect = (value: any) => {
    setBadgeScope(value);
    setIsBadgeOpen(false);
  };

  const handleFollowSelect = (value: any) => {
    setFollowScope(value);
    setIsFollwOpen(false);
  };


  const handleSubmit = () => {
    const data: UpdateMemberInfoRequest = {
      nickName, 
      blogName, 
      blogIntroduce,
      koreanInterestedTypes: selectedInterests,
      ...(isProfileImageChanged && { profileImage }), // 이미지가 수정된 경우에만 추가
      ...(isBlogImageChanged && { blogImage }), // 이미지가 수정된 경우에만 추가
      // profileImage: profileImage || null,
      // blogImage: blogImage || null,
      likeAlert,
      commentAlert,
      ticketScope,
      ootdScope,
      badgeScope,
      followScope,
    };
  
    console.log('Updated Data:', data); 
  
    updateUserInfoMutation.mutate(data);
    updateUserInfo(data); // 전역 상태를 업데이트
  };
  
  
  return (
    <>
  <div className="relative w-full h-[240px]">
  {/* Blog Image */}
  {blogImage ? (
    <Image
      src={(typeof blogImage === 'string' ? blogImage : blogImage?.accessUri) || backgroundImg}
      alt="Background"
      objectFit="cover"
      layout="fill"
      className="z-0"
    />
  ) : (
    <Image
      src={backgroundImg}
      alt="Backgrounded"
      objectFit="cover"
      layout="fill"
      className="z-0"
    />
  )}

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

  {/* Text and Upload Section */}
  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
    <input
      type="file"
      accept="image/*"
      ref={inputFileRef}
      style={{ display: 'none' }}
      onChange={handleBlogImageUpload}
    />
    <div
      className="flex flex-col cursor-pointer justify-center items-center mt-[30px]"
      onClick={handleImageUploadClick}
    >
      <Image
        src={backgroundAddIcon}
        alt="Add Blog Image Icon"
        width={50}
        height={50}
        className="cursor-pointer"
      />
      <div
        className="text-white text-2xl font-semibold font-['Pretendard'] mt-[10px] cursor-pointer"
        onClick={handleImageUploadClick}
      >
        대표사진 추가
      </div>
      <div
        className="text-white text-base font-semibold font-['Pretendard'] mt-[5px] cursor-pointer"
        onClick={handleImageUploadClick}
      >
        최적치수 1920 x 240 px
      </div>
    </div>
    <div className="h-[30px]">
      {blogImage && (
        <Image
          src={OOtdDeleteImage}
          alt="블로그이미지 삭제"
          width={20}
          height={20}
          className="cursor-pointer mt-[10px]"
          onClick={handleBlogImageDelete}
        />
      )}
    </div>
  </div>
    </div><div className="w-[90%] mb-[60px] mx-auto sm-700:max-w-[400px] sm-700:mb-0">
        <div className="mt-[4rem]">
          <div className="">
            <div className="sign-up-info">프로필 사진</div>
            <div className="mt-[2rem] flex items-center">
              <div className="rounded-full overflow-hidden w-[100px] h-[100px]">
                {profileImage ? (
                  <Image
                    src={(typeof profileImage === 'string' ? profileImage : profileImage?.accessUri) || backgroundImg}
                    alt="Profile"
                    className="object-cover w-full h-full"
                    width={100}
                    height={100}
                     />
                  ) : (
                    <Image
                    src={DefaultImage}
                    alt="Default Profile"
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"/>
                  )}
                </div>
              <div className="ml-8 flex flex-col justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload" />
                <label htmlFor="imageUpload" className="max-w-[200px] px-8 py-4 custom-label text-center">
                  프로필 사진 업로드
                </label>
                <div className="mt-[5px] h-[16px]">
                {profileImage && (
                    <button
                      onClick={handleImageDelete}
                      className="w-full mx-auto text-[1rem] text-gray-500 hover:text-gray-900"
                    >
                      이미지 삭제
                    </button>
                )}
              </div>
              </div>
            </div>
            <div className="flex-col">
              <div className="mt-[2rem]">
                <label htmlFor="nickName" className="sign-up-info block">
                  닉네임
                </label>
                <input
                  type="text"
                  value={nickName}
                  onChange={handleNickName}
                  placeholder="닉네임은 한글 2-8자, 영어 4-16자 이내로 입력 가능합니다."
                  className="w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{ background: "var(--4, #F5F5F5)", fontSize: "1.2rem" }} />
                {nickNameError && (
                  <p
                    className={`mt-2 ${nickNameError.includes("사용 가능한 닉네임입니다.")
                        ? "text-green-500"
                        : "text-red-500"}`}
                  >
                    {nickNameError}
                  </p>
                )}
              </div>

              <div className="mt-[2rem]">
                <label htmlFor="blogName" className="sign-up-info block">
                  블로그 이름
                </label>
                <input
                  type="text"
                  value={blogName}
                  onChange={handleBlogName}
                  placeholder="블로그 이름은 한글 2-15자, 영어 4-30자 이내로 입력 가능합니다."
                  className="w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{ background: "var(--4, #F5F5F5)", fontSize: "1.2rem" }} />
                {blogNameError && (
                  <p
                    className={`mt-2 ${blogNameError.includes("사용 가능한 블로그 이름입니다.")
                        ? "text-green-500"
                        : "text-red-500"}`}
                  >
                    {blogNameError}
                  </p>
                )}
              </div>

              <div className="mt-[2rem]">
                <label htmlFor="blogIntroduce" className="sign-up-info block">
                  한 줄 소개(선택)
                </label>
                <input
                  type="text"
                  value={blogIntroduce}
                  onChange={handleBlogIntroduce}
                  placeholder="50글자 이내로 소개글을 작성해보세요."
                  className="w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{ background: "var(--4, #F5F5F5)", fontSize: "1.2rem" }} />
                {blogIntroduceError && (
                  <p className="mt-2 text-red-500">{blogIntroduceError}</p>
                )}
              </div>

              <div className="mt-[3rem]">
                <div className="flex">
                <label htmlFor="interests" className="sign-up-info block">
                  관심 분야
                </label>
                <div className='flex ml-auto' onClick={() => handleOpenModal()}>
                  <div
                      className="pr-1 py-2 rounded-full text-[#9d9d9d] cursor-pointer"
                    >
                    설정하기
                  </div>
                  <Image src={RightIcon} alt="setting" width={8} height={14} />
                  </div>
                </div>
                <div className="mt-[2rem] flex flex-wrap">
                  {selectedInterests.map((interest, index) => (
                    <div
                      key={index}
                      className="flex items-center px-6 py-2 mr-2 mb-2 rounded-[999px] bg-[#FB3463] text-white cursor-pointer"
                      onClick={() => handleInterestClick(interest)}
                    >
                      {interest}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-[3rem]">
                <label className="sign-up-info block font-bold mb-[2rem]">알림 설정</label>
                <div className="w-[70px] flex items-center">
                  <label htmlFor="likeAlert" className="mr-4 text-lg">좋아요</label>
                  <label className="relative inline-flex items-center cursor-pointer ml-auto">
                    <input
                      type="checkbox"
                      id="likeAlert"
                      checked={likeAlert}
                      onChange={(e) => setLikeAlert(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-xl peer-checked:bg-custom-pink peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-xl after:h-5 after:w-5 after:transition-transform after:duration-300"></div>
                  </label>
                </div>
                <div className="min-h-[6px]"></div>
                <div className="w-[70px] flex items-center">
                  <label htmlFor="commentAlert" className="mr-4 text-lg">댓글</label>
                  <label className="relative inline-flex items-center cursor-pointer ml-auto">
                    <input
                      type="checkbox"
                      id="commentAlert"
                      checked={commentAlert}
                      onChange={(e) => setCommentAlert(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-xl peer-checked:bg-custom-pink peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-xl after:h-5 after:w-5 after:transition-transform after:duration-300"></div>
                  </label>
                </div>
              </div>

              <div className="mt-[3rem]">
                <label className="block sign-up-info font-bold mb-6">공개범위 설정</label>
                <div className="flex mb-8">
                  <label className="block my-auto w-[150px] text-lg">티켓</label>
                  <div className="relative">
                    <div
                      className={`w-40 rounded-lg shadow-lg text-[#6b6b6b] text-base focus:outline-none cursor-pointer ${
                        isTicketOpen ? 'border border-[#FB3463]' : ''
                      }`} 
                      style={{
                        borderRadius: "8px",
                        height: "3rem",
                        padding: "0.5rem 1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                      onClick={() => setIsTicketOpen(!isTicketOpen)}
                    >
                      {options.find((option) => option.value === ticketScope)?.label}
                      {isTicketOpen ? (
                        <Image src={UpIcon} alt="upIcon" width={16} height={28} />
                      ) : (
                        <Image src={DownIcon} alt="downIcon" width={16} height={28} />
                      )}
                    </div>
                    {isTicketOpen && (
                      <div
                        className="absolute mt-1 w-full rounded-lg shadow-lg bg-white"
                        style={{ zIndex: 10 }}
                      >
                        {options.map((option) => (
                          <div
                            key={option.value}
                            className="px-4 py-3 cursor-pointer hover:bg-neutral-100 text-[#6b6b6b]"
                            onClick={() => handleTicketSelect(option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex mb-8">
                  <label className="block my-auto w-[150px] text-lg">OOTD</label>
                  <div className="relative">
                  <div
                     className={`w-40 rounded-lg shadow-lg text-[#6b6b6b] text-base focus:outline-none cursor-pointer ${
                      isOotdOpen ? 'border border-[#FB3463]' : ''
                    }`} 
                    style={{
                      borderRadius: "8px",
                      height: "3rem",
                      padding: "0.5rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                    onClick={() => setIsOotdOpen(!isOotdOpen)}
                  >
                    {options.find((option) => option.value === ootdScope)?.label}
                    {isOotdOpen && (
                      <Image src={UpIcon} alt="upIcon" width={16} height={28} />
                    )}
                    {!isOotdOpen && (
                      <Image src={DownIcon} alt="downIcon" width={16} height={28} />
                    )}
                  </div>
                  {isOotdOpen && (
                    <div
                      className="absolute mt-1 w-full rounded-lg shadow-lg bg-white"
                      style={{ zIndex: 10 }}
                    >
                      {options.map((option) => (
                        <div
                          key={option.value}
                          className="px-4 py-3 cursor-pointer hover:bg-neutral-100 text-[#6b6b6b]"
                          onClick={() => handleOotdSelect(option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                </div>

                {/* <div className="flex mb-8">
                  <label className="block my-auto w-[150px] text-lg">뱃지</label>
                  <div className="relative">
                  <div
                     className={`w-40 rounded-lg shadow-lg text-[#6b6b6b] text-base focus:outline-none cursor-pointer ${
                      isBadgeOpen ? 'border border-[#FB3463]' : ''
                    }`} 
                    style={{
                      borderRadius: "8px",
                      height: "3rem",
                      padding: "0.5rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                    onClick={() => setIsBadgeOpen(!isBadgeOpen)}
                  >
                    {options.find((option) => option.value === badgeScope)?.label}
                    {isBadgeOpen && (
                      <Image src={UpIcon} alt="upIcon" width={16} height={28} />
                    )}
                    {!isBadgeOpen && (
                      <Image src={DownIcon} alt="downIcon" width={16} height={28} />
                    )}
                  </div>
                  {isBadgeOpen && (
                    <div
                      className="absolute mt-1 w-full rounded-lg shadow-lg bg-white"
                      style={{ zIndex: 10 }}
                    >
                      {options.map((option) => (
                        <div
                          key={option.value}
                          className="px-4 py-3 cursor-pointer hover:bg-neutral-100 text-[#6b6b6b]"
                          onClick={() => handleBadgeSelect(option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                </div> */}

              <div className="flex mb-8">
                <label className="block my-auto w-[150px] text-lg">팔로워 / 팔로잉</label>
                <div className="relative">
                  <div
                     className={`w-40 rounded-lg shadow-lg text-[#6b6b6b] text-base focus:outline-none cursor-pointer ${
                      isFollowOpen ? 'border border-[#FB3463]' : ''
                    }`} 
                    style={{
                      borderRadius: "8px",
                      height: "3rem",
                      padding: "0.5rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                    onClick={() => setIsFollwOpen(!isFollowOpen)}
                  >
                    {options.find((option) => option.value === followScope)?.label}
                    {isFollowOpen && (
                      <Image src={UpIcon} alt="upIcon" width={16} height={28} />
                    )}
                    {!isFollowOpen && (
                      <Image src={DownIcon} alt="downIcon" width={16} height={28} />
                    )}
                  </div>
                  {isFollowOpen && (
                    <div
                      className="absolute mt-1 w-full rounded-lg shadow-lg bg-white"
                      style={{ zIndex: 10 }}
                    >
                      {options.map((option) => (
                        <div
                          key={option.value}
                          className="px-4 py-3 cursor-pointer hover:bg-neutral-100 text-[#6b6b6b]"
                          onClick={() => handleFollowSelect(option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>
            <div className="w-[90%] max-w-[400px] mx-auto mt-[50px]">
            <div className="text-center">
              <button
                type="submit"
                className={`mx-auto w-[150px] h-[44px] mt-[2rem] mb-[2rem] text-white py-2 rounded-xl flex justify-center items-center  ${nickNameError.includes("다시") ||
                    blogNameError.includes("다시")
                    ? "cursor-not-allowed bg-[#cfcfcf] hover:bg-[#cfcfcf]"
                    : "bg-btn-color"}`}
                onClick={handleSubmit}
                style={{ fontSize: "1.2rem" }}
                disabled={nickNameError.includes("다시") || blogNameError.includes("다시")}
              >
                수정
              </button>
            </div>
            </div>
          </div>
        </div>
        {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg w-[80%] max-w-[400px]">
            <h2 className="text-2xl font-bold mb-2 text-[#292929]">관심 분야 설정</h2>
            <p className="text-sm text-[#6b6b6b] mb-4">관심분야를 2개 이상 설정해주세요</p>
            <div className="grid grid-cols-5 gap-2 justify-center">
              {blogInterests.map((interest, index) => (
                <div
                  key={index}
                  className={`px-2 py-4 rounded-xl cursor-pointer text-center ${
                    tempSelectedInterests.includes(interest)
                      ? "bg-[#FB3463] text-white"
                      : "bg-neutral-100 text-[#9d9d9d]"
                  }`}
                  onClick={() => handleTempInterestClick(interest)}
                >
                  {interest}
                </div>
              ))}
            </div>
            {warningMessage && (
              <p className="text-red-500 text-sm mt-4">{warningMessage}</p>
            )}
            <div className="mt-8 flex ml-auto justify-end">
              <button
                onClick={handleCloseModal}
                className="w-[68px] px-4 py-2 bg-neutral-100 text-[#292929] rounded-lg mr-2"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="w-[68px] px-4 py-2 bg-[#FB3463] text-white rounded-lg"
              >
                확인
              </button>
            </div>
          </div>
          </div>
        )}
      </div></>
  );
};

export default EditInfo;