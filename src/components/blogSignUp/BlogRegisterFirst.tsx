'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BlogStep1 from "../../../public/BlogStep1.svg";
import DefaultProfileImg from "../../../public/DefaultProfile.svg";
import {
  checkNickNameDuplicate,
  checkBlogNameDuplicate,
  signupCommon,
  uploadImage
} from "@/services/blog";
import useUserInfo from "@/hooks/useUserInfo";
import { swear_words_arr } from "@/constants/wearWordsArr";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import { signUp } from "@/services/auth";
import CheckUserRegistration from "../auth/CheckUserResister";

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

  const { data: session, status } = useSession();
  const sessionToken = Cookies.get("next-auth.session-token");
  const { setUserInfo } = useUserInfo();
  const router = useRouter();

  useEffect(() => {
    const password = "1004";
    const email = session?.user?.email;

    if (status === "authenticated") {
      signUp({ memberId: session.user?.email, email, password });
    } else {
      console.log("error");
    }
  }, [session]);

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
    const koreanRegex = /^[가-힣]{2,8}$/;
    const englishRegex = /^[a-zA-Z]{4,16}$/;
    return koreanRegex.test(nickName) || englishRegex.test(nickName);
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
    const koreanRegex = /^[가-힣]{2,15}$/;
    const englishRegex = /^[a-zA-Z]{4,30}$/;
    return koreanRegex.test(blogName) || englishRegex.test(blogName);
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
        blogIntroduce: blogIntroduce
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
    <div className="w-[80%] mx-auto mt-[15rem]">
      <Image src={BlogStep1} alt="Logo" className="w-[47.7rem] mx-auto" />
      <div className="mt-[8rem]">
        <div className="sign-up-info">기본 회원 정보를 등록해주세요</div>
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
                  src={DefaultProfileImg}
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
              <div className="h-[1.7rem] mt-[1.2rem]">
                {nickNameError && (
                  <p
                    className={`text-${nickNameError.includes("사용 가능") ? "green" : "red"
                      }-500`}
                  >
                    {nickNameError}
                  </p>
                )}
              </div>
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
              <div className="h-[1.7rem] mt-[1.2rem]">
                {blogNameError && (
                  <p
                    className={`text-${blogNameError.includes("사용 가능") ? "green" : "red"
                      }-500`}
                  >
                    {blogNameError}
                  </p>
                )}
              </div>
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
              <div className="h-[1.7rem] mt-[1.2rem]">
                {blogIntroduceError && (
                  <p className="text-red-500">{blogIntroduceError}</p>
                )}
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
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogRegisterFirst;