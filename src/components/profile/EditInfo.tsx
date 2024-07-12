'use client';

import { swear_words_arr } from "@/constants/wearWordsArr";
import useUserInfo from "@/hooks/useUserInfo";
import { checkBlogNameDuplicate, checkNickNameDuplicate, uploadImage } from "@/services/blog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DefaultProfileImg from "../../../public/DefaultProfile.svg";
import { useUserStore } from "@/store/useUserStore";
import { blogInterests } from "@/constants/blogPreference";
import { updateMemberInfo } from "@/services/auth";
import { UpdateMemberInfoRequest } from "@/types/auth";
import backgroundImg from "../../../public/DefaultBackground.svg";
import { useMutation, useQueryClient } from "react-query";

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
  const [selectedInterests, setSelectedInterests] = useState<string[]>(userInfo?.interestedTypes || []);

  const [likeAlert, setLikeAlert] = useState(true);
  const [commentAlert, setCommentAlert] = useState(true);
  const [ticketScope, setTicketScope] = useState<"public" | "private" | "protected">(userInfo?.ticketScope || "public");
  const [ootdScope, setOotdScope] = useState<"public" | "private" | "protected">(userInfo?.ootdScope || "public");
  const [badgeScope, setBadgeScope] = useState<"public" | "private" | "protected">(userInfo?.badgeScope || "public");
  const [followScope, setFollowScope] = useState<"public" | "private" | "protected">(userInfo?.followScope || "public");

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

  const updateUserInfoMutation = useMutation(updateMemberInfo, {
    onSuccess: () => {
      queryClient.invalidateQueries('userInfo');
      alert("회원 정보가 성공적으로 업데이트되었습니다.");
    },
    onError: () => {
      alert("회원 정보 업데이트에 실패했습니다. 다시 시도해주세요.");
    }
  });

  const handleSubmit = () => {
    const data: UpdateMemberInfoRequest = {
      nickName: nickName || userInfo.nickName, 
      blogName: blogName || userInfo.blogName, 
      blogIntroduce,
      koreanInterestedTypes: selectedInterests,
      profileImage: profileImage || userInfo.profileImage || undefined,
      blogImage: blogImage || userInfo.blogImage || undefined,
      likeAlert,
      commentAlert,
      ticketScope,
      ootdScope,
      badgeScope,
      followScope,
    };
  
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
                <label htmlFor="interests" className="sign-up-info block">
                  관심 분야
                </label>
                <div className="mt-[2.5rem] flex flex-wrap">
                  {selectedInterests.map((interest, index) => (
                    <div
                      key={index}
                      className="flex items-center px-4 py-2 mr-2 mb-2 rounded-full bg-[#FB3463] text-white cursor-pointer"
                      onClick={() => handleInterestClick(interest)}
                    >
                      {interest}
                      <span className="ml-2">x</span>
                    </div>
                  ))}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 rounded-full border border-[#FB3463] text-[#FB3463] cursor-pointer"
                  >
                    + 관심 분야 추가
                  </button>
                </div>
              </div>

              <div className="mt-[6rem]">
                <label className="sign-up-info block">알림 설정</label>
                <div className="flex items-center mt-[1rem]">
                  <input
                    type="checkbox"
                    id="likeAlert"
                    checked={likeAlert}
                    onChange={(e) => setLikeAlert(e.target.checked)}
                    className="mr-2" />
                  <label htmlFor="likeAlert">좋아요 알림</label>
                </div>
                <div className="flex items-center mt-[1rem]">
                  <input
                    type="checkbox"
                    id="commentAlert"
                    checked={commentAlert}
                    onChange={(e) => setCommentAlert(e.target.checked)}
                    className="mr-2" />
                  <label htmlFor="commentAlert">댓글 알림</label>
                </div>
              </div>

              <div className="mt-[6rem]">
                <label className="sign-up-info block">티켓 공개 범위</label>
                <select
                  value={ticketScope}
                  onChange={(e) => setTicketScope(e.target.value as "public" | "private" | "protected")}
                  className="w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
                >
                  <option value="public">공개</option>
                  <option value="private">비공개</option>
                  <option value="protected">팔로워 공개</option>
                </select>
              </div>

              <div className="mt-[6rem]">
                <label className="sign-up-info block">OOTD 공개 범위</label>
                <select
                  value={ootdScope}
                  onChange={(e) => setOotdScope(e.target.value as "public" | "private" | "protected")}
                  className="w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
                >
                  <option value="public">공개</option>
                  <option value="private">비공개</option>
                  <option value="protected">팔로워 공개</option>
                </select>
              </div>

              <div className="mt-[6rem]">
                <label className="sign-up-info block">뱃지 공개 범위</label>
                <select
                  value={badgeScope}
                  onChange={(e) => setBadgeScope(e.target.value as "public" | "private" | "protected")}
                  className="w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
                >
                  <option value="public">공개</option>
                  <option value="private">비공개</option>
                  <option value="protected">팔로워 공개</option>
                </select>
              </div>

              <div className="mt-[6rem]">
                <label className="sign-up-info block">팔로우 공개 범위</label>
                <select
                  value={followScope}
                  onChange={(e) => setFollowScope(e.target.value as "public" | "private" | "protected")}
                  className="w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
                >
                  <option value="public">공개</option>
                  <option value="private">비공개</option>
                  <option value="protected">팔로워 공개</option>
                </select>
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
            <div className="bg-white p-8 rounded-lg w-[80%] max-w-[600px]">
              <h2 className="text-2xl font-bold mb-4">관심 분야 선택</h2>
              <div className="flex flex-wrap">
                {blogInterests.map((interest: string, index: number) => (
                  <div
                    key={index}
                    className={`m-2 p-2 rounded-full cursor-pointer ${selectedInterests.includes(interest)
                        ? "bg-[#FB3463] text-white"
                        : "bg-gray-200"}`}
                    onClick={() => handleInterestClick(interest)}
                  >
                    {interest}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div></>
  );
};

export default EditInfo;