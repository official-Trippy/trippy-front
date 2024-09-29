"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import BlogStep2 from "../../../public/BlogStep2.svg";
import Link from "next/link";
import { submitInterests } from "@/services/blog"
import { blogInterests } from "@/constants/blogPreference";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const BlogRegisterSecond = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    // 페이지 진입 시 로그인 상태 및 role 값을 확인
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    const role = Cookies.get("role");

    // 로그인이 된 상태에서 role이 GUEST일 경우, 회원가입 페이지에 머물도록 함
    if (accessToken && refreshToken && role === "GUEST") {
      return;
    }

    // 로그인이 되었지만 role이 MEMBER 또는 ADMIN인 경우 리다이렉트
    if (role === "MEMBER" || role === "ADMIN") {
      router.push("/");
      return;
    }
  };

  const toggleInterest = (interest: string) => {
    // 이미 선택된 관심사를 클릭하면 해제
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest)
      );
    } 
    // 5개 초과로 선택되지 않도록 제한
    else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  // 선택된 관심사를 blogInterests의 순서대로 정렬
  const sortedSelectedInterests = blogInterests.filter(interest =>
    selectedInterests.includes(interest)
  );

  const isButtonActive =
    selectedInterests.length >= 2 && selectedInterests.length <= 5;

  const handleSubmit = async () => {
    console.log(sortedSelectedInterests); // 정렬된 관심사 출력
    try {
      const result = await submitInterests(sortedSelectedInterests);

      if (result.success) {
        console.log("Successfully submitted interests!");
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting interests:", error);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-60px)] flex flex-col justify-between flex-col-reverse mb-[60px] sm:flex-col sm-700:min-h-[100vh] sm-700:justify-center sm-700:mb-0 items-center w-full">
      <div className="w-[90%] max-w-[400px] mx-auto">
        <div className="w-full flex justify-center mt-[20px]">
          <Image src={BlogStep2} alt="Logo" className="w-[30rem]" />
        </div>
      </div>
      <div className="w-[90%] max-w-[400px] mx-auto my-auto sm-700:my-0 sm-700:mt-[4rem]">
        <div className="w-[90%] max-w-[400px] mx-auto flex flex-col justify-center">
          <div className="mx-auto text-center">
            <div className="sign-up-info">관심분야를 선택해주세요 (선택)</div>
            <div className="mt-[.87rem] text-[1rem] text-[#9D9D9D]">
              관심분야를 2개 이상 선택해주세요. (최대 5개까지)
            </div>
          </div>
          <div className="mx-auto grid grid-cols-5 gap-2 my-[4rem]">
            {blogInterests.map((interest, index) => (
              <button
                key={index}
                className={`favorite-btn-font ${selectedInterests.includes(interest)
                  ? "favorite-btn-active"
                  : "favorite-btn-inactive"
                }`}
                onClick={() => toggleInterest(interest)}
                disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 5} // 5개 선택 시 추가 선택 불가
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-[90%] max-w-[400px] mx-auto mt-auto sm-700:mt-0">
        <div className="text-center">
          <Link href="/blogRegister3">
            <button
              type="submit"
              className={`mx-auto w-full ${isButtonActive ? "bg-btn-color" : "bg-[#cfcfcf]"
                } sm-700:w-[120px] h-[44px] mt-[2rem] mb-[2rem] text-white py-2 rounded-xl flex justify-center items-center`}
              onClick={handleSubmit}
              style={{ fontSize: "1.2rem" }}
              disabled={!isButtonActive}
            >
              다음
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogRegisterSecond;