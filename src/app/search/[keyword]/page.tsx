"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/shared/header/Header";
import PostList from "@/components/search/postList";
import Keywords from "@/components/search/Keywords";
import PopularSearches from "@/components/search/popularSearches";
import axios from "axios";
import { useRouter } from "next/navigation";
import SortingBar from "@/components/search/\bsortingBar";
import PostAllCard from "@/components/search/\bpostAllCard";

const SearchPage = () => {
  const [targetPost, setTargetPost] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [ootd, setOotds] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { keyword } = useParams();
  const [selectedPostType, setSelectedPostType] = useState("POST");
  const [selectedSortOrder, setSelectedSortOrder] = useState("newest");

  const RealKeyword = decodeURIComponent(keyword as string);
  console.log(RealKeyword);

  useEffect(() => {
    fetchPosts(RealKeyword, selectedPostType);
  }, [keyword, selectedPostType]);

  useEffect(() => {
    if (keyword) {
      const decodedKeyword = decodeURIComponent(keyword as string);
      setKeywords(decodedKeyword);
    }
  }, [keyword]);

  useEffect(() => {
    fetchKeywords();
    fetchPopularSearches();
  }, []);

  const fetchPosts = async (searchTerm: string, postType: string) => {
    try {
      const response = await axios.get(`https://trippy-api.store/api/search`, {
        params: {
          searchType: "TITLE_OR_BODY",
          page: 0,
          size: 10,
          keyword: searchTerm,
          postType: postType,
        },
      });
      console.log(searchTerm);

      console.log("API Response:", response.data);

      const postsData = response.data.result;
      console.log(postsData);
      console.log(postsData.length);

      if (Array.isArray(postsData)) {
        setPosts(postsData);
      } else {
        console.error("Posts data is not an array:", postsData);
        setPosts([]);
      }
      console.log(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchKeywords = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/search/");
      setKeywords(response.data);
    } catch (error) {
      console.error("Error fetching keywords:", error);
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

  console.log("target post", posts);
  console.log(targetPost);

  console.log(posts.length);
  const count = posts.length;

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />
      <div className="w-[80%] mx-auto mt-8 px-10">
        <h1 className="text-4xl font-semibold mb-6">
          <span className="text-[#FB3463]">{RealKeyword}</span>에 대한
          <span className="text-[#FB3463]"> {count}</span>건의 검색 결과입니다.
        </h1>

        <SortingBar
          selectedPostType={selectedPostType}
          onSelectPostType={setSelectedPostType}
          selectedSortOrder={selectedSortOrder}
          onSelectSortOrder={setSelectedSortOrder}
        />
        <div className="flex">
          <div className="flex-grow w-full">
            {isLoading ? (
              <p>Loading...</p>
            ) : posts.length > 0 ? ( // Check if there are posts to display
              <div className="flex flex-wrap justify-start items-start gap-[25.012px]">
                <PostAllCard posts={posts} />
                <div className="flexflex mt-8">
                  <div className="flex-none w-[300px] ml-8">
                    <Keywords />
                  </div>
                  <PopularSearches popularSearches={popularSearches} />
                </div>
              </div>
            ) : (
              <div className="flex-grow max-w-[790px]">
                <h1 className="text-2xl font-semibold mb-6 mt-0">
                  <span className="text-[#FB3463]">{RealKeyword}</span>에 대한
                  검색 결과가 없습니다
                </h1>
                <div className="w-full pl-[650px] mt-8">
                  <div className="flex-none w-[300px] ml-8">
                    <Keywords />
                  </div>
                  <PopularSearches popularSearches={popularSearches} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
