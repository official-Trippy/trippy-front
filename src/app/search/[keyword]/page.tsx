"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/shared/header/Header";
import PopularSearches from "@/components/search/popularSearches";
import axios from "axios";
import SortingBar from "@/components/search/sortingBar";
import PostAllCard from "@/components/search/postAllCard";
import MobilePopularSearch from "@/components/search/mobilePopularSearch";

const SearchPage = () => {
  const [posts, setPosts] = useState<any[]>([]); // 보여줄 포스트
  const [postList, setPostList] = useState<any[]>([]); // POST 타입 데이터
  const [ootdList, setOotdList] = useState<any[]>([]); // OOTD 타입 데이터
  const [nicknameList, setNicknameList] = useState<any[]>([]); // NICKNAME 타입 데이터
  const [blogList, setBlogList] = useState<any[]>([]); // BLOG 타입 데이터

  const [keywords, setKeywords] = useState<string>("");
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { keyword } = useParams();
  const [selectedSearchType, setSelectedSearchType] = useState("POST");
  const [selectedSortOrder, setSelectedSortOrder] = useState("newest");

  const PAGE_SIZE = 10;
  const RealKeyword = decodeURIComponent(keyword as string);

  const [isMobileView, setIsMobileView] = useState(false);

  // 검색 결과 가져오기 (처음 4개 타입에 대해 요청)
  useEffect(() => {
    fetchAllPosts(RealKeyword);
  }, [keyword]);

  // 인기 검색어 가져오기
  useEffect(() => {
    fetchPopularSearches();
  }, []);

  // 화면 크기 확인
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1500);
    };

    handleResize(); // 초기 로드 시 체크
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 4개의 타입에 대한 데이터 요청
  const fetchAllPosts = async (searchTerm: string) => {
    try {
      setIsLoading(true);

      // 4개의 타입에 대한 API 요청을 동시에 보냄
      const [postRes, ootdRes, nicknameRes, blogRes] = await Promise.all([
        axios.get(`https://trippy-api.store/api/search`, {
          params: {
            searchType: "POST",
            page: 0,
            size: PAGE_SIZE,
            keyword: searchTerm,
          },
        }),
        axios.get(`https://trippy-api.store/api/search`, {
          params: {
            searchType: "OOTD",
            page: 0,
            size: PAGE_SIZE,
            keyword: searchTerm,
          },
        }),
        axios.get(`https://trippy-api.store/api/search`, {
          params: {
            searchType: "NICKNAME",
            page: 0,
            size: PAGE_SIZE,
            keyword: searchTerm,
          },
        }),
        axios.get(`https://trippy-api.store/api/search`, {
          params: {
            searchType: "BLOG",
            page: 0,
            size: PAGE_SIZE,
            keyword: searchTerm,
          },
        }),
      ]);

      // 각 타입의 데이터 추출
      const postListData = postRes.data.result?.postList || [];
      const ootdListData = ootdRes.data.result?.ootdList || [];
      const nicknameListData = Array.isArray(nicknameRes.data.result)
        ? nicknameRes.data.result
        : [];
      const blogListData = Array.isArray(blogRes.data.result)
        ? blogRes.data.result
        : [];

      setPostList(postListData);
      setOotdList(ootdListData);
      setNicknameList(nicknameListData);
      setBlogList(blogListData);

      if (postListData.length > 0) {
        setPosts(postListData);
        setSelectedSearchType("POST");
      } else if (ootdListData.length > 0) {
        setPosts(ootdListData);
        setSelectedSearchType("OOTD");
      } else if (nicknameListData.length > 0) {
        setPosts(nicknameListData);
        setSelectedSearchType("NICKNAME");
      } else if (blogListData.length > 0) {
        setPosts(blogListData);
        setSelectedSearchType("BLOG");
      } else {
        setPosts([]); // 모든 타입에 데이터가 없을 경우 빈 배열 설정
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPopularSearches = async () => {
    try {
      const response = await axios.get(
        "https://trippy-api.store/api/search/popular"
      );
      const fetchedPopularSearches = Array.isArray(response.data.result)
        ? response.data.result.map((item: string) => decodeURIComponent(item))
        : [];
      setPopularSearches(fetchedPopularSearches);
    } catch (error) {
      console.error("Error fetching popular searches:", error);
    }
  };

  const count = posts.length;

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-[100%] lg:w-[90%] mx-auto mt-8 px-4 lg:px-10 max-w-[1250px]">
        <div className="mb-0">
          {isMobileView ? (
            <MobilePopularSearch popularSearches={popularSearches} />
          ) : (
            ""
          )}
        </div>
        {/* 검색 결과 제목 */}
        <div className="flex flex-row justify-between  items-center">
          <h1 className="sm-700:text-[2rem] md-700:text-[3.6rem] text-[1.6rem] lg:text-3xl font-semibold mb-6 sm:min-w-[500px] min-w-[150px]">
            <span className="text-[#FB3463]">{RealKeyword}</span>에 대한{" "}
            <span className="text-[#FB3463]"> {count}</span>건의 검색
            결과입니다.
          </h1>
        </div>

        {/* Sorting Bar */}
        <SortingBar
          selectedSearchType={selectedSearchType}
          onSelectSearchType={(type) => {
            setSelectedSearchType(type);
            if (type === "POST") setPosts(postList);
            else if (type === "OOTD") setPosts(ootdList);
            else if (type === "NICKNAME") setPosts(nicknameList);
            else if (type === "BLOG") setPosts(blogList);
          }}
          selectedSortOrder={selectedSortOrder}
          onSelectSortOrder={setSelectedSortOrder}
        />

        {/* Posts Section */}
        <div className="flex flex-col lg:flex-row mx-auto">
          <div className="flex-grow w-full">
            {isLoading ? (
              <p></p>
            ) : posts.length > 0 ? (
              <div className="flex flex-wrap justify-start items-start gap-[15px] lg:gap-[25px]">
                <PostAllCard
                  posts={posts}
                  selectedSearchType={selectedSearchType}
                />
              </div>
            ) : (
              <div className="flex-grow max-w-full lg:max-w-[790px]">
                <h1 className="text-lg lg:text-2xl font-semibold mb-6">
                  <span className="text-[#FB3463]">{RealKeyword}</span>에 대한
                  검색 결과가 없습니다
                </h1>
              </div>
            )}
          </div>
          {isMobileView ? (
            ""
          ) : (
            <PopularSearches popularSearches={popularSearches} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
