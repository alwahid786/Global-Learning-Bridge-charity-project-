import React, { useState } from "react";
import { FaSearch, FaFilter, FaPlus } from "react-icons/fa";

export default function BlogHeader({
  isLoggedIn,
  onSearch,
  onFilterChange,
  onCreatePost,
  onCategorySelect,
}) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { key: "all", label: "All" },
    { key: "education", label: "Education" },
    { key: "health", label: "Health" },
    { key: "environment", label: "Environment" },
    { key: "community", label: "Community" },
    { key: "humanity", label: "Humanity" },
  ];

  const handleCategoryClick = (key) => {
    setActiveCategory(key);
    onCategorySelect?.(key);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* === Top Header Row === */}
      <div
        className="w-full backdrop-blur-md bg-white/60 dark:bg-gray-900/40 border border-white/30 dark:border-gray-700/30 
        shadow-lg rounded-2xl p-4 flex flex-wrap justify-between items-center gap-3 transition-all duration-300"
      >
        {/* Search Bar */}
        <div
          className="flex items-center bg-white/70 dark:bg-gray-800/70 border border-gray-200/40 dark:border-gray-700/40 
        rounded-xl px-3 py-2 w-full sm:w-[40%] focus-within:shadow-md transition-all duration-300"
        >
          <FaSearch className="text-gray-500 dark:text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search inspiring stories..."
            onChange={(e) => onSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Filters + Create Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <select
              onChange={(e) => onFilterChange(e.target.value)}
              className="appearance-none border border-gray-300/40 dark:border-gray-600/40 
              bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 text-sm rounded-xl px-4 py-2 pr-8 
              focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all duration-300"
            >
              <option value="">All Filters</option>
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="featured">Featured</option>
            </select>
            <FaFilter className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 text-xs" />
          </div>

          {isLoggedIn && (
            <button
              onClick={onCreatePost}
              className="flex items-center gap-2 bg-blue-600/90 hover:bg-blue-700/90 dark:bg-blue-500/80 
              dark:hover:bg-blue-600/80 text-white px-4 py-2 rounded-xl transition-all duration-300 
              text-sm font-medium shadow-sm hover:shadow-md"
            >
              <FaPlus className="text-white text-sm" />
              <span>Create Post</span>
            </button>
          )}
        </div>
      </div>

      {/* === Category Tab Bar === */}
      <div
        className="w-full flex overflow-x-auto no-scrollbar justify-start sm:justify-center gap-3 
        bg-white/70 dark:bg-gray-900/50 rounded-2xl border border-white/30 dark:border-gray-700/30 
        shadow-md py-2 px-3 backdrop-blur-md transition-all duration-300"
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryClick(cat.key)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 whitespace-nowrap
              ${
                activeCategory === cat.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-blue-100/60 dark:hover:bg-gray-700/60"
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
