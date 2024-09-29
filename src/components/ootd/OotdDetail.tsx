"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Slider from "react-slick";
import {
  deleteOotdPost,
  fetchOotdPostDetail,
  fetchRecommendedSpots,
} from "@/services/ootd.ts/ootdGet";
import { OotdDetailGetResponse } from "@/types/ootd";
import { useUserStore } from "@/store/useUserStore";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { formatDate } from "@/constants/dateFotmat";
import LocationIcon from "../../../public/Location.svg";
import CommentSection from "./CommentSection";
import LeftArrowIcon from "../../../public/left-arrow.svg";
import RightArrowIcon from "../../../public/right-arrow.svg";
import { useRouter } from "next/navigation";
import FollowButton from "../followControl/followButton";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import CabapIcon from "../../../public/cabap-icon2.svg";
import BookmarkIcon from "../../../public/icon_bookmark.svg";
import BookmarkedIcon from "../../../public/bookmark-fill.svg";
import {
  addBookmark,
  deleteBookmark,
  fetchIsBookmarked,
} from "@/services/bookmark/bookmark";
import WeatherIcon from "../../../public/WeatherIcon.svg";
import DefaultImage from "../../../public/defaultImage.svg";
import { getWeatherStatusInfo } from "@/constants/weatherTransition";
import RecommendedSpots from "./RecommendedSpot";
import RecommendedSpot from "./RecommendedSpot";
import { RecommendedSpotsResponse } from "@/types/recommend";
import SkeletonRecommendOotdPost from "../pages/ootd/SkeletonRecommendOotdPost";
import SkeletonOotdDetailRecommend from "../pages/ootd/SkeletonOotdDetailRecommend";
import { isKoreanLocation } from "@/utils/locationInKorea";
import { extractCityDistrictNeighborhood } from "@/utils/extractCityDistrictNeighborhood";

interface OotdDetailProps {
  id: number;
}

