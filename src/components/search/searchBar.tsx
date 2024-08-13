// components/SearchBar.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { FaSearch } from "react-icons/fa";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      // Encode the query properly
      router.push(`/search/${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 mr-15">
      <div className="relative flex items-center w-full max-w-[627px]">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="찾으시는 게시물을 입력하세요"
          className="w-full h-[32px] pl-4 pr-10 text-gray-800 border-none rounded-[16px] outline-none focus:ring-2 focus:ring-gray-300"
          style={{
            backgroundColor: "#F5F5F5",
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <FaSearch
          className="absolute right-3 text-gray-600 cursor-pointer"
          style={{
            color: "#6B6B6B",
          }}
          onClick={handleSearch}
        />
      </div>
    </div>
  );
};

export default SearchBar;
