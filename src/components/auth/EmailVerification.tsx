import { checkEmailDuplicate, confirmEmail, emailSend } from "@/services/auth";
import React, { useState, useEffect, useRef, ChangeEvent } from "react";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [verificationClicked, setVerificationClicked] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [timer, setTimer] = useState(180);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  const [codeMessage, setCodeMessage] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const isVerificationButtonDisabled = codeMessage === '인증이 완료되었습니다.' || isCodeVerified;

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
            setDuplicateMessage("해당 이메일이 이미 존재합니다.");
          } else {
            setDuplicateMessage("사용 가능한 이메일입니다.");
          }
        } else {
          console.error("이메일 중복 확인 오류:", isSuccess);
          setDuplicateMessage("이메일 중복 확인에 실패했습니다.");
        }
      } catch (error) {
        console.error("이메일 중복 확인 오류:", error);
        setDuplicateMessage("이메일 중복 확인에 실패했습니다.");
      }
    } else {
      setDuplicateMessage("");
    }
  };


  const handleResendVerification = async () => {
    if (duplicateMessage === "사용 가능한 이메일입니다.") {
      setVerificationClicked(true);
      setTimer(180);
      try {
        const response = await emailSend(email);
        if (response.isSuccess) {
          // console.log('Resend success');
        } else {
          // console.error("Failed to resend email.");
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
      } else {
        // console.log(isCodeVerified);
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
  return (
    <div>
      <div
        className={`flex w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border ${isInputFocused ? "border-[#FB3463]" : "border-gray-300"
          } focus:border-[#FB3463] focus:outline-none`}
        style={{ background: "var(--4, #F5F5F5)" }}
      >
        <input
          type="email"
          id="email"
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={handleEmailChange}
          placeholder="trippy@trippy.or.kr"
          className="flex-1 border-gray-300 focus:border-[#FB3463] focus:outline-none"
          style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
          disabled={isCodeVerified}
        />
        {!isCodeVerified && (
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={
              !emailValid || duplicateMessage !== "사용 가능한 이메일입니다." || isCodeVerified
            }
            className={`${duplicateMessage === "사용 가능한 이메일입니다."
              ? "bg-black text-white hover:bg-gray-900 focus:outline-none focus:bg-gray-900"
              : "bg-gray-400 text-white cursor-not-allowed"
              } w-[8.6rem] h-[3.5rem] my-auto rounded-lg`}
            style={{ fontSize: "1.6rem" }}
          >
            {isCodeVerified ? "인증 완료" : (verificationClicked ? "재전송" : "인증하기")}
          </button>
        )}

      </div>
      <div className="h-[1.7rem]">
        {emailErrorMessage && (
          <p className="text-red-500">{emailErrorMessage}</p>
        )}
        {duplicateMessage && (
          <p className={`text-${duplicateMessage.includes("존재합니다") ? "red" : "green"}-500`}>
            {duplicateMessage}
          </p>
        )}
      </div>
      {verificationClicked && (
        <div>
          <div className="flex">
            <label htmlFor="verificationCode" className="sign-up-info block mt-[6rem]">
              인증 코드
            </label>
            {!isCodeVerified && (
              <div className="text-[1.5rem] mt-auto ml-[1rem] text-red-500">
                {timer > 0 ? `${Math.floor(timer / 60)}:${timer % 60 < 10 ? `0${timer % 60}` : timer % 60}` : "인증 코드가 만료되었습니다."}
              </div>
            )}
          </div>
          <div
            className={`flex w-full px-4 py-2 mt-[2.5rem] mb-2 h-[6rem] rounded-xl border ${isCodeFocused ? "border-[#FB3463]" : "border-gray-300"
              } focus:border-[#FB3463] focus:outline-none`}
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
              style={{ background: "var(--4, #F5F5F5)", fontSize: "1.5rem" }}
              disabled={isCodeVerified}
            />
            <button
              type="button"
              onClick={handleCodeVerification}
              disabled={isVerificationButtonDisabled}
              className={`${isVerificationButtonDisabled
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900 focus:outline-none focus:bg-gray-900"
                } w-[8.6rem] h-[3.5rem] my-auto rounded-lg`}
              style={{ fontSize: "1.6rem" }}
            >
              {codeMessage === '인증이 완료되었습니다.' ? '인증 완료' : '확인하기'}
            </button>
          </div>
          <div className={`text-${codeMessage.includes('완료') ? 'green' : 'red'}-500 mt-2`}>
            {codeMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
