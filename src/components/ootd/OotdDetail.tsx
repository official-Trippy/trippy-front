"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Slider from "react-slick";
import { deleteOotdPost, fetchOotdPostDetail } from "@/services/ootd.ts/ootdGet";
import { OotdDetailGetResponse } from "@/types/ootd";
import { useUserStore } from "@/store/useUserStore";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { formatDate } from "@/constants/dateFotmat";
import LocationIcon from "../../../public/icon_pin.png";
import CommentSection from "./CommentSection";
import LeftArrowIcon from "../../../public/left-arrow.svg";
import RightArrowIcon from "../../../public/right-arrow.svg";
import { getWeatherStatusInKorean } from "@/constants/weatherTransition";
import { useRouter } from "next/navigation";
import FollowButton from "../followControl/followButton";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import CabapIcon from "../../../public/icon_cabap.svg";
import BookmarkIcon from "../../../public/icon_bookmark.svg";
import BookmarkedIcon from "../../../public/bookmark-fill.svg";
import { addBookmark, fetchIsBookmarked } from "@/services/bookmark/bookmark";

interface OotdDetailProps {
  id: number;
}

const OotdDetail: React.FC<OotdDetailProps> = ({ id }) => {
  const { data, error, isLoading, refetch } = useQuery<OotdDetailGetResponse>(
    ["ootdPostDetail", id],
    () => fetchOotdPostDetail(id)
  );

  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    const checkIfBookmarked = async () => {
      if (data?.result?.post?.id) {
        const bookmarked = await fetchIsBookmarked(data.result.post.id);
        setIsBookmarked(bookmarked);
      }
    };
    checkIfBookmarked();
  }, [data]);

  const handleBookmarkClick = async () => {
    try {
      if (!data?.result?.post?.id) return;
      await addBookmark(data.result.post.id);
      setIsBookmarked(true);
      await refetch();
    } catch (error) {
      console.error('북마크 추가 중 오류가 발생했습니다:', error);
    }
  };
  
  const accessToken = Cookies.get('accessToken');

  const userInfo = useUserStore((state) => state.userInfo);

  const userMemberId = userInfo?.memberId;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCabapIconClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const router = useRouter();

  const handleProfileClick = () => {
    if (accessToken) {
      if (ootdItem.member.memberId == userInfo.memberId) {
        router.push("/mypage");
      } else {
        router.push(`/user/${ootdItem.member.memberId}`);
      }
    } else {
      router.push(`/user/${ootdItem.member.memberId}`);
    }
  };

  const handleDeleteClick = async () => {
    if (!data || !data.result) {
      await Swal.fire(
        '오류 발생',
        '게시물 데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.',
        'error'
      );
      return;
    }
      
    const result = await Swal.fire({
      title: '정말 삭제하시겠습니까?',
      icon: 'warning',
      iconColor: '#FB3463', 
      showCancelButton: true,
      confirmButtonText: '네',
      cancelButtonText: '아니오',
      confirmButtonColor: '#FB3463', 
      customClass: {
        popup: 'swal-custom-popup',
        icon: 'swal-custom-icon'
      }
    });
  
    if (result.isConfirmed) {
      try {
        await deleteOotdPost(data.result.post.id);
        await Swal.fire({
          icon: 'success',
          title: '게시글을 삭제하였습니다.',
          confirmButtonText: '확인',
          confirmButtonColor: '#FB3463', 
          customClass: {
            popup: 'swal-custom-popup',
            icon: 'swal-custom-icon'
          }
        }    
        );
        router.push('/ootd');
      } catch (error) {
        await Swal.fire(
          '오류 발생',
          '삭제하는 중 문제가 발생했습니다. 다시 시도해주세요.',
          'error'
        );
      }
    }
  };

  if (isLoading) {
    return null;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const ootdItem = data.result;


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
    dots: true,
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
      <div className="container mx-auto p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="py-12 flex items-center">
            <div className="flex items-center">
            <div className="relative w-[50px] h-[50px]">
                <Image
                  src={ootdItem.member.profileUrl}
                  alt="사용자 프로필"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full cursor-pointer"
                  onClick={handleProfileClick}
                />
              </div>
              <div className="h-[48px] ml-4">
                <span className="block font-bold text-[20px] ml-[2px]">
                  {ootdItem.member.nickName}
                </span>
                <div className="flex items-center gap-2">
                  <Image
                    width={16}
                    height={16}
                    src={LocationIcon}
                    alt="location"
                  />
                  <span className="block text-gray-600">
                    {ootdItem.post.location} |{" "}
                    {getWeatherStatusInKorean(ootdItem.ootd.weatherStatus)},{" "}
                    {ootdItem.ootd.weatherTemp}°C
                  </span>
                </div>
              </div>
            </div>
            <div className="ml-auto flex">
            <div className="flex items-center space-x-2">
              <FollowButton
                postMemberId={data.result.member.memberId}
                userMemberId={userMemberId}
              />
              <i className="far fa-bookmark text-xl"></i>
              <i className="fas fa-ellipsis-h text-xl"></i>
            </div>
            <div className="flex relative my-auto items-center">
            <Image
              src={isBookmarked ? BookmarkedIcon : BookmarkIcon}
              alt="bookmark"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={handleBookmarkClick}
            />
            <div className="text-[#9d9d9d] ml-[4px]">
              {data.result.post.bookmarkCount}
            </div>
            </div>
            <div className="relative min-w-[50px] my-auto ml-auto flex justify-end">
            {userMemberId === data.result.member.memberId && (
          <div className="relative">
            <Image
              src={CabapIcon}
              alt="cabap"
              width={24}
              height={24}
              onClick={handleCabapIconClick}
              className="cursor-pointer"
            />
            {isMenuOpen && (
              <div className="w-[100px] absolute top-full right-4 mt-4 w-32 bg-white rounded shadow-lg z-10">
                <div
                  className="py-4 px-8 text-[#ff4f4f] hover:bg-gray-100 cursor-pointer text-center"
                  onClick={handleDeleteClick}
                >
                  삭제
                </div>
                <hr/>
                <div
                  className="py-4 px-8 text-black hover:bg-gray-100 cursor-pointer text-center"
                  onClick={() => {
                    router.push(`/edit/${id}`);
                  }}
                >
                  수정
                </div>
              </div>
            )}
          </div>
        )}
        </div>
            </div>
          </div>
          <div className="relative">
          <Slider {...settings}>
            {ootdItem.post.images.map((image, index) => (
              <div key={index}>
                <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
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
          <div className="py-[50px] text-[20px]">{ootdItem.post.body}</div>
          <div className="flex pt-4">
            <div className="flex flex-wrap gap-2">
              {ootdItem.post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-4 py-1 bg-neutral-100 rounded-3xl text-xl justify-center items-center gap-2.5 inline-flex text-[#9d9d9d]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="ml-auto text-neutral-400 text-base font-normal font-['Pretendard'] my-auto">
              {formatDate(ootdItem.post.createDateTime)}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mb-[100px]">
        <div className="w-full mx-auto">
          <CommentSection
            postId={id}
            initialLikeCount={ootdItem.post.likeCount}
            initialCommentCount={ootdItem.post.commentCount}
          />
        </div>
      </div>
    </>
  );
};

export default OotdDetail;
