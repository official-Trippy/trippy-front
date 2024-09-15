'use client'

import { motion } from 'framer-motion';
import Image from "next/image";
import LogoMain from "../../../public/LogoMain.svg";
import { checkEmailDuplicate, confirmEmail, emailSend, changePassword } from "@/services/auth";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const Password = () => {

  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [verificationClicked, setVerificationClicked] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [timer, setTimer] = useState(180);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  const [codeMessage, setCodeMessage] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const isVerificationButtonDisabled = codeMessage === '인증이 완료되었습니다.' || isCodeVerified;

  const router = useRouter();

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleCodeFocus = () => {
    setIsCodeFocused(true);
  };

  const handleCodeBlur = () => {
    setIsCodeFocused(false);
  };

  const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    setEmailValid(isValid);
    setEmailErrorMessage(isValid ? "" : "이메일 형식이 올바르지 않습니다.");

    if (isValid) {
      try {
        const { isSuccess, result } = await checkEmailDuplicate(value);
        if (isSuccess) {
          const duplicated = result.duplicated;
          if (duplicated) {
            setDuplicateMessage("해당 이메일로 가입된 기록이 있습니다. 인증을 진행해주세요.");
          } else {
            setDuplicateMessage("해당 이메일로 가입된 기록이 없습니다.");
          }
        } else {
          console.error("이메일 중복 확인 오류:", isSuccess);
          setDuplicateMessage("이메일 확인에 실패했습니다.");
        }
      } catch (error) {
        console.error("이메일 중복 확인 오류:", error);
        setDuplicateMessage("이메일 확인에 실패했습니다.");
      }
    } else {
      setDuplicateMessage("");
    }
  };

  const handleResendVerification = async () => {
    if (duplicateMessage === "해당 이메일로 가입된 기록이 있습니다. 인증을 진행해주세요.") {
      setVerificationClicked(true);
      setTimer(180);
      Swal.fire({
        icon: 'success',
        title: '인증 메일이 발송되었습니다.',
        html: `<div style="text-align: center;">${email}로 인증 메일을 발송했습니다.<br>메일에 첨부된 링크를 클릭하여 인증을 완료해주세요.</div>`,
        iconColor: '#FB3463', 
        showConfirmButton: true, 
        confirmButtonText: '확인',
        confirmButtonColor: '#FB3463'
      })
      try {
        const response = await emailSend(email);
        if (response.isSuccess) {
          console.log("Success to send email")
        } else {
          console.error("Failed to send email.");
        }
      } catch (error) {
        console.error("Error resending email:", error);
      }
    }
  };

  const handleValidNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = e.target.value.replace(/[^0-9]/g, '');
    setVerificationCode(regex);
  };

  const handleCodeVerification = async () => {
    try {
      const response = await confirmEmail(email, verificationCode);
      const valid = response.success;
      if (valid) {
        setCodeMessage('인증이 완료되었습니다.');
        setIsCodeVerified(true);
        setShowPasswordFields(true);
      } else {
        console.log(isCodeVerified);
        setCodeMessage('인증에 실패하였습니다. 다시 입력해주세요.');
      }
    } catch (error) {
      console.error("이메일 확인 오류:", error);
    }
  };

  const timerRef = useRef<number | null>(null);

  const handleTimerExpired = () => {
    setVerificationCode("");
    setTimer(180);
    setVerificationClicked(false);
  };

  useEffect(() => {
    if (timer > 0) {
      timerRef.current = window.setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else {
      handleTimerExpired();
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const isValid =
      /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,14}$/.test(value);
    setPasswordValid(isValid);
    setPasswordErrorMessage(isValid ? "" : "비밀번호 형식이 맞지 않습니다.");
    setPasswordMatch(false);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  const changeAccountPassword = async () => {
    try {
      const response = await changePassword(verificationCode, email, password);
      if (response.isSuccess) {
        Swal.fire({
          icon: 'success',
          title: '비밀번호 변경 성공',
          html: '<div style="text-align: center;">비밀번호 변경이 완료되었습니다.<br>변경된 비밀번호로 로그인해주세요.</div>',
          iconColor: '#FB3463', 
          showConfirmButton: true, 
          confirmButtonText: '로그인하기',
          confirmButtonColor: '#FB3463'
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/login');
          }
        });
        console.log('비밀번호 변경 성공');
      } else {
        console.log('비밀번호 변경 실패');
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
    }
  };
  

  return (
    <div className="min-h-[calc(100dvh-75px)] sm-700:min-h-[100vh] flex flex-col justify-between flex-col-reverse sm:flex-col sm:justify-center items-center w-full">
        <div className="w-[90%] max-w-[400px] mx-auto">
        <Image src={LogoMain} alt="Logo" className="mx-auto mt-[2rem]" width={135} height={34} />
      </div>
      <div className="w-[90%] max-w-[400px] mx-auto">
      {!showPasswordFields && (
        <div className='mx-auto sm:h-[438px] flex flex-col justify-center'>
          <div className="text-center text-zinc-800 text-4xl font-semibold font-['Pretendard']">비밀번호 재설정</div>
          <div className="text-center text-neutral-400 text-2xl text-base font-normal font-['Pretendard'] mt-[1rem]">트리피에 등록한 이메일을 입력해주세요.</div>
        <div
          className={`flex w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border  ${isInputFocused ? "border-[#FB3463]" : "border-gray-300"} focus:border-[#FB3463] focus:outline-none`}
          style={{ background: "var(--4, #F5F5F5)" }}
        >
            <input
              type="email"
              id="email"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={handleEmailChange}
              placeholder="Trippy@trip.com"
              className="flex-1 border-gray-300 focus:border-[#FB3463] focus:outline-none"
              style={{ background: "var(--4, #F5F5F5)", fontSize: "1.2rem" }}
              disabled={isCodeVerified} />
            {!isCodeVerified && (
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={!emailValid || duplicateMessage !== "해당 이메일로 가입된 기록이 있습니다. 인증을 진행해주세요." || isCodeVerified}
                className={`${duplicateMessage === "해당 이메일로 가입된 기록이 있습니다. 인증을 진행해주세요."
                  ? "bg-black text-white hover:bg-gray-900 focus:outline-none focus:bg-gray-900"
                  : "bg-gray-400 text-white cursor-not-allowed"} w-[8.6rem] h-[2.8rem] my-auto rounded-lg`}
                style={{ fontSize: "1.2rem" }}
              >
                {(verificationClicked ? "재전송" : "인증하기")}
              </button>
            )}
          </div>
          <div className="h-[1.7rem] w-[90%] max-w-[800px]">
            {emailErrorMessage && (
              <p className="text-red-500">{emailErrorMessage}</p>
            )}
            {duplicateMessage && (
              <p className={`text-${duplicateMessage.includes("없습니다.") ? "red" : "green"}-500`}>
                {duplicateMessage}
              </p>
            )}
          </div>
          {verificationClicked && (
            <><div className="">
              <div className="flex w-full">
                <label htmlFor="verificationCode" className="sign-up-info block mt-[6rem]">
                  인증 코드
                </label>
                {!isCodeVerified && (
                  <div className="mt-auto ml-[1rem] text-red-500">
                    {timer > 0 ? `${Math.floor(timer / 60)}:${timer % 60 < 10 ? `0${timer % 60}` : timer % 60}` : "인증 코드가 만료되었습니다."}
                  </div>
                )}
              </div>
              <div
                className={`flex w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border  ${isCodeFocused ? "border-[#FB3463]" : "border-gray-300"} focus:border-[#FB3463] focus:outline-none`}
                style={{ background: "var(--4, #F5F5F5)" }}
              >
                <input
                  type="text"
                  maxLength={6}
                  id="verificationCode"
                  onBlur={handleCodeBlur}
                  onFocus={handleCodeFocus}
                  onChange={handleValidNumberChange}
                  placeholder="인증 코드를 입력하세요"
                  className="flex-1 border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{ background: "var(--4, #F5F5F5)", fontSize: "1.2rem" }}
                  disabled={isCodeVerified} />
                <button
                  type="button"
                  onClick={handleCodeVerification}
                  disabled={isVerificationButtonDisabled}
                  className={`${isVerificationButtonDisabled
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-900 focus:outline-none focus:bg-gray-900"} w-[8.6rem] h-[2.8rem]  my-auto rounded-lg`}
                  style={{ fontSize: "1.2rem" }}
                >
                  {codeMessage === '인증이 완료되었습니다.' ? '인증 완료' : '확인하기'}
                </button>
              </div>
              <div className={`text-${codeMessage.includes('완료') ? 'green' : 'red'}-500 mt-2`}>
                {codeMessage}
              </div>
            </div></>
          )}
       </div>
      )}



      {showPasswordFields && (
        <><div className="flex flex-col mt-[6rem]">
          <div className="text-center text-zinc-800 text-4xl font-semibold font-['Pretendard']">비밀번호 재설정</div>
          <div className="text-center text-neutral-400 text-2xl text-base font-normal font-['Pretendard'] mt-[1rem]">비밀번호는 8~14자리의 영어, 숫자, 특수 기호를 포함해야 합니다.</div>
        </div>
          <motion.div
            className='w-full max-w-[400px]'
            initial={{ opacity: 0, translateX: -90 }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
              delay: 0.3
            }}
            animate={{
              opacity: 1,
              translateX: 0
            }}>
            <div className="w-full mt-[6rem]">
              <label htmlFor="password" className="sign-up-info block">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="영어, 숫자, 특수 기호를 포함한 8~14자리"
                className="w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                style={{ background: "var(--4, #F5F5F5)", fontSize: "1.2rem" }} />
              <div className="h-[1.7rem]">
                {passwordErrorMessage && (
                  <p className="text-red-500">{passwordErrorMessage}</p>
                )}
                {passwordValid && (
                  <p className="text-green-500">사용 가능한 비밀번호입니다.</p>
                )}
              </div>
            </div>
            <div className="mt-[2rem] w-full">
              <label htmlFor="confirmPassword" className="sign-up-info block">
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="영어, 숫자, 특수 기호를 포함한 8~14자리"
                className="w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                style={{ background: "var(--4, #F5F5F5)", fontSize: "1.2rem" }}
              />
              <div className="h-[1.7rem]">
                {confirmPassword && !passwordMatch && (
                  <p className={`text-red-500`}>비밀번호가 일치하지 않습니다.</p>
                )}
                {passwordMatch && confirmPassword && (
                  <p className={`text-green-500`}>비밀번호가 일치합니다.</p>
                )}
              </div>
            </div>
            </motion.div>
        </>
      )}
      </div>
      <div className="w-[90%] max-w-[400px] mx-auto">
      {showPasswordFields && (
      <motion.div
            className='w-full max-w-[400px]'
            initial={{ opacity: 0, translateX: -90 }}
            transition={{
              duration: 0.4,
              ease: 'easeInOut',
              delay: 0.3
            }}
            animate={{
              opacity: 1,
              translateX: 0
            }}>
            <div className="text-center">
              <button
                type="submit"
                className={`mx-auto w-full h-[44px] mt-[2rem] mb-[2rem] bg-btn-color text-white py-2 rounded-xl focus:outline-none ${!passwordValid ||
                    !passwordMatch
                    ? "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                    : ""
                  }`}
                style={{ fontSize: "1.2rem" }}
                disabled={
                  !passwordValid ||
                  !passwordMatch}
                onClick={changeAccountPassword}
              >
                비밀번호 변경
              </button>
            </div>
          </motion.div>
           )}
          </div>
    </div>
  );
};

export default Password;