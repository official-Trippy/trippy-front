import { useState } from 'react';
import Swal from 'sweetalert2';
import { checkEmailDuplicate } from '@/services/auth';

interface SignUpFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [duplicateMessage, setDuplicateMessage] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [verificationClicked, setVerificationClicked] = useState(false);

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailValid(isValid);
    setEmailErrorMessage(isValid ? '' : '이메일 형식이 올바르지 않습니다.');

    if (isValid) {
      try {
        const { duplicated } = await checkEmailDuplicate(value);
        if (duplicated) {
          setDuplicateMessage('해당 이메일이 이미 존재합니다.');
        } else {
          setDuplicateMessage('사용 가능한 이메일입니다.');
        }
      } catch (error) {
        console.error('이메일 중복 확인 오류:', error);
      }
    } else {
      setDuplicateMessage('');
    }
  };

  const handleEmailVerification = async () => {
    if (duplicateMessage === '사용 가능한 이메일입니다.') {
      setVerificationClicked(true);
      Swal.fire({
        title: '이메일을 보냈습니다.',
        icon: 'success',
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/.test(value);
    setPasswordValid(isValid);
    setPasswordErrorMessage(isValid ? '' : '비밀번호 형식이 맞지 않습니다.');
    setPasswordMatch(false);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passwordMatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="w-[80%] mx-auto mt-24">
      <div className='sign-up-info'>로그인 정보를 설정해주세요</div>
      <div className="mb-4 relative">
        <label htmlFor="email" className="sign-up-info block mt-16">이메일</label>
        <input type="email" id="email" value={email} onChange={handleEmailChange} placeholder="이메일 입력" className="w-full px-4 py-2 mt-8 mb-2 h-16 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none" />
        <button type="button" onClick={handleEmailVerification} disabled={!emailValid || duplicateMessage !== '사용 가능한 이메일입니다.'} className={`absolute top-1/2 mt-0.5 mb-1 transform -translate-y-1/2 right-0 mr-2 px-4 py-2 ${duplicateMessage === '사용 가능한 이메일입니다.' ? 'bg-black text-white hover:bg-gray-900 focus:outline-none focus:bg-gray-900' : 'bg-gray-400 text-white cursor-not-allowed'} rounded-lg`}>인증하기</button>
        <div className='h-12'>
          <p className="text-red-500">{emailErrorMessage}</p>
          <p className="text-green-500">{duplicateMessage}</p>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="sign-up-info block">비밀번호</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChange} placeholder="비밀번호 입력" className="w-full px-4 py-2 mt-8 mb-2 h-16 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none" />
        <div className='h-12'>
          {passwordErrorMessage && <p className="text-red-500">{passwordErrorMessage}</p>}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="confirmPassword" className="sign-up-info block">비밀번호 확인</label>
        <input type="password" id="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="비밀번호 재입력" className="w-full px-4 py-2 mt-8 mb-2 h-16 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none" />
        <div className='h-12'>
          {confirmPassword && !passwordMatch && <p className={`text-red-500`}>비밀번호가 일치하지 않습니다.</p>}
          {passwordMatch && confirmPassword && <p className={`text-green-500`}>비밀번호가 일치합니다.</p>}
        </div>
      </div>
      <button
        type="submit"
        className={`absolute left-1/2 transform -translate-x-1/2 bottom-32 w-56 h-16 bg-btn-color bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 ${
            !verificationClicked || !passwordValid || !passwordMatch ? 'cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''
        }`}
        disabled={!verificationClicked || !passwordValid || !passwordMatch}
        >
        다음
      </button>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>이메일을 보냈습니다. 확인해주세요.</p>
            <button onClick={() => setModalOpen(false)}>확인</button>
          </div>
        </div>
      )}
    </form>
  );
};

export default SignUpForm;
