"use client";

import React, { useState } from "react";
import Image from "next/image";
import BlogStep2 from "../../../public/BlogStep2.svg";
import Link from "next/link";
import { submitInterests } from "@/services/blog"
import { blogInterests } from "@/constants/blogPreference";

const BlogRegisterSecond = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter((item) => item !== interest)
      );
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const isButtonActive =
    selectedInterests.length >= 2 && selectedInterests.length <= 5;

  const handleSubmit = async () => {
    console.log(selectedInterests);
    try {
      const result = await submitInterests(selectedInterests);

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
                } mt-[2rem] mb-[2rem] items-center h-[44px] text-white rounded-xl focus:outline-none`}
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