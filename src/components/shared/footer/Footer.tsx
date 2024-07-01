import React from "react";
import Image from "next/image";
import LogoHeader from "../../../../public/LogoHeader.svg";
import Instagram from "../../../../public/instagram.svg";
import Link from "next/link";

const Footer = () => {
    return (
        <div className="w-full h-[100px] fixed bottom-0 bg-neutral-500">
            <div className="w-[80%] h-full mx-auto flex justify-between items-center">
                <div className="flex space-x-4 items-center h-full my-auto">
                    <div className="text-white text-base font-light font-['Pretendard']">서비스 이용약관</div>
                    <div className="text-white text-base font-light font-['Pretendard']">개인정보 처리방침</div>
                    <Link href='www.instagram.com'>
                        <Image src={Instagram} alt="Instagram" width={12} height={12} className=""/>
                    </Link>
                </div>
                <div className="flex flex-col items-center">
                    <Image src={LogoHeader} alt="Trippy Logo" width={100} height={100} className="ml-auto"/>
                    <div className="text-white text-base font-light font-['Pretendard'] mt-4">©2024. Trippy All Rights Reserved.</div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
