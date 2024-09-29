'use client'

import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { signUp, emailSend, confirmEmail } from "@/services/auth";
import { Login, checkEmailDuplicate } from "@/services/auth";
import LogoMain from "../../../public/LogoMain.svg";
import ServiceInfo from "./ServiceInfo";
import Privacy from "./Privacy";
import Swal from "sweetalert2";
import AirplaneIcon from "../../../public/TrippyAirplane.svg";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [duplicateMessage, setDuplicateMessage] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [verificationClicked, setVerificationClicked] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [timer, setTimer] = useState(180);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isCodeFocused, setIsCodeFocused] = useState(false);
  const [codeMessage, setCodeMessage] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  


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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authToken) {
      console.error("인증 토큰이 없습니다.");
      return;
    }
  
    try {
      await signUp({ memberId: email, email, password }, authToken);
      const response = await Login(email, password);
      const { accessToken, refreshToken } = response.result;
      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);
      Cookies.set("role", "GUEST");
      console.log(accessToken);
      router.push("/blogRegister");
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };
  

  const handleAgreementChange = () => {
    setAgreementChecked(!agreementChecked);
  };

  const handleTimerExpired = () => {
    setVerificationCode("");
    setTimer(180);
    setVerificationClicked(false);
  };

  const handleResendVerification = async () => {
    if (duplicateMessage === "사용 가능한 이메일입니다.") {
      Swal.fire({
        icon: 'success',
        title: '인증 메일이 발송되었습니다.',
        html: `${email}로 인증 메일을 발송했습니다. <br>메일에 첨부된 링크를 클릭하여 인증을 완료해 주세요.`,
        confirmButtonText: '확인',
        confirmButtonColor: '#FB3463', 
        customClass: {
          popup: 'swal-custom-popup',
          icon: 'swal-custom-icon'
        }
      }).then(() => {
        setVerificationClicked(true);
        setTimer(180);
      });
      try {
        const response = await emailSend(email);
        if (response.isSuccess) {
          console.log('Resend success');
          setTimer(180);
        } else {
          console.error("Failed to resend email.");
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
        setAuthToken(response.authToken); 
      } else {
        setCodeMessage('인증에 실패하였습니다. 다시 입력해주세요.');
      }
    } catch (error) {
      console.error("이메일 확인 오류:", error);
    }
  };
  

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timer > 0 && verificationClicked) {
      timerRef.current = window.setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0) {
      handleTimerExpired();
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer, verificationClicked]);

  return (
    <form onSubmit={handleSubmit} className="min-h-[calc(100dvh-60px)] flex flex-col justify-between flex-col-reverse mb-[60px] sm:flex-col sm-700:min-h-[100vh] sm-700:justify-center sm-700:mb-0 items-center w-full">
      <div className="w-[90%] max-w-[400px] mx-auto">
      <Link href="/">
      <Image src={LogoMain} alt="Logo" className="mx-auto mt-[2rem]" width={130} height={40} />
        </Link>
  
      </div>
      <div className="w-[90%] max-w-[400px] mx-auto">
      <label htmlFor="email" className="sign-up-info block mt-[4rem]">
        이메일
      </label>
      {/* <EmailVerification /> */}
      <div
        className={`flex w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border ${isInputFocused ? "border-[#FB3463]" : "border-gray-300"
          } focus:border-[#FB3463] focus:outline-none`}
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
              ? "bg-white text-[#fa3463] font-bold focus:outline-none"
              : "bg-[#cfcfcf] text-white cursor-not-allowed"
              } w-[8.6rem] h-[2.8rem] my-auto rounded-lg`}
            style={{ fontSize: "1.2rem" }}
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
            <label htmlFor="verificationCode" className="sign-up-info block mt-[3rem]">
              인증 코드
            </label>
            {!isCodeVerified && (
              <div className="mt-auto ml-[1rem] text-red-500">
                {timer > 0 ? `${Math.floor(timer / 60)}:${timer % 60 < 10 ? `0${timer % 60}` : timer % 60}` : "인증 코드가 만료되었습니다."}
              </div>
            )}
          </div>
          <div
            className={`flex w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border ${isCodeFocused ? "border-[#FB3463]" : "border-gray-300"
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
              style={{ background: "var(--4, #F5F5F5)", fontSize: "1.2rem" }}
              disabled={isCodeVerified}
            />
            <button
              type="button"
              onClick={handleCodeVerification}
              disabled={isVerificationButtonDisabled}
              className={`${isVerificationButtonDisabled
                ? "bg-[#cfcfcf] text-white cursor-not-allowed"
                : "bg-white text-[#fa3463] font-bold focus:outline-none"
                } w-[8.6rem] h-[2.8rem] my-auto rounded-lg`}
              style={{ fontSize: "1.2rem" }}
            >
              {codeMessage === '인증이 완료되었습니다.' ? '인증 완료' : '확인하기'}
            </button>
          </div>
          <div className={`text-${codeMessage.includes('완료') ? 'green' : 'red'}-500 mt-2`}>
            {codeMessage}
          </div>
        </div> 
      )}
      <div className="mt-[3rem]">
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
          style={{ background: "var(--4, #F5F5F5)", fontSize: "1.2rem" }}
        />
        <div className="h-[1.7rem]">
          {passwordErrorMessage && (
            <p className="text-red-500">{passwordErrorMessage}</p>
          )}
          {passwordValid && (
            <p className="text-green-500">사용 가능한 비밀번호입니다.</p>
          )}
        </div>
      </div>
      <div className="mt-[3rem]">
        <label htmlFor="confirmPassword" className="sign-up-info block">
          비밀번호 확인
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="영어, 숫자, 특수 기호를 포함한 8~14자리"
          className="w-full px-4 py-2  mt-[2rem] mb-2 h-[4rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
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
      <div
        className="mt-[3rem] flex items-center"
        style={{ fontSize: "1.2rem" }}
      >
        <input
          type="checkbox"
          id="agreement"
          checked={agreementChecked}
          onChange={handleAgreementChange}
          className="mr-2"
        />
        <label className="text-neutral-900 dark:text-white ">
          <span
            onClick={(event) => {
              event.stopPropagation();
              setServiceModalOpen(true);
            }}
            style={{
              color: "gray",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            서비스 이용약관
          </span>
          과{" "}
          <span
            onClick={(event) => {
              event.stopPropagation();
              setPrivacyModalOpen(true);
            }}
            style={{
              color: "gray",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            개인정보 처리 방침
          </span>
          에 동의합니다.
        </label>
      </div>
      </div>
      
      <div className="w-[90%] max-w-[400px] mx-auto mt-auto sm-700:mt-0">
      <div className="text-center">
              <button
                type="submit"
                className={`mx-auto w-full sm-700:w-[120px] h-[44px] mt-[2rem] mb-[2rem] text-white py-2 rounded-xl flex justify-center items-center mt-[4rem] mb-[2rem] ${!verificationClicked ||
                  !passwordValid ||
                  !passwordMatch ||
                  !agreementChecked ||
                  !isCodeVerified
                  ? "cursor-not-allowed bg-[#cfcfcf] hover:bg-[#cfcfcf]"
                  : "bg-btn-color"
                  }`}
                style={{ fontSize: "1.2rem" }}
                disabled={
                  !isCodeVerified ||
                  !passwordValid ||
                  !passwordMatch ||
                  !agreementChecked ||
                  !verificationClicked}
              >
                다음
              </button>
            </div>
            </div>
            {modalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <p>이메일을 보냈습니다. 확인해주세요.</p>
                  <button onClick={() => setModalOpen(false)}>확인</button>
                </div>
              </div>
            )}

      {serviceModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setServiceModalOpen(false)}
        >
          <div
            className="bg-white w-full h-full overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <ServiceInfo />
            <div className="w-full flex justify-center mb-[80px]">
              <button
                className="w-[8.6rem] h-[3.5rem] my-auto rounded-lg bg-black text-white hover:bg-gray-900 focus:outline-none focus:bg-gray-900"
                onClick={(event) => {
                  event.stopPropagation();
                  setServiceModalOpen(false);
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {privacyModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setPrivacyModalOpen(false)}
        >
          <div
            className="bg-white w-full h-full overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <Privacy />
            <div className="w-full flex justify-center mb-[80px]">
              <button
                className="w-[8.6rem] h-[3.5rem] my-auto rounded-lg bg-black text-white hover:bg-gray-900 focus:outline-none focus:bg-gray-900"
                onClick={(event) => {
                  event.stopPropagation();
                  setPrivacyModalOpen(false);
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default SignUpForm;