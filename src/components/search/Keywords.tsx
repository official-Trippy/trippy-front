import React from "react";

const Keywords: React.FC = () => {
  // Sample data for testing
  const sampleKeywords = [
    "키워드 1",
    "키워드 2",
    "키워드 3",
    "키워드 4",
    "키워드 5",
    "키워드 6",
    "키워드 7",
    "키워드 8",
    "키워드 9",
  ];

  return (
    <div className="p-3">
      <h2 className="text-[2rem] font-semibold mb-4">추천 키워드</h2>
      <div className="flex flex-wrap gap-5">
        {sampleKeywords.map((keyword, index) => (
          <span
            key={index}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-m"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Keywords;
