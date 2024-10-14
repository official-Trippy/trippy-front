"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import BlogStep1 from "../../../public/BlogStep1.svg";
import DefaultProfileImg from "../../../public/DefaultProfile.svg";
import {
  checkNickNameDuplicate,
  checkBlogNameDuplicate,
  signupCommon,
  uploadImage,
} from "@/services/blog";
import useUserInfo from "@/hooks/useUserInfo";
import { swear_words_arr } from "@/constants/wearWordsArr";
import { getByteLength } from "@/constants/getByteLength";
import Cookies from "js-cookie";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/utils/getCroppedImg";
import { debounce } from "lodash";
import axios from "axios";
import { getMyInfo } from "@/services/auth";

const BlogRegisterFirst = () => {
  const [profileImage, setProfileImage] = useState<{
    accessUri: string;
    authenticateId: string;
    imgUrl: string;
  } | null>(null);

  const [nickName, setNickName] = useState<string>("");
  const [nickNameError, setNickNameError] = useState<string>("");
  const [blogName, setBlogName] = useState<string>("");
  const [blogNameError, setBlogNameError] = useState<string>("");
  const [blogIntroduce, setBlogIntroduce] = useState<string>("");
  const [blogIntroduceError, setBlogIntroduceError] = useState<string>("");
  const [imageUploaded, setImageUploaded] = useState(false);

  const { setUserInfo } = useUserInfo();
  const router = useRouter();

  const [isFormValid, setIsFormValid] = useState(false); // 폼 유효성 상태 추가

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getMyInfo();

        if (userInfo) {
          // profileImageUrl이 null이 아니면 바로 blogRegister2로 이동
          if (userInfo.profileImageUrl && userInfo.profileImageUrl !== "null") {
            setProfileImage({
              accessUri: userInfo.profileImageUrl,
              authenticateId: userInfo.idx.toString(),
              imgUrl: userInfo.profileImageUrl,
            });
            setImageUploaded(true);
            setNickName(userInfo.nickName || "");
            setBlogName(userInfo.blogName || "");
            setBlogIntroduce(userInfo.blogIntroduce || "");

            // 모든 유효성 조건이 충족되었으면 바로 blogRegister2로 이동
            if (
              userInfo.nickName &&
              userInfo.blogName &&
              userInfo.profileImageUrl
            ) {
              const data = {
                profileImage: {
                  accessUri: userInfo.profileImageUrl,
                  authenticateId: userInfo.idx.toString(),
                  imgUrl: userInfo.profileImageUrl,
                },
                nickName: userInfo.nickName,
                blogName: userInfo.blogName,
                blogIntroduce: userInfo.blogIntroduce,
              };
              setUserInfo(data); // 유저 정보를 상태에 저장
              router.push("/blogRegister2"); // blogRegister2로 이동
              return; // 페이지 이동 후 나머지 로직은 실행되지 않도록 반환
            }
          } else {
            // profileImageUrl이 없을 경우 정보를 입력받도록 상태 설정
            setImageUploaded(false); // 프로필 이미지가 없으면 비활성화 상태로 설정
            setNickName("");
            setBlogName("");
            setBlogIntroduce("");
          }

          // 유효성 조건이 모두 충족되면 버튼 활성화
          if (
            userInfo.nickName &&
            userInfo.blogName &&
            userInfo.profileImageUrl &&
            userInfo.profileImageUrl !== "null"
          ) {
            setIsFormValid(true);
          } else {
            setIsFormValid(false);
          }
        } else {
          // 데이터가 없을 경우 기본 로직을 유지하여 유저가 입력하도록 설정
          setIsFormValid(false);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    // 페이지 진입 시 사용자 정보 API 호출
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const handleBackNavigation = async (e: PopStateEvent) => {
      const socialTypes = ["kakao", "google", "naver"]; // 처리할 소셜 로그인 타입들
      const accessToken = Cookies.get("accessToken");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      if (!accessToken) {
        // 쿠키에 accessToken이 없으면 리다이렉트 처리
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("role");
        router.push("/ootd");
        return;
      }

      try {
        // 각각의 소셜 타입에 대한 API 호출
        for (const socialType of socialTypes) {
          try {
            const res = await axios.get(
              `${backendUrl}/api/member/login/oauth2/${socialType}`
            );
            // console.log(`${socialType} API 호출 성공:`, res.data);
            break; // 성공 시 다른 타입에 대해 호출하지 않음
          } catch (error: any) {
            // 401 Unauthorized 처리
            if (error.response && error.response.status === 401) {
              // console.log(
              // `${socialType} 401 에러 발생, 쿠키 삭제 및 홈으로 이동`
              // );
              Cookies.remove("accessToken");
              Cookies.remove("refreshToken");
              Cookies.remove("role");
              router.push("/ootd");
              break;
            }
          }
        }
      } catch (error) {
        // console.error("Error in handleBackNavigation:", error);
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 창을 닫거나 새로고침할 때 쿠키 제거
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("role");

      // 사용자에게 경고 메시지를 띄울 수 있음 (일부 브라우저에서만 작동)
      const message = "이 페이지를 떠나시겠습니까?";
      e.returnValue = message; // 브라우저에서 사용자에게 확인 대화 상자를 표시
      return message;
    };

    if (typeof window !== "undefined") {
      window.addEventListener("popstate", handleBackNavigation); // 뒤로 가기 이벤트 리스너 추가
      window.addEventListener("beforeunload", handleBeforeUnload); // 창 닫기 이벤트 리스너 추가
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("popstate", handleBackNavigation); // 이벤트 리스너 제거
        window.removeEventListener("beforeunload", handleBeforeUnload); // 창 닫기 이벤트 리스너 제거
      }
    };
  }, [router]);

  // Debounced functions for checking nickname and blog name
  const debouncedNickNameCheck = useRef(
    debounce(async (value: string) => {
      if (!validateNickName(value)) return;
      await handleNickNameBlur(value);
    }, 1000)
  ).current;

  const debouncedBlogNameCheck = useRef(
    debounce(async (value: string) => {
      if (!validateBlogName(value)) return;
      await handleBlogNameBlur(value);
    }, 1000)
  ).current;

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const accessToken = Cookies.get("accessToken");
    const role = Cookies.get("role");

    if (accessToken && role === "GUEST") {
      // console.log("게스트네요");
      return;
    }

    if (role === "MEMBER" || role === "ADMIN") {
      router.push("/ootd");
      return;
    }
  };

  const checkSwearWords = (value: string) => {
    const lowerValue = value.toLowerCase();
    return swear_words_arr.some((swearWord: string) =>
      lowerValue.includes(swearWord)
    );
  };

  const [isNickNameTouched, setIsNickNameTouched] = useState(false); // 닉네임 수정 여부
  const [isBlogNameTouched, setIsBlogNameTouched] = useState(false); // 블로그 이름 수정 여부

  // 닉네임 입력 핸들러
  const handleNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const byteLength = getByteLength(value);
    if (byteLength > 16) return;

    setNickName(value);
    setIsNickNameTouched(true); // 닉네임 필드가 수정되었음을 추적

    // 욕설 체크
    if (checkSwearWords(value)) {
      setNickNameError("욕설이 포함되었습니다. 다시 입력해주세요.");
      setIsFormValid(false); // 유효성 체크 실패
      return;
    }

    // 닉네임 형식 체크
    if (!validateNickName(value)) {
      setNickNameError("형식이 올바르지 않습니다. 다시 입력해 주세요.");
      debouncedNickNameCheck.cancel();
      setIsFormValid(false); // 유효성 체크 실패
      return; // 형식이 맞지 않으면 중복 체크 중단
    }

    // 형식이 맞는 경우 중복 체크 실행
    setNickNameError(""); // 형식이 맞으면 에러 초기화
    debouncedNickNameCheck(value); // 2초 후 중복 체크 실행
  };

  // 블로그 이름 입력 핸들러
  const handleBlogName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const byteLength = getByteLength(value);
    if (byteLength > 30) return;

    setBlogName(value);
    setIsBlogNameTouched(true); // 블로그 이름 필드가 수정되었음을 추적

    // 욕설 체크
    if (checkSwearWords(value)) {
      setBlogNameError("욕설이 포함되었습니다. 다시 입력해주세요.");
      setIsFormValid(false); // 유효성 체크 실패
      return;
    }

    // 블로그 이름 형식 체크
    if (!validateBlogName(value)) {
      setBlogNameError("형식이 올바르지 않습니다. 다시 입력해 주세요.");
      debouncedBlogNameCheck.cancel();
      setIsFormValid(false); // 유효성 체크 실패
      return; // 형식이 맞지 않으면 중복 체크 중단
    }

    // 형식이 맞는 경우 중복 체크 실행
    setBlogNameError(""); // 형식이 맞으면 에러 초기화
    debouncedBlogNameCheck(value); // 2초 후 중복 체크 실행
  };

  const handleNickNameBlur = async (value: string) => {
    try {
      const { duplicated } = await checkNickNameDuplicate(value);
      if (duplicated) {
        setNickNameError("이미 존재하는 닉네임입니다.");
        setIsFormValid(false); // 중복일 경우 유효성 실패
      } else {
        setNickNameError("사용 가능한 닉네임입니다.");
        setIsFormValid(true); // 중복이 아니면 유효성 성공
      }
    } catch (error) {
      console.error("Error checking nickname duplication:", error);
      setNickNameError(
        "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
      setIsFormValid(false); // 에러 발생 시 유효성 실패
    }
  };

  const validateNickName = (nickName: string) => {
    const regex = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣 ]{2,16}$/; // 한글 자음/모음, 초성 허용 안함 + 공백 허용
    const incompleteKoreanCharRegex = /[ㄱ-ㅎㅏ-ㅣ]/; // 자음, 모음만 입력되었는지 체크
    if (incompleteKoreanCharRegex.test(nickName)) return false; // 자음/모음만 있는 경우 false
    return regex.test(nickName); // 정규식이 일치하면 true 반환
  };

  // 블로그 이름 중복 체크 함수
  const handleBlogNameBlur = async (value: string) => {
    try {
      const { duplicated } = await checkBlogNameDuplicate(value);
      if (duplicated) {
        setBlogNameError("중복된 블로그 이름입니다.");
        setIsFormValid(false); // 중복일 경우 유효성 실패
      } else {
        setBlogNameError("사용 가능한 블로그 이름입니다.");
        setIsFormValid(true); // 중복이 아니면 유효성 성공
      }
    } catch (error) {
      console.error("Error checking blog name duplication:", error);
      setBlogNameError(
        "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
      setIsFormValid(false); // 에러 발생 시 유효성 실패
    }
  };

  const validateBlogName = (blogName: string) => {
    const regex = /^[가-힣a-zA-Z0-9 ]{2,28}$/; // 한글, 영문, 숫자, 공백만 허용
    const incompleteKoreanCharRegex = /[ㄱ-ㅎㅏ-ㅣ]/; // 자음, 모음만 입력되었는지 체크
    if (incompleteKoreanCharRegex.test(blogName)) return false; // 자음/모음만 있는 경우 false
    return regex.test(blogName); // 정규 표현식이 일치하면 true 반환
  };

  const handleBlogIntroduce = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 20글자 초과 시 입력 차단
    if (value.length > 20) return;
    setBlogIntroduce(value);

    // 욕설 체크
    if (checkSwearWords(value)) {
      setBlogIntroduceError("욕설이 포함되었습니다. 다시 입력해주세요.");
      setIsFormValid(false);
      return;
    }

    setBlogIntroduceError(""); // 에러 없을 시 초기화
  };

  // 이미지 업로드 및 크롭 관련 상태
  const [imageSrc, setImageSrc] = useState<string | null>(null); // 크롭할 이미지 소스
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // 크롭 모달 상태
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null); // 크롭한 영역

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string); // 이미지 소스를 설정하여 크롭 모달을 띄움
        setIsImageModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels); // 크롭된 이미지 가져오기

      if (croppedBlob) {
        const fileName = "croppedImage.jpg";
        const croppedFile = new File([croppedBlob], fileName, {
          type: "image/jpeg",
        });

        // 크롭된 이미지 업로드
        const response = await uploadImage(croppedFile);
        const profileImageObj = response.result;

        setProfileImage(profileImageObj); // 업로드된 이미지를 상태에 설정
        setImageUploaded(true); // 이미지 업로드 상태 설정

        // 이미지를 업로드한 후 유효성 검사 업데이트
        if (
          nickNameError.includes("사용 가능") &&
          blogNameError.includes("사용 가능")
        ) {
          setIsFormValid(true); // 모든 유효성 조건이 맞으면 폼 활성화
        }

        setIsImageModalOpen(false); // 모달 닫기
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleImageDelete = () => {
    setProfileImage(null);
    setImageUploaded(false);

    // 이미지가 삭제되면 유효성 검사를 실패한 상태로 설정
    setIsFormValid(false);
  };

  const handleSubmit = async () => {
    // 기본 유효성 검사: 에러가 있거나 이미지가 업로드되지 않은 경우, 폼이 유효하지 않은 경우 제출을 막음
    if (
      (!nickNameError.includes("사용 가능") ||
        !blogNameError.includes("사용 가능") ||
        !imageUploaded ||
        profileImage === null) &&
      !isFormValid
    ) {
      return;
    }

    try {
      const data = {
        profileImage: profileImage,
        nickName: nickName,
        blogName: blogName,
        blogIntroduce: blogIntroduce,
      };

      setUserInfo(data); // 유저 정보를 상태에 저장

      const response = await signupCommon(data); // 서버에 제출
      // console.log("Signup success:", response);

      router.push("/blogRegister2"); // 성공 시 다음 페이지로 이동
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-60px)] flex flex-col justify-between flex-col-reverse mb-[60px] sm:flex-col sm-700:min-h-[100vh] sm-700:justify-center sm-700:mb-0 items-center w-full">
      <div className="w-[90%] max-w-[400px] mx-auto">
        <div className="w-full flex justify-center mt-[20px]">
          <Image src={BlogStep1} alt="Logo" className="w-[30rem]" />
        </div>
      </div>
      <div className="w-[90%] max-w-[400px] mx-auto">
        <div className="mt-[20px]">
          <div className="sign-up-info">기본 회원 정보를 등록해주세요</div>
          <div className="mt-[2rem]">
            <div className="sign-up-info">프로필 사진</div>
            <div className="mt-[2rem] flex items-center relative">
              <div className="rounded-full overflow-hidden w-[100px] h-[100px]">
                {profileImage ? (
                  <Image
                    src={profileImage.accessUri}
                    alt="Profile"
                    className="object-cover w-full h-full"
                    width={100}
                    height={100}
                    unoptimized={true}
                  />
                ) : (
                  <Image
                    src={DefaultProfileImg}
                    alt="Default Profile"
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="ml-8 flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="max-w-[200px] px-8 py-4 custom-label text-center"
                >
                  프로필 사진 업로드
                </label>
                {profileImage && (
                  <button
                    onClick={handleImageDelete}
                    className="absolute mt-2 text-[1rem] text-gray-500 hover:text-gray-900"
                    style={{ top: "76px", left: "165px" }}
                  >
                    이미지 삭제
                  </button>
                )}
              </div>
            </div>
            <div className="flex-col">
              <div className="mt-[2rem]">
                <label htmlFor="nickName" className="sign-up-info block">
                  닉네임
                </label>
                <input
                  type="text"
                  value={nickName}
                  onChange={handleNickName}
                  placeholder="한글 2-8자, 영어 4-16자 이내로 입력 가능합니다."
                  className="w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{
                    background: "var(--4, #F5F5F5)",
                    fontSize: "1.2rem",
                  }}
                />
                <div className="h-[1.7rem]">
                  {nickNameError && (
                    <p
                      className={`text-${nickNameError.includes("사용 가능") ? "green" : "red"
                        }-500`}
                    >
                      {nickNameError}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-[2rem]">
                <label htmlFor="blogName" className="sign-up-info block">
                  블로그 이름
                </label>
                <input
                  type="text"
                  value={blogName}
                  onChange={handleBlogName}
                  placeholder="한글 2-14자, 영어 4-28자 이내로 입력 가능합니다."
                  className="w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{
                    background: "var(--4, #F5F5F5)",
                    fontSize: "1.2rem",
                  }}
                />
                <div className="h-[1.7rem]">
                  {blogNameError && (
                    <p
                      className={`text-${blogNameError.includes("사용 가능") ? "green" : "red"
                        }-500`}
                    >
                      {blogNameError}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-[2rem]">
                <label htmlFor="blogIntroduce" className="sign-up-info block">
                  한 줄 소개(선택)
                </label>
                <input
                  type="text"
                  value={blogIntroduce}
                  onChange={handleBlogIntroduce}
                  placeholder="20글자 이내로 소개글을 작성해보세요."
                  className="w-full px-4 py-2 mt-[2rem] mb-2 h-[4rem] rounded-xl border border-gray-300 focus:border-[#FB3463] focus:outline-none"
                  style={{
                    background: "var(--4, #F5F5F5)",
                    fontSize: "1.2rem",
                  }}
                />
                <div className="h-[1.7rem]">
                  {blogIntroduceError && (
                    <p className="text-red-500">{blogIntroduceError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[90%] max-w-[400px] mx-auto mt-auto sm-700:mt-0">
        <div className="text-center">
          <button
            type="submit"
            className={`mx-auto w-full sm-700:w-[120px] h-[44px] mt-[2rem] mb-[2rem] text-white py-2 rounded-xl flex justify-center items-center ${!nickNameError.includes("사용 가능") ||
              !blogNameError.includes("사용 가능") ||
              !imageUploaded
              ? "cursor-not-allowed bg-[#cfcfcf] hover:bg-[#cfcfcf]"
              : "bg-btn-color"
              }`}
            onClick={handleSubmit}
            style={{ fontSize: "1.2rem" }}
            disabled={
              !nickNameError.includes("사용 가능") ||
              !blogNameError.includes("사용 가능") ||
              !imageUploaded
            }
          >
            다음
          </button>
        </div>
      </div>
      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white py-4 px-8 rounded-lg shadow-lg">
            <h3 className="mb-4 text-center">이미지 영역 선택</h3>
            <div className="relative w-[300px] h-[300px] bg-gray-200">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1} // 1:1 비율로 설정
                  onCropChange={setCrop}
                  onCropComplete={(croppedArea, croppedAreaPixels) =>
                    setCroppedAreaPixels(croppedAreaPixels)
                  }
                  onZoomChange={setZoom}
                  objectFit="cover" // 이미지 여백을 없애고 화면에 맞춤
                />
              )}
            </div>
            <div className="flex justify-end mt-4">
              <div
                className="bg-btn-color text-white px-4 py-2 font-medium font-['Pretendard'] rounded mr-2 cursor-pointer"
                onClick={handleCropImage}
              >
                완료
              </div>
              <div
                className="border border-[#cfcfcf] text-[#cfcfcf] px-4 py-2 font-medium font-['Pretendard'] rounded cursor-pointer"
                onClick={() => setIsImageModalOpen(false)}
              >
                취소
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogRegisterFirst;
