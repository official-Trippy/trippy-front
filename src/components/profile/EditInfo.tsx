'use client';

import { swear_words_arr } from "@/constants/wearWordsArr";
import useUserInfo from "@/hooks/useUserInfo";
import { checkBlogNameDuplicate, checkNickNameDuplicate, uploadImage } from "@/services/blog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DefaultProfileImg from "../../../public/DefaultProfile.svg";
import { useUserStore } from "@/store/useUserStore";
import { blogInterests } from "@/constants/blogPreference";
import { getMyInfo, updateMemberInfo } from "@/services/auth";
import { UpdateMemberInfoRequest } from "@/types/auth";
import backgroundImg from "../../../public/DefaultBackground.svg";
import { useMutation, useQuery, useQueryClient } from "react-query";
import RightIcon from '../../../public/icon_right.svg';
import UpIcon from '../../../public/arrow_up.svg';
import DownIcon from '../../../public/arrow_down.svg';
import Swal from "sweetalert2";

const EditInfo = () => {
  const { userInfo, updateUserInfo } = useUserStore(); 
  const queryClient = useQueryClient();

  const [profileImage, setProfileImage] = useState<{
    accessUri: string;
    authenticateId: string;
    imgUrl: string;
  } | null>(userInfo?.profileImage || null);

  const [blogImage, setBlogImage] = useState<{
    accessUri: string;
    authenticateId: string;
    imgUrl: string;
  } | null>(userInfo?.blogImage || null);

  const [nickName, setNickName] = useState<string>(userInfo?.nickName || '');
  const [nickNameError, setNickNameError] = useState<string>('');
  const [blogName, setBlogName] = useState<string>(userInfo?.blogName || '');
  const [blogNameError, setBlogNameError] = useState<string>('');
  const [blogIntroduce, setBlogIntroduce] = useState<string>(userInfo?.blogIntroduce || '');
  const [blogIntroduceError, setBlogIntroduceError] = useState<string>('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(userInfo?.koreanInterestedTypes || []);

  const [likeAlert, setLikeAlert] = useState(userInfo?.likeAlert || true);
  const [commentAlert, setCommentAlert] = useState(userInfo?.commentAlert || true);
  const [ticketScope, setTicketScope] = useState<"public" | "private" | "protected">(userInfo?.ticketScope || "public");
  const [ootdScope, setOotdScope] = useState<"public" | "private" | "protected">(userInfo?.ootdScope || "public");
  const [badgeScope, setBadgeScope] = useState<"public" | "private" | "protected">(userInfo?.badgeScope || "public");
  const [followScope, setFollowScope] = useState<"public" | "private" | "protected">(userInfo?.followScope || "public");
  const [tempSelectedInterests, setTempSelectedInterests] = useState<string[]>([]);

  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    if (userInfo) {
      setProfileImage(userInfo.profileImage || null);
      setBlogImage(userInfo.blogImage || null);
      setNickName(userInfo.nickName || '');
      setBlogName(userInfo.blogName || '');
      setBlogIntroduce(userInfo.blogIntroduce || '');
      setSelectedInterests(userInfo.koreanInterestedTypes || []);
      setLikeAlert(userInfo.likeAlert || true);
      setCommentAlert(userInfo.commentAlert || true);
      setTicketScope(userInfo.ticketScope || "public");
      setOotdScope(userInfo.ootdScope || "public");
      setBadgeScope(userInfo.badgeScope || "public");
      setFollowScope(userInfo.followScope || "public");
    }
  }, [userInfo]);


  const router = useRouter();

  const checkSwearWords = (value: string) => {
    const lowerValue = value.toLowerCase();
    return swear_words_arr.some((swearWord: string) =>
      lowerValue.includes(swearWord)
    );
  };

  const handleNickName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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

    if (!value) {
      setBlogNameError("");
      setBlogName(value);
      return;
    }

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
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  const handleImageDelete = () => {
    setProfileImage(null);
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

  useEffect(() => {
    if (userInfo) {
      setLikeAlert(userInfo.likeAlert);
      setCommentAlert(userInfo.commentAlert);
    }
  }, [userInfo]);

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
      setSelectedInterests(tempSelectedInterests);
      setIsModalOpen(false);
      setWarningMessage(''); 
    }
  };

  const handleCloseModal = () => {
    setTempSelectedInterests(userInfo.koreanInterestedTypes);
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
      nickName: nickName || userInfo.nickName, 
      blogName: blogName || userInfo.blogName, 
      blogIntroduce: blogIntroduce || userInfo.blogIntroduce,
      koreanInterestedTypes: selectedInterests || userInfo.koreanInterestedTypes,
      profileImage: profileImage || userInfo.profileImage || undefined,
      blogImage: blogImage || userInfo.blogImage || undefined,
      likeAlert,
      commentAlert,
      ticketScope,
      ootdScope,
      badgeScope,
      followScope,
    };

    console.log('Updated Data:', data); 
  
    updateUserInfoMutation.mutate(data);
    updateUserInfo(data);
  };
  
  return (
    <><div className="relative w-full h-[300px]">
      <Image src={backgroundImg} alt="Background" layout="fill" objectFit="cover" />
    </div><div className="w-[80%] mx-auto">
        <div className="mt-[8rem]">
          <div className="mt-[6.82rem]">
            <div className="sign-up-info">프로필 사진</div>
            <div className="mt-[4rem] flex items-center">
              <div className="rounded-full overflow-hidden w-[16rem] h-[16rem]">
                {profileImage ? (
                  <Image
                    src={profileImage.accessUri}
                    alt="Profile"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="w-full h-auto"
                    style={{ width: 160, height: 160 }} />
                ) : (
                  <Image
                    src={userInfo?.profileImageUrl || DefaultProfileImg}
                    alt="Default Profile"
                    width={160}
                    height={160} />
                )}
              </div>
              <div className="ml-4 flex flex-col">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload" />
                <label htmlFor="imageUpload" className="ml-[4rem] custom-label">
                  프로필 사진 업로드
                </label>
                {profileImage && (
                  <div className="h-[1rem]">
                    <button
                      onClick={handleImageDelete}
                      className="ml-[4rem] mt-[1.857rem] text-[1.4rem] text-gray-500 hover:text-gray-900"
                    >
                      이미지 삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-col">
              <div className="mt-[6rem]">
                <label htmlFor="nickName" className="sign-up-info block">
                  닉네임
                </label>
                <input
                  type="text"
                  value={nickName}
                  onChange={handleNickName}
                  placeholder="닉네임은 한글 2-8자, 영어 4-16자 이내로 입력 가능합니다."
                  className="w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }} />
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

              <div className="mt-[6rem]">
                <label htmlFor="blogName" className="sign-up-info block">
                  블로그 이름
                </label>
                <input
                  type="text"
                  value={blogName}
                  onChange={handleBlogName}
                  placeholder="블로그 이름은 한글 2-15자, 영어 4-30자 이내로 입력 가능합니다."
                  className="w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }} />
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

              <div className="mt-[6rem]">
                <label htmlFor="blogIntroduce" className="sign-up-info block">
                  한 줄 소개(선택)
                </label>
                <input
                  type="text"
                  value={blogIntroduce}
                  onChange={handleBlogIntroduce}
                  placeholder="50글자 이내로 소개글을 작성해보세요."
                  className="w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }} />
                {blogIntroduceError && (
                  <p className="mt-2 text-red-500">{blogIntroduceError}</p>
                )}
              </div>

              <div className="mt-[6rem]">
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
                <div className="mt-[2.5rem] flex flex-wrap">
                  {selectedInterests.map((interest, index) => (
                    <div
                      key={index}
                      className="flex items-center px-4 py-3 mr-2 mb-2 rounded-[999px] bg-[#FB3463] text-white cursor-pointer"
                      onClick={() => handleInterestClick(interest)}
                    >
                      {interest}
                      {/* <span className="ml-2">x</span> */}
                    </div>
                  ))}
                </div>
              </div>
              {/* e.target.value as "public" | "private" | "protected" */}

              <div className="mt-[6rem]">
                <label className="sign-up-info block font-bold mb-6">알림 설정</label>
                <div className="w-[70px] flex items-center mb-4">
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

              <div className="mt-24">
                <label className="block sign-up-info font-bold mb-6">공개범위 설정</label>
                <div className="flex mb-8">
                <label className="block my-auto w-[150px] text-lg font-semibold">티켓</label>
                <div className="relative">
                  <div
                    className="w-40 rounded-lg focus:border-pink-600 shadow-lg text-[#6b6b6b] text-base focus:outline-none cursor-pointer"
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
                    {isTicketOpen && (
                      <Image src={UpIcon} alt="upIcon" width={16} height={28} />
                    )}
                    {!isTicketOpen && (
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
                  <label className="block my-auto w-[150px] text-lg font-semibold">OOTD</label>
                  <div className="relative">
                  <div
                    className="w-40 rounded-lg focus:border-pink-600 shadow-lg text-[#6b6b6b] text-base focus:outline-none cursor-pointer"
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

                <div className="flex mb-8">
                  <label className="block my-auto w-[150px] text-lg font-semibold">뱃지</label>
                  <div className="relative">
                  <div
                    className="w-40 rounded-lg focus:border-pink-600 shadow-lg text-[#6b6b6b] text-base focus:outline-none cursor-pointer"
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
                </div>

              <div className="flex mb-8">
                <label className="block my-auto w-[150px] text-lg font-semibold">팔로워 / 팔로잉</label>
                <div className="relative">
                  <div
                    className="w-40 rounded-lg focus:border-pink-600 shadow-lg text-[#6b6b6b] text-base focus:outline-none cursor-pointer"
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

            <div className="text-center">
              <button
                type="submit"
                className={`mx-auto mt-32 mb-32 w-[22rem] h-[6rem] bg-btn-color text-white py-2 rounded-lg focus:outline-none ${nickNameError.includes("다시") ||
                    blogNameError.includes("다시")
                    ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                    : ""}`}
                onClick={handleSubmit}
                style={{ fontSize: "2rem" }}
                disabled={nickNameError.includes("다시") || blogNameError.includes("다시")}
              >
                완료
              </button>
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