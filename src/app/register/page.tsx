'use client'

import { useState } from 'react';
import Image from 'next/image';
import LogoButton from '../../../public/LogoButton.png';
import { signUp } from '@/services/auth';
import SignUpData from '@/types/auth';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [formData, setFormData] = useState<SignUpData>({
    memberId: '',
    password: '',
    nickName: '',
    email: '',
    name: '',
    gender: '',
    phone: ''
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setFormData(prevState => ({
        ...prevState,
        memberId: value,
        [name]: value
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    try {
      await signUp(formData);
      alert('회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div className="flex flex-col items-center pt-20">
      <div className="mb-8">
        <Image src={LogoButton} alt="Logo" />
      </div>
      <div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm mt-2">이름</label>
            <input className="border-b border-gray-300 rounded-none py-2 w-[320px]" type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm mt-2">이메일</label>
            <input className="border-b border-gray-300 rounded-none py-2 w-[320px]" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm mt-2">비밀번호</label>
            <input className="border-b border-gray-300 rounded-none py-2 w-[320px]" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="nickName" className="text-sm mt-2">닉네임</label>
            <input className="border-b border-gray-300 rounded-none py-2 w-[320px]" type="text" name="nickName" placeholder="Nick Name" value={formData.nickName} onChange={handleChange} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-sm mt-2">연락처</label>
            <input className="border-b border-gray-300 rounded-none py-2 w-[320px]" type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="gender" className="text-sm mt-2">성별</label>
            <select className="border-b border-gray-300 rounded-none py-2 w-[320px]" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">성별을 선택해주세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <button className="bg-btn-color text-white px-4 rounded-md my-4 w-[320px] h-[44px]" type="submit">회원가입</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;