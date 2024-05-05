"use client";

import React, { useState } from "react";
import Image from "next/image";
import BlogStep2 from "../../../public/BlogStep2.svg";

const BlogRegisterSecond = () => {

  return (
    <div className="w-[80%] mx-auto mt-[10.9rem]">
      <Image src={BlogStep2} alt="Logo" className="w-[47.7rem] mx-auto" />
      <div className="mt-[9.4rem]">
        <div className="mx-auto text-center">
            <div className="sign-up-info">관심분야를 선택해주세요 (선택)</div>
            <div className="mt-[.87rem] text-[1.6rem] text-[#9D9D9D]">관심분야를 2개 이상 선택해주세요. (최대 5개까지)</div>
        </div>
        <div></div>
        </div>
    </div>
  );
};

export default BlogRegisterSecond;
