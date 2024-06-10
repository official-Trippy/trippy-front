'use client';

import FirstBg from "@/components/pages/onboarding/firstbg";
import SecondBg from "@/components/pages/onboarding/secondbg";
import ThirdBg from "@/components/pages/onboarding/thirdbg";
import Header from "@/components/shared/header/Header";
import Slider from "@/components/slider";
import React, { useEffect, useRef, useState } from "react";

const OnBoradingPage = () => {
  const pagesRef = useRef(null);
  const paginationRef = useRef(null);
  const [showSecondAnimation, setShowSecondAnimation] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const secondBgPosition = pagesRef.current ? pagesRef.current.children[1].offsetTop : 0;
      const thirdBgPosition = pagesRef.current ? pagesRef.current.children[2].offsetTop : 0;
      const onSecondBg = window.scrollY + window.innerHeight > secondBgPosition;
      const onThirdBg = window.scrollY + window.innerHeight > thirdBgPosition;

      if (onSecondBg) {
        setShowSecondAnimation(true);
      } else {
        setShowSecondAnimation(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  return (
    <div className="">
      <div className="pages w-full" ref={pagesRef}>
        <FirstBg className={`page slide-up-animation`} >
          <div>
            <Header />
          </div>
          <div className="w-[80%] flex mx-auto">
            <div className="pt-[10rem] z-10">
              <h1 className="text-[4rem] font-bold text-btn-color">나만의 여행을<br />기록할 수 있어요</h1>
              <span className="text-[2rem] font-normal text-btn-color ">소중한 순간들을 나만의 스타일로 특별하게 기록해보세요</span>
            </div>
          </div>
        </FirstBg>
        <SecondBg className={`page slide-up-animation`}>
          <div className="w-[80%] flex mx-auto">
            <div className="pt-[10rem] flex flex-col ml-auto">
              <h1 className="text-[4rem] font-bold text-white flex flex-col ml-auto">서로의 여행 기록을<a className="flex ml-auto">공유할 수 있어요</a></h1>
              <span className="text-[2rem] font-normal text-white ">서로의 이야기를 통해 각자의 여행을 더욱 뜻깊게 만들어보세요</span>
            </div>
          </div>
        </SecondBg>
        <ThirdBg className="page slide-up-animation">
          <div className="w-[80%] flex flex-col relative z-10  mx-auto my-auto">
            <div className="pt-[10rem] flex flex-col mx-auto text-center">
              <h1 className="text-[4rem] font-bold text-white flex mx-auto">나만의 특별한 OOTD와<br />정보를 공유할 수 있어요</h1>
              <span className="text-[2rem] font-normal text-white ">여행 중 나의 특별한 OOTD를 공유하며 소통해보세요</span>
            </div>
            <button className="w-[32rem] mt-[6rem] py-[1.2rem] bg-btn-color mx-auto font-semibold text-white text-[1.6rem] rounded-[0.4rem] hover:bg-btn-color/85">시작하기</button>
          </div>
        </ThirdBg>
      </div>
      <ul className="pagination appearance-none" ref={paginationRef}></ul>
      <Slider pagesRef={pagesRef} paginationRef={paginationRef} />
    </div>
  );
};

export default OnBoradingPage;