"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BlogStep1 from "../../../public/BlogStep1.svg";
import DefaultProfileImg from "../../../public/DefaultProfile.svg";
import {
  checkNickNameDuplicate,
  checkBlogNameDuplicate,
  signupCommon,
  uploadImage,
} from "@/services/blog";
import useUserInfo from "@/hooks/useUserInfo";
import { swear_words_arr } from "@/constants/wearWordsArr";

const BlogRegisterFirst = () => {
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
    <div className="min-h-[calc(100dvh-60px)] flex flex-col justify-between flex-col-reverse mb-[60px] sm:flex-col sm-700:min-h-[100vh] sm-700:justify-center sm-700:mb-0 items-center w-full">
      <div className="w-[90%] max-w-[400px] mx-auto">
      <div className="w-full flex justify-center mt-[20px]">
      <Image src={BlogStep1} alt="Logo" className="w-[30rem]"  />
    </div>
    </div>
    <div className="w-[90%] max-w-[400px] mx-auto">
      <div className="mt-[20px]">
        <div className="sign-up-info">기본 회원 정보를 등록해주세요</div>
        <div className="mt-[2rem]">
          <div className="sign-up-info">프로필 사진</div>
          <div className="mt-[2rem] flex items-center">
            <div className="rounded-full overflow-hidden w-[100px] h-[100px]">
              {profileImage ? (
                <Image
                  src={profileImage.accessUri}
                  alt="Profile"
                  className="object-cover w-full h-full"
                  width={100}
                  height={100}
                />
              ) : (
                <Image
                  src={DefaultProfileImg}
                  alt="Default Profile"
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="ml-8 flex flex-col justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="max-w-[200px] px-8 py-4 custom-label text-center"
              >
                프로필 사진 업로드
              </label>
              <div className="mt-[2px] h-[16px]">
              {profileImage && (
                  <button
                    onClick={handleImageDelete}
                    className="ml-[4rem] text-[1rem] text-gray-500 hover:text-gray-900"
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
                placeholder="한글 2-8자, 영어 4-16자 이내로 입력 가능합니다."
                className="w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                style={{ background: "var(--4, #F5F5F5)", fontSize: "1.2rem" }}
              />
              <div className="h-[1.7rem]">
                {nickNameError && (
                  <p
                    className={`text-${
                      nickNameError.includes("사용 가능") ? "green" : "red"
                    }-500`}
                  >
                    {nickNameError}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-[2rem]">
              <label htmlFor="blogName" className="sign-up-info block">
                블로그 이름
              </label>
              <input
                type="text"
                value={blogName}
                onChange={handleBlogName}
                placeholder="한글 2-15자, 영어 4-30자 이내로 입력 가능합니다."
                className="w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                style={{ background: "var(--4, #F5F5F5)", fontSize: "1.2rem" }}
              />
              <div className="h-[1.7rem]">
                {blogNameError && (
                  <p
                    className={`text-${
                      blogNameError.includes("사용 가능") ? "green" : "red"
                    }-500`}
                  >
                    {blogNameError}
                  </p>
                )}
              </div>
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
                style={{ background: "var(--4, #F5F5F5)", fontSize: "1.2rem" }}
              />
              <div className="h-[1.7rem]">
                {blogIntroduceError && (
                  <p className="text-red-500">{blogIntroduceError}</p>
                )}
              </div>
            </div>
          </div>
          </div>
          </div>
          </div>
          <div className="w-[90%] max-w-[400px] mx-auto mt-auto sm-700:mt-0">
          <div className="text-center">
          <button
              type="submit"
              className={`mx-auto w-full sm-700:w-[150px] h-[44px] mt-[2rem] mb-[2rem] text-white py-2 rounded-xl flex justify-center items-center ${
                !nickNameError.includes("사용 가능") ||
                !blogNameError.includes("사용 가능") ||
                !imageUploaded
                  ? "cursor-not-allowed bg-[#cfcfcf] hover:bg-[#cfcfcf]"
                  : ""
              }`}
              onClick={handleSubmit}
              style={{ fontSize: "1.2rem" }}
              disabled={
                !nickNameError.includes("사용 가능") ||
                !blogNameError.includes("사용 가능") ||
                !imageUploaded
              }
            >
              다음
            </button>
          </div>
          </div>
    </div>
  );
};

export default BlogRegisterFirst;
