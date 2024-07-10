'use client';

import { swear_words_arr } from "@/constants/wearWordsArr";
import useUserInfo from "@/hooks/useUserInfo";
import { checkBlogNameDuplicate, checkNickNameDuplicate, signupCommon, uploadImage } from "@/services/blog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DefaultProfileImg from "../../../public/DefaultProfile.svg";
import { useUserStore } from "@/store/useUserStore";
import { blogInterests } from "@/constants/blogPreference";

const EditInfo = () => {
  const { userInfo } = useUserStore();

  const [profileImage, setProfileImage] = useState<{
    accessUri: string;
    authenticateId: string;
    imgUrl: string;
  } | null>(null);

  const [nickName, setNickName] = useState<string>("");
  const [nickNameError, setNickNameError] = useState<string>("");
  const [blogName, setBlogName] = useState<string>("");
  const [blogNameError, setBlogNameError] = useState<string>("");
  const [blogIntroduce, setBlogIntroduce] = useState<string>("");
  const [blogIntroduceError, setBlogIntroduceError] = useState<string>("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedInterests, setSelectedInterests] = useState<string[]>(userInfo?.interestedTypes || []);

  const { setUserInfo } = useUserInfo();
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

  const handleSubmit = async () => {
    if (!nickNameError.includes("사용 가능") || !blogNameError.includes("사용 가능") || !imageUploaded) {
      return;
    }

    try {
      const data = {
        profileImage: profileImage,
        nickName: nickName,
        blogName: blogName,
        blogIntroduce: blogIntroduce,
        interestedTypes: selectedInterests
      };

      console.log(data);
      setUserInfo(data);
      const response = await signupCommon(data);
      console.log("Signup success:", response);
      router.push("/blogRegister2");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="w-[80%] mx-auto">
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
                  style={{ width: 160, height: 160 }}
                />
              ) : (
                <Image
                  src={userInfo?.profileImageUrl || DefaultProfileImg}
                  alt="Default Profile"
                  width={160}
                  height={160}
                />
              )}
            </div>
            <div className="ml-4 flex flex-col">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
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
                style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
              />
              {nickNameError && (
                <p className={`mt-2 ${nickNameError.includes("사용 가능한 닉네임입니다.") ? "text-green-500" : "text-red-500"}`}>
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
                style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
              />
              {blogNameError && (
                <p className={`mt-2 ${blogNameError.includes("사용 가능한 블로그 이름입니다.") ? "text-green-500" : "text-red-500"}`}>
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
                style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
              />
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
          </div>
          <div className="text-center">
            <button
              type="submit"
              className={`mx-auto mt-32 mb-32 w-[22rem] h-[6rem] bg-btn-color text-white py-2 rounded-lg focus:outline-none ${
                !nickNameError.includes("사용 가능") ||
                !blogNameError.includes("사용 가능") ||
                !imageUploaded
                  ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                  : ""
              }`}
              onClick={handleSubmit}
              style={{ fontSize: "2rem" }}
              disabled={
                !nickNameError.includes("사용 가능") ||
                !blogNameError.includes("사용 가능") ||
                !imageUploaded
              }
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
                  className={`m-2 p-2 rounded-full cursor-pointer ${
                    selectedInterests.includes(interest)
                      ? "bg-[#FB3463] text-white"
                      : "bg-gray-200"
                  }`}
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
    </div>
  );
};

export default EditInfo;