const OotdDetail: React.FC<OotdDetailProps> = ({ id }) => {
  const { data, error, isLoading, refetch } = useQuery<OotdDetailGetResponse>(
    ["ootdPostDetail", id],
    () => fetchOotdPostDetail(id),
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 0,
    }
  );

  console.log("Current post id:", id);

  const {
    data: recommendedSpots,
    isLoading: isSpotsLoading,
    error: spotsError,
  } = useQuery<RecommendedSpotsResponse>(
    ["recommendedSpots", id],
    () => fetchRecommendedSpots(id),
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );
  const [tagSearch, setTagSearch] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    const checkIfBookmarked = async () => {
      const accessToken = Cookies.get('accessToken');
  
      // accessToken이 존재할 때만 실행
      if (accessToken && data?.result?.post?.id) {
        const bookmarked = await fetchIsBookmarked(data.result.post.id);
        setIsBookmarked(bookmarked);
      }
    };
  
    checkIfBookmarked();
  }, [data]); // data가 변경될 때만 실행
  const handleBookmarkClick = async () => {
    if (!data?.result?.post?.id) return;

    try {
      if (isBookmarked) {
        await deleteBookmark(data.result.post.id);
        setIsBookmarked(false);
      } else {
        await addBookmark(data.result.post.id);
        setIsBookmarked(true);
      }
      await refetch();
    } catch (error) {
      console.error("북마크 처리 중 오류가 발생했습니다:", error);
    }
  };

  const accessToken = Cookies.get("accessToken");

  const userInfo = useUserStore((state) => state.userInfo);

  const userMemberId = userInfo?.memberId;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCabapIconClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const router = useRouter();

  const handleTagClick = (tag: string) => {
    setTagSearch(true);
    router.push(`/search/${encodeURIComponent(tag)}`);
  };

  const handleProfileClick = () => {
    if (accessToken) {
      if (ootdItem.member.memberId == userInfo?.memberId) {
        router.push("/mypage");
      } else {
        console.log(ootdItem.member.memberId);
        router.push(`/user/${ootdItem.member.memberId}`);
      }
    } else {
      router.push(`/user/${ootdItem.member.memberId}`);
    }
  };

  const handleDeleteClick = async () => {
    setIsMenuOpen(false);
    if (!data || !data.result) {
      await Swal.fire(
        "오류 발생",
        "게시물 데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.",
        "error"
      );
      return;
    }

    const result = await Swal.fire({
      title: "정말 삭제하시겠습니까?",
      icon: "warning",
      iconColor: "#FB3463",
      showCancelButton: true,
      confirmButtonText: "네",
      cancelButtonText: "아니오",
      confirmButtonColor: "#FB3463",
      customClass: {
        popup: "swal-custom-popup",
        icon: "swal-custom-icon",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteOotdPost(data.result.post.id);
        await Swal.fire({
          icon: "success",
          title: "게시글을 삭제하였습니다.",
          confirmButtonText: "확인",
          confirmButtonColor: "#FB3463",
          customClass: {
            popup: "swal-custom-popup",
            icon: "swal-custom-icon",
          },
        });
        router.push("/ootd");
      } catch (error) {
        await Swal.fire(
          "오류 발생",
          "삭제하는 중 문제가 발생했습니다. 다시 시도해주세요.",
          "error"
        );
      }
    }
  };

  const handleLocationClick = (location: string) => {
    if (!location) return;

    if (isKoreanLocation(location)) {
      // 카카오맵으로 이동 (한국 주소)
      const encodedLocation = encodeURIComponent(location);
      const kakaoMapUrl = `https://map.kakao.com/link/search/${encodedLocation}`;
      window.open(kakaoMapUrl, "_blank");
    } else {
      // 구글맵으로 이동 (해외 주소)
      const encodedLocation = encodeURIComponent(location);
      const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
      window.open(googleMapUrl, "_blank");
    }
  };

  if (isLoading) {
    return null;
  }

  if (error) {
    return <div></div>;
  }

  if (!data) {
    return <div></div>;
  }

  const ootdItem = data.result;

  const weatherInfo = getWeatherStatusInfo(ootdItem.ootd.weatherStatus);

  const formattedLocation = extractCityDistrictNeighborhood(ootdItem.post.location || "정보 없음");


  const SampleNextArrow = (props: any) => {
    const { className, style, onClick, currentSlide, slideCount } = props;
    return (
      currentSlide !== slideCount - 1 && (
        <div
          className={`${className} custom-arrow`}
          style={{ ...style, display: "block", right: "1px" }}
          onClick={onClick}
        >
          <Image src={RightArrowIcon} alt="Next" width={100} height={100} />
        </div>
      )
    );
  };

  const SamplePrevArrow = (props: any) => {
    const { className, style, onClick, currentSlide } = props;
    return (
      currentSlide !== 0 && (
        <div
          className={`${className} custom-arrow`}
          style={{ ...style, display: "block", left: "-20px", zIndex: 1 }}
          onClick={onClick}
        >
          <Image src={LeftArrowIcon} alt="Previous" width={100} height={100} />
        </div>
      )
    );
  };

  const settings = {
    dots: ootdItem.post.images.length > 1,
    infinite: ootdItem.post.images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: ootdItem.post.images.length > 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      <div className="w-[90%] sm-700:w-[66%] sm-700:max-w-7xl mx-auto">
        <div className="w-full mx-auto">
          <div className="py-12 flex items-center justify-between">
            {/* 왼쪽 사용자 정보 및 location/weather 부분 */}
            <div className="flex items-center flex-shrink min-w-0 mr-auto">
              <div className="relative w-[55px] h-[55px] flex-shrink-0">
                <Image
                  src={ootdItem.member.profileUrl || DefaultImage}
                  alt="사용자 프로필"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full cursor-pointer"
                  onClick={handleProfileClick}
                />
              </div>
              <div className="ml-4 min-w-0">
                <span
                  className="block font-bold text-[16px] ml-[2px] cursor-pointer truncate"
                  onClick={handleProfileClick}
                >
                  {ootdItem.member.nickName}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <Image
                      width={16}
                      height={16}
                      src={LocationIcon}
                      alt="location"
                    />
                  </div>
                  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                    <span
                      className="block text-[#9D9D9D] truncate cursor-pointer"
                      onClick={() =>
                        handleLocationClick(
                          ootdItem.post.location || "정보 없음"
                        )
                      }
                    >
                      {ootdItem.post.location || "정보 없음"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  <Image
                    width={16}
                    height={16}
                    src={weatherInfo.icon}
                    alt="weather"
                  />
                  <span className="block text-[#9D9D9D] truncate">
                    {weatherInfo.label === "정보 없음" ? (
                      "정보 없음"
                    ) : (
                      <>
                        {weatherInfo.label}, {ootdItem.ootd.weatherTemp}°C l{" "}
                        {formatDate(ootdItem.ootd.date)}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* 오른쪽 팔로우 버튼 및 아이콘들 */}
            <div className="flex items-center space-x-2 sm-700:space-x-4">
              <FollowButton
                postMemberId={data.result.member.memberId}
                userMemberId={userMemberId}
              />
              {/* 북마크 및 메뉴 아이콘 */}
              <div className="min-w-[35px] flex items-center">
                <Image
                  src={isBookmarked ? BookmarkedIcon : BookmarkIcon}
                  alt="bookmark"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                  onClick={handleBookmarkClick}
                />
                <div className="text-[#9d9d9d] min-w-[10px] text-center">
                  {data.result.post.bookmarkCount}
                </div>
              </div>

              {userMemberId === data.result.member.memberId && (
                <div className="relative flex-shrink-0 w-[24px]">
                  <Image
                    src={CabapIcon}
                    alt="cabap"
                    width={24}
                    height={24}
                    onClick={handleCabapIconClick}
                    className="cursor-pointer"
                  />
                  {isMenuOpen && (
                    <div className="absolute top-full right-0 mt-4 w-32 bg-white rounded shadow-2xl z-10">
                      <div
                        className="pb-2 pt-3 px-4 text-[#ff4f4f] cursor-pointer text-center"
                        onClick={handleDeleteClick}
                      >
                        삭제
                      </div>
                      <div className="border-t border-gray-300 my-2" />
                      <div
                        className="pb-3 pt-2 px-4 text-neutral-900 dark:text-white  cursor-pointer text-center"
                        onClick={() => router.push(`/edit/${id}`)}
                      >
                        수정
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <Slider {...settings}>
              {ootdItem.post.images.map((image, index) => (
                <div key={index}>
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    <Image
                      src={image.accessUri}
                      alt={`OOTD Image ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover rounded-xl"
                      width={720}
                      height={720}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          <div
            className="py-[50px] text-[#292929] text-xl"
            dangerouslySetInnerHTML={{
              __html: ootdItem.post.body.replace(/\n/g, "<br />"),
            }}
          ></div>
          <div className="flex flex-wrap pt-4 gap-4">
            <div className="flex flex-wrap gap-2 flex-grow">
              {ootdItem.post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="cursor-pointer px-4 py-1 bg-neutral-100 rounded-3xl text-xl justify-center items-center gap-2.5 inline-flex text-[#9d9d9d]"
                  onClick={() => {
                    handleTagClick(tag);
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-end w-full sm:w-auto text-neutral-400 text-base font-normal font-['Pretendard'] my-auto flex-shrink-0 pr-[4px] sm-700:pr-0">
              {formatDate(ootdItem.post.createDateTime)}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mb-[120px]">
        <div className="w-full mx-auto">
          <CommentSection
            postId={id}
            initialLikeCount={ootdItem.post.likeCount}
            initialCommentCount={ootdItem.post.commentCount}
            memberId={ootdItem.member.memberId}
            refetchPostDetail={refetch}
          />
        </div>
        {isSpotsLoading ? (
          <SkeletonOotdDetailRecommend />
        ) : (
          <RecommendedSpot 
          recommendedSpots={recommendedSpots?.result || []}
          location={formattedLocation}
        />
        )}
      </div>
    </>
  );
};

export default OotdDetail;
