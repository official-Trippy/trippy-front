"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/shared/header/Header";
import Keywords from "@/components/search/Keywords";
import PopularSearches from "@/components/search/popularSearches";

import axios from "axios";
import { useRouter } from "next/navigation";
import SortingBar from "@/components/search/sortingBar";
// import PostAllCard from "@/components/search/PostAllCard";

import { useQuery } from "react-query";
import PostAllCard from "@/components/search/postAllCard";

const SearchPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<string>("");
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { keyword } = useParams();
  const [selectedSearchType, setSelectedSearchType] = useState("POST");
  const [selectedSortOrder, setSelectedSortOrder] = useState("newest");

  const PAGE_SIZE = 10;
  const RealKeyword = decodeURIComponent(keyword as string);

  // Fetching Posts
  useEffect(() => {
    fetchPosts(RealKeyword, selectedSearchType);
  }, [keyword, selectedSearchType]);

  // Fetching keywords and popular searches
  useEffect(() => {
    fetchPopularSearches();
  }, []);

  const fetchPosts = async (searchTerm: string, searchType: string) => {
    try {
      const response = await axios.get(`https://trippy-api.store/api/search`, {
        params: {
          searchType: searchType,
          page: 0,
          size: 0,
          keyword: searchTerm,
        },
      });

      console.log("API Response:", response.data.result.postList);
      console.log("API Response2 :", response.data.result.ootdList);
      console.log("API Response3 : ", response.data.result[0].memberId);

      const postsData = response.data.result;
      const postsDataPost = response.data.result.postList;
      const postsDataOotd = response.data.result.ootdList;

      if (
        Array.isArray(postsDataPost) ||
        Array.isArray(postsDataOotd) ||
        Array.isArray(postsData)
      ) {
        if (
          selectedSearchType === "BLOG" ||
          selectedSearchType === "NICKNAME"
        ) {
          const transformedData = postsData.map((item: any) => ({
            memberId: item.memberId,
            nickName: item.nickName,
            profileImgUrl: item.profileImgUrl,
            blogName: item.blogName || "", // 블로그 이름이 없으면 빈 문자열
            blogIntroduction: item.blogIntroduction || "", // 블로그 소개가 없으면 빈 문자열
          }));
          console.log("변환데이터", transformedData);
          setPosts(transformedData);
        } else if (selectedSearchType === "OOTD") {
          setPosts(postsDataOotd);
        } else {
          setPosts(postsDataPost); // 일반 게시물일 경우 기존 로직 유지
        }
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(posts.length);

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
          onSelectSearchType={setSelectedSearchType}
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
