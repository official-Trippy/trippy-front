import React from "react";
import RecentOotdPost from "@/components/pages/ootd/RecentOotdPost";
import Header from "@/components/shared/header/Header";
import RecommendOotdPost from "@/components/pages/ootd/RecommendOotdPost";

const OotdPage = () => {
  return (
    <div>
      {/* <Header /> */}
      <RecommendOotdPost />
      <RecentOotdPost />
    </div>
  );
};

export default OotdPage;
