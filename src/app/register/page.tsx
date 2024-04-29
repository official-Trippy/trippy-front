'use client'

import axios from 'axios'; 
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LogoButton from '../../../public/LogoButton.png'
import Image from 'next/image';

const RegisterPage = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState('');
  const [formData, setFormData] = useState({
    memberId: '',
    password: '',
    nickName: '',
    email: '',
    name: '',
    gender: '',
    phone: ''
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.BACKEND_URL}/api/member/signup`, formData);
      console.log(response.data);
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
        <input type="email" name="email" placeholder="Member ID" value={formData.memberId} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <input type="text" name="nickName" placeholder="Nick Name" value={formData.nickName} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <button type="submit">Sign Up</button>
    </form>
    </div> 
    </div>
  );
};

export default RegisterPage;