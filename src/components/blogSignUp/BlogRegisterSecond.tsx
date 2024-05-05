"use client";

import React, { useState } from "react";
import Image from "next/image";
import BlogStep2 from "../../../public/BlogStep2.svg";
import LogoMain from "../../../public/LogoMain.svg";

const interests = [
    "국내여행", "해외여행", "자유", "코스", "투어", 
    "조용한", "편안한", "친구", "가족", "혼자", 
    "힐링", "액티비티", "한달살기", "자연", "명소", 
    "축제", "먹거리", "숙소", "배낭여행", "차박"
  ];
  
  const BlogRegisterSecond = () => {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
    const toggleInterest = (interest: string) => {
      if (selectedInterests.includes(interest)) {
        setSelectedInterests(selectedInterests.filter(item => item !== interest));
      } else {
        setSelectedInterests([...selectedInterests, interest]);
      }
    };
  
    return (
      <div className="w-[80%] mx-auto mt-[15rem]">
        {/* <Image src={LogoMain} alt="Logo" className="mx-auto"/> */}
        <Image src={BlogStep2} alt="Logo" className="w-[47.7rem] mx-auto" />
        <div className="mt-[8rem]">
          <div className="mx-auto text-center">
            <div className="sign-up-info">관심분야를 선택해주세요 (선택)</div>
            <div className="mt-[.87rem] text-[1.6rem] text-[#9D9D9D]">관심분야를 2개 이상 선택해주세요. (최대 5개까지)</div>
          </div>
          <div className="w-[70rem] mx-auto grid grid-cols-5 gap-2 mt-[3.9rem] mb-[3.9rem]">
            {interests.map((interest, index) => (
              <button
                key={index}
                className={`favorite-btn-font ${selectedInterests.includes(interest) ? 'favorite-btn-active' : 'favorite-btn-inactive'}`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

export default BlogRegisterSecond;