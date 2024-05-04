'use client';

import FirstBg from "@/components/pages/onboarding/firstbg";
import SecondBg from "@/components/pages/onboarding/secondbg";
import ThirdBg from "@/components/pages/onboarding/thirdbg";
import React, { useEffect, useRef } from "react";

const OnBoradingPage = () => {
  const zeroRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLDivElement | null>(null);
  const secondRef = useRef<HTMLDivElement | null>(null);
  const thirdRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let throttleTimeout: any = null; // 스로틀링을 위한 타임아웃 변수

    const handleScroll = () => {
      if (throttleTimeout) return; // 스로틀링 중이면 함수 실행 중지

      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
        const scrollY = window.scrollY;
        const zeroBgHeight = zeroRef.current?.offsetHeight || 0;
        const firstBgHeight = firstRef.current?.offsetHeight || 0;
        const secondBgHeight = secondRef.current?.offsetHeight || 0;
        if (scrollY < zeroBgHeight / 2) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        else if (scrollY < firstBgHeight / 2.5) {
          window.scrollTo({ top: 120, behavior: 'smooth' });
        } else if (scrollY < firstBgHeight + secondBgHeight / 2) {
          window.scrollTo({ top: firstBgHeight, behavior: 'smooth' });
        } else {
          window.scrollTo({ top: firstBgHeight + secondBgHeight + 150, behavior: 'smooth' });
        }
      }, 50); // 200ms 동안 스로틀링
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimeout) clearTimeout(throttleTimeout); // 컴포넌트 언마운트 시 타임아웃 제거
    };
  }, []);


  return (
    <div>
      <div ref={zeroRef}></div>
      <div ref={firstRef}>
        <FirstBg>
          <div className="w-[80%] flex mx-auto">
            <div className="pt-[10rem]">
              <h1 className="text-[4rem] font-semibold text-white">나만의 여행을<br />기록할 수 있어요</h1>
              <span className="text-[2rem] font-normal text-google-btn ">소중한 순간들을 나만의 스타일로 특별하게 기록해보세요</span>
            </div>
          </div>
        </FirstBg>
      </div>
      <div ref={secondRef}>
        <SecondBg>
          <div className="w-[80%] flex mx-auto">
            <div className="pt-[10rem] flex flex-col ml-auto">
              <h1 className="text-[4rem] font-semibold text-white flex flex-col ml-auto">서로의 여행 기록을<a className="flex ml-auto">공유할 수 있어요</a></h1>
              <span className="text-[2rem] font-normal text-google-btn ">서로의 이야기를 통해 각자의 여행을 더욱 뜻깊게 만들어보세요</span>
            </div>
          </div>
        </SecondBg>
      </div>
      <div ref={thirdRef}>
        <ThirdBg>
          <div className="w-[80%] flex flex-col mx-auto my-auto">
            <div className="pt-[10rem] flex flex-col mx-auto text-center">
              <h1 className="text-[4rem] font-semibold text-white flex mx-auto">나만의 특별한 OOTD와<br />정보를 공유할 수 있어요</h1>
              <span className="text-[2rem] font-normal text-google-btn ">여행 중 나의 특별한 OOTD를 공유하며 소통해보세요</span>
            </div>
            <button className="w-[32rem] mt-[6rem] py-[1.2rem] bg-btn-color mx-auto font-semibold text-white text-[1.6rem] rounded-[0.4rem] hover:bg-btn-color/85">시작하기</button>
          </div>
        </ThirdBg>
      </div>
    </div>
  );
};

export default OnBoradingPage;