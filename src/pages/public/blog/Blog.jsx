import { useState, useEffect, useCallback } from "react";
import BlogHeader from "../../../components/public/blog/BlogHeader";
import BlogList from "../../../components/public/blog/BlogList";
import LandingHeader from "../../../components/public/landing-header/landing-header";
import fetchBlogs from "../../../components/public/blog/FetchedBlogs";
import BlogSidebar from "../../../components/public/blog/BlogSidebar";

export default function Blog() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Optional dark mode auto detection
  // useEffect(() => {
  //   document.documentElement.classList.add("dark"); // remove if not needed
  // }, []);

  const handleSearch = (query) => console.log("Search:", query);
  const handleFilterChange = (filter) => console.log("Filter:", filter);
  const handleCreatePost = () => console.log("Open Create Post modal");

  // const fetchBlogs = useCallback(async (page) => {
  //   // Example: Replace with your real API endpoint
  //   const res = await fetch(`/api/blogs?page=${page}&limit=10`);
  //   const data = await res.json();
  //   return data?.blogs || [];
  // }, []);

  return (
    <>
      <LandingHeader />

      <div
        className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 
  dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-16 px-6 flex flex-col items-center"
      >
        {/* CONTAINER */}
        <div className="w-full max-w-7xl mt-15 flex flex-col lg:flex-row gap-10">
          {/* LEFT SECTION */}
          <div className="flex-1 w-full">
            {/* Blog Header (above blog list) */}
            <div className="mb-6">
              <BlogHeader
                isLoggedIn={isLoggedIn}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onCreatePost={handleCreatePost}
                onCategorySelect={(cat) =>
                  console.log("Category selected:", cat)
                }
              />
            </div>

            {/* Blog List */}
            <BlogList fetchBlogs={fetchBlogs} />
          </div>

          {/* RIGHT SECTION: STICKY SIDEBAR */}
          <div className="w-full lg:w-[22rem] shrink-0 relative">
            <div className="lg:sticky lg:top-20 lg:self-end ">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
