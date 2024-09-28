"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/shared/header/Header";
import PopularSearches from "@/components/search/popularSearches";
import axios from "axios";
import SortingBar from "@/components/search/sortingBar";
import PostAllCard from "@/components/search/postAllCard";

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

  // 검색 결과 가져오기 (처음 4개 타입에 대해 요청)
  useEffect(() => {
    fetchAllPosts(RealKeyword);
  }, [keyword]);

  // 인기 검색어 가져오기
  useEffect(() => {
    fetchPopularSearches();
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

      // 상태 업데이트
      setPostList(postListData);
      setOotdList(ootdListData);
      setNicknameList(nicknameListData);
      setBlogList(blogListData);

      console.log(ootdListData);
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
      <Header />

      <div className="w-[90%] lg:w-[68%] mx-auto mt-8 px-4 lg:px-10">
        {/* 검색 결과 제목 */}
        <h1 className="text-2xl lg:text-4xl font-semibold mb-6">
          <span className="text-[#FB3463]">{RealKeyword}</span>에 대한{" "}
          <span className="text-[#FB3463]"> {count}</span>건의 검색 결과입니다.
        </h1>

        {/* Sorting Bar */}
        <SortingBar
          selectedSearchType={selectedSearchType}
          onSelectSearchType={(type) => {
            setSelectedSearchType(type);
            // 타입 변경 시 해당 타입의 데이터로 변경
            if (type === "POST") setPosts(postList);
            else if (type === "OOTD") setPosts(ootdList);
            else if (type === "NICKNAME") setPosts(nicknameList);
            else if (type === "BLOG") setPosts(blogList);
          }}
          selectedSortOrder={selectedSortOrder}
          onSelectSortOrder={setSelectedSortOrder}
        />

        <div className="flex flex-col lg:flex-row">
          <div className="flex-grow w-full">
            {/* Posts Section */}
            {isLoading ? (
              <p>Loading...</p>
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

          {/* Sidebar Section */}
          <div className="flex-none w-full lg:w-[300px] mt-8 lg:mt-0 lg:ml-8 hidden md:block">
            <PopularSearches popularSearches={popularSearches} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
