import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import searchIcon from "../../../public/icon_search2.svg";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/search/${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full flex items-center justify-end px-6">
      <div className="relative flex items-center w-full mx-auto max-w-[600px] min-w-[100px]]">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder=""
          className="w-full min-w-[100px] h-[32px] text-gray-800 border-none rounded-[16px] outline-none focus:ring-2 focus:ring-gray-300 pl-4" // Added padding-left here
          style={{
            backgroundColor: "#F5F5F5",
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
        />
         <Image
            src={searchIcon}
            alt="search"
            width={18}
            height={18}
            onClick={handleSearch}
            className="absolute right-3 text-gray-600 cursor-pointer"
          />
        {/* <FaSearch
          className="absolute right-3 text-gray-600 cursor-pointer"
          style={{
            color: "#6B6B6B",
            fontSize: "14px",
          }}
          onClick={handleSearch}
        /> */}
      </div>
    </div>
  );
};

export default SearchBar;