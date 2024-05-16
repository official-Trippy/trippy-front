'use client';

import FirstBg from "@/components/pages/onboarding/firstbg";
import SecondBg from "@/components/pages/onboarding/secondbg";
import ThirdBg from "@/components/pages/onboarding/thirdbg";
import React, { useEffect, useRef, useState } from "react";

const OnBoradingPage = () => {
  const zeroRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLDivElement | null>(null);
  const secondRef = useRef<HTMLDivElement | null>(null);
  const thirdRef = useRef<HTMLDivElement | null>(null);
  const refsArray = [zeroRef, firstRef, secondRef, thirdRef];

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      // 스크롤 방향 감지
      const { deltaY } = e;
      const direction = deltaY > 0 ? 1 : -1;

      // 현재 활성화된 섹션을 기준으로 다음 또는 이전 섹션으로 이동
      const sections = document.querySelectorAll('.section');
      const currentSection = document.querySelector('.section.active') as HTMLElement; // HTMLElement로 타입 단언
      let index = Array.from(sections).indexOf(currentSection);
      index = Math.max(0, Math.min(sections.length - 1, index + direction));
      const nextSection = sections[index] as HTMLElement; // HTMLElement로 타입 단언

      // 부드러운 스크롤 이동
      window.scrollTo({
        top: nextSection.offsetTop,
        behavior: 'smooth',
      });

      // 활성화된 섹션 변경
      currentSection.classList.remove('active');
      nextSection.classList.add('active');
    };

    window.addEventListener('wheel', handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => window.removeEventListener('wheel', handleScroll);
  }, []);

  return (
    <div className="pages">
      <div className="section active"></div>
      <div className="section">
        <FirstBg>
          <div className="w-[80%] flex mx-auto">
            <div className="pt-[10rem]">
              <h1 className="text-[4rem] font-bold text-btn-color">나만의 여행을<br />기록할 수 있어요</h1>
              <span className="text-[2rem] font-normal text-btn-color ">소중한 순간들을 나만의 스타일로 특별하게 기록해보세요</span>
            </div>
          </div>
        </FirstBg>
      </div>
      <div className="section">
        <SecondBg>
          <div className="w-[80%] flex mx-auto">
            <div className="pt-[10rem] flex flex-col ml-auto">
              <h1 className="text-[4rem] font-bold text-white flex flex-col ml-auto">서로의 여행 기록을<a className="flex ml-auto">공유할 수 있어요</a></h1>
              <span className="text-[2rem] font-normal text-white ">서로의 이야기를 통해 각자의 여행을 더욱 뜻깊게 만들어보세요</span>
            </div>
          </div>
        </SecondBg>
      </div>
      <div className="section">
        <ThirdBg>
          <div className="w-[80%] flex flex-col relative z-10  mx-auto my-auto">
            <div className="pt-[10rem] flex flex-col mx-auto text-center">
              <h1 className="text-[4rem] font-bold text-white flex mx-auto">나만의 특별한 OOTD와<br />정보를 공유할 수 있어요</h1>
              <span className="text-[2rem] font-normal text-white ">여행 중 나의 특별한 OOTD를 공유하며 소통해보세요</span>
            </div>
            <button className="w-[32rem] mt-[6rem] py-[1.2rem] bg-btn-color mx-auto font-semibold text-white text-[1.6rem] rounded-[0.4rem] hover:bg-btn-color/85">시작하기</button>
          </div>
        </ThirdBg>
      </div>
    </div>
  );
};

export default OnBoradingPage;