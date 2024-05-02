import { useState } from 'react';
import Image from 'next/image';
import LogoButton from '../../../public/LogoButton.png';
import { signUp } from '@/services/auth';
import SignUpData from '@/types/auth';
import { useRouter } from 'next/navigation';

const BlogRegisterPage = () => {
  
  return (
    <div className="flex flex-col pt-20">
      <div className="flex items-center mb-8 justify-center"> 
        <Image src={LogoButton} alt="Logo" />
      </div>
      <div className='w-[80%] mx-auto'>
        <div>
            <a className=''>회원가입</a>
        </div>
        <div>
            <a className=''>프로필사진</a>
        </div>
      </div>
    </div>
  );
};

export default BlogRegisterPage;
