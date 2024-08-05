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
    fetchPosts(RealKeyword, selectedPostType, selectedSortOrder);
  }, [keyword, selectedPostType, selectedSortOrder]);

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

  const fetchPosts = async (
    searchTerm: string,
    postType: string,
    sortOrder: string
  ) => {
    try {
      const response = await axios.get(`https://trippy-api.store/api/search`, {
        params: {
          searchType: "TITLE",
          page: 0,
          size: 10,
          keyword: searchTerm,
          postType: postType,
          //   sort: sortOrder, //최신순,인기순 받을 수 있게 추가 업로드 요청
        },
      });
      setPosts(response.data || []);
      const postsData = response.data.result || [];
      setTargetPost(postsData);
      if (Array.isArray(postsData) && postsData.length > 0) {
        setTargetPost(postsData[0]); // 첫 번째 포스트만 설정
      } else {
        setTargetPost([]); // 결과가 없을 경우 null로 설정
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };
  //   useEffect(() => {
  //     allPosts(10, 0, selectedSortOrder);
  //   }, [keyword, selectedPostType, selectedSortOrder]);

  //   const allPosts = async (size: number, page: number, orderType: string) => {
  //     try {
  //       const response = await axios.get(
  //         `https://trippy-api.store/api/post/all`,
  //         {
  //           params: {
  //             size,
  //             page,
  //             orderType,
  //           },
  //         }
  //       );
  //       setAllPosts(response.data || []);
  //     } catch (error) {
  //       console.error("Error fetching posts:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

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

      // Decode the result array elements
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

  return (
    <div className="w-[65%] mx-auto min-h-screen bg-white">
      <Header />
      <div className="w-full mt-8 ml-[50px]">
        <h1 className="text-4xl font-semibold mb-6">
          <span className="text-[#FB3463]">{RealKeyword}</span>에 대한 검색 결과
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
            ) : targetPost.isSuccess ? (
              <div className="flex">
                <PostAllCard post={targetPost} />
                <div className="flexflex mt-8">
                  <PopularSearches popularSearches={popularSearches} />
                  <div className="flex-none w-[300px] ml-8">
                    {posts.length > 0 && <Keywords keywords={keywords} />}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-grow max-w-[790px]">
                <h1 className="text-2xl font-semibold mb-6 mt-0">
                  <span className="text-[#FB3463]">{RealKeyword}</span>에 대한
                  검색 결과가 없습니다
                </h1>
                <div className="w-full pl-[650px] mt-8">
                  <PopularSearches popularSearches={popularSearches} />
                  <div className="flex-none w-[300px] ml-8">
                    {posts.length > 0 && <Keywords keywords={keywords} />}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-none w-[300px] ml-8">
            {posts.length > 0 && <Keywords keywords={keywords} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
