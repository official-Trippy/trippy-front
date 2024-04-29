import LogoButton from '../../../../public/LogoButton.png';
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
// import { checkUser, getUserInfo } from '@/service/auth';
// import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/general';

export default function Header() {
    return (
      <><header className="flex justify-between items-center px-4 py-8 w-[80%] mx-auto">
            <div className="flex items-center">
                <div className="mr-4">
                    <Image src={LogoButton} alt="Logo" />
                </div>
                <div className="flex space-x-4 text-lg">
                    <Link href="/home">
                        <div className="text-gray-800 px-10">홈</div>
                    </Link>
                    <Link href="/ootd">
                        <div className="text-gray-800">OOTD</div>
                    </Link>
                </div>
            </div>

            <div className="flex items-center">
                <div className="mr-4">
                    {/* 검색창 컴포넌트 */}
                </div>
                <div>
                <Link href="/login">
                <button className="bg-btn-color text-white px-6 py-2 rounded-lg">로그인</button>
                </Link>
                </div>
            </div>
        </header><div className="my-[1%] border-[1px] border-lightGray/30"></div></>
    );
  }
  