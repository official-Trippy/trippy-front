import React from "react";

interface PopularSearchesProps {
  popularSearches: string[];
}

const PopularSearches: React.FC<PopularSearchesProps> = ({
  popularSearches,
}) => {
  return (
    <div className="ml-auto flex flex-col">
      <h2 className="text-3xl font-semibold mb-4">인기 검색어</h2>
      <ul className="">
        {popularSearches.map((term, index) => (
          <li
            key={index}
            className="mb-2"
            style={{
              color: "#9D9D9D",
              fontFamily: "Pretendard, sans-serif",
              fontSize: "20px",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            <span
              style={{
                color: "#FB3463",
                marginRight: "8px",
              }}
            >
              {index + 1}.
            </span>
            {term}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularSearches;
