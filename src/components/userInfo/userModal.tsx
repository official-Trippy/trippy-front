import React from "react";
import Cookies from "js-cookie";
import { UserModalProps } from "@/types/auth";
import { useRouter } from "next/navigation";

const UserModal: React.FC<UserModalProps & { style: React.CSSProperties, handleLogout: () => Promise<void> }> = ({ isOpen, onClose, userInfo, style, handleLogout }) => {

    const router = useRouter();

    const handleMyPage = () => {
        router.push('/mypage');
    }
    if (!isOpen || !userInfo) return null;

    return (
        <div className="w-[32rem] h-[23.4rem] relative bg-white rounded-lg shadow z-[50]" style={style}>
            <div className="px-[2rem] pt-[2rem] py-[1rem]">
                <div className="flex-col justify-center items-start gap-3 inline-flex">
                    <div className="self-stretch justify-start items-center gap-20 inline-flex">
                        <div className="flex-col justify-start items-start gap-2 inline-flex">
                            <div className="text-zinc-800 text-4xl font-bold font-Pretendard">{userInfo.nickName}</div>
                            <div className="flex-col justify-start items-start gap-1 flex">
                                <div className="text-neutral-400 text-2xl font-normal font-Pretendard">{userInfo.email}</div>
                                <div className="justify-start items-center gap-[9px] inline-flex">
                                    <div className="justify-start items-start gap-1 flex">
                                        <div className="text-center text-neutral-400 text-2xl font-normal font-Pretendard">팔로워</div>
                                        <div className="text-center text-neutral-500 text-2xl font-semibold font-Pretendard"></div>
                                    </div>
                                    <div className="justify-start items-start gap-1 flex">
                                        <div className="text-center text-neutral-400 text-2xl font-normal font-Pretendard">팔로잉</div>
                                        <div className="text-center text-neutral-500 text-2xl font-semibold font-Pretendard"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[46.61px] h-[46.61px]">

                        </div>
                    </div>
                    <div className="mt-[0.8rem]">
                        <span className="text-neutral-500 text-2xl font-normal font-Pretendard cursor-pointer" onClick={handleMyPage}>설정</span>
                        <span className="text-rose-500 text-2xl font-normal font-Pretendard cursor-pointer ml-[10px]" onClick={handleLogout}>로그아웃</span>
                    </div>
                </div>
            </div>
            <hr className="border-t-2 border-CFCFCF" />
            <div className="px-[2rem] pt-[2rem]">
                <div className="flex-col justify-center items-start gap-1 inline-flex w-full">
                    <div className="text-zinc-800 text-4xl font-bold font-Pretendard">{userInfo.blogName}</div>
                    <div className="mt-[0.4rem] text-neutral-400 text-2xl font-normal font-Pretendard">{userInfo.blogIntroduce}</div>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
