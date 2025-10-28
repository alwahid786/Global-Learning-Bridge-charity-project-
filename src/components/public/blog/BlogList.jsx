import React, { useEffect, useState } from "react";
import {
  FaUserAlt,
  FaCalendarAlt,
  FaTag,
  FaHeart,
  FaComment,
  FaShare,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function BlogList({ fetchBlogs }) {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const blogsPerPage = 10;

  // Fetch all blogs once (you can later switch to server-side pagination)
  useEffect(() => {
    const loadBlogs = async () => {
      setLoading(true);
      const allBlogs = await fetchBlogs();
      setBlogs(allBlogs);
      setLoading(false);
    };
    loadBlogs();
  }, [fetchBlogs]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Pagination logic
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const indexOfLast = currentPage * blogsPerPage;
  const indexOfFirst = indexOfLast - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-10 flex flex-col gap-10 px-4 max-w-4xl mx-auto">
      {/* Blog Cards */}
      <AnimatePresence mode="wait">
        {currentBlogs.map((blog, index) => {
          const isExpanded = expanded[blog._id || index];

          return (
            <motion.div
              key={blog._id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white via-blue-50 to-pink-50 border border-gray-200/40 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center px-5 py-3 border-b bg-white/70 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <img
                    src={`https://i.pravatar.cc/40?img=${index + 1}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <span className="font-medium text-gray-700 flex items-center gap-1">
                    <FaUserAlt className="text-[#A8765F]" />{" "}
                    {blog.author || "Global Learning Bridge"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <FaCalendarAlt className="text-[#A8765F]" />
                  <span className="text-gray-500">
                    {new Date(blog.createdAt || Date.now()).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="ml-1 bg-[#A8765F]/10 text-[#A8765F] px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    <FaTag className="text-[10px]" />
                    {blog.category || "General"}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-400 text-white text-xs px-4 py-1.5 rounded-full shadow-md hover:shadow-lg transition-all"
                  onClick={() => alert("Redirect to Donate Page")}
                >
                  <FaHeart className="text-white" />
                  Donate
                </motion.button>
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col gap-3 relative">
                <h3 className="text-gray-900 font-semibold text-xl tracking-tight leading-snug">
                  {blog.title || "Untitled Blog"}
                </h3>
                <p
                  className={`text-gray-700 text-sm relative transition-all duration-500 ${
                    isExpanded ? "" : "line-clamp-4 fade-gradient"
                  }`}
                >
                  {blog.description ||
                    "A heartwarming story about transforming lives through compassion and education."}
                </p>
                <button
                  onClick={() => toggleExpand(blog._id || index)}
                  className="text-[#A8765F] text-xs font-semibold mt-1 hover:underline self-start"
                >
                  {isExpanded ? "See Less ▲" : "See More ▼"}
                </button>
              </div>

              {/* MEDIA */}
              {blog.image && (
                <motion.div
                  className="w-full h-80 overflow-hidden relative group"
                  whileHover={{ scale: 1.02, y: -3 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.img
                    src={
                      blog.image ||
                      "https://placehold.co/800x400?text=Blog+Image"
                    }
                    alt={blog.title}
                    whileHover={{ scale: 1.1, y: -10 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full object-cover rounded-t-2xl group-hover:opacity-95 transition-all"
                  />
                </motion.div>
              )}

              {/* STATS */}
              <div className="flex justify-start gap-6 px-5 py-2 border-t text-sm text-gray-500 bg-white/50">
                <span className="flex items-center gap-1">
                  <FaHeart className="text-pink-500" /> {blog.likes || 24}
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1">
                  <FaComment className="text-blue-500" /> {blog.comments || 8}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-around items-center border-t px-5 py-3 bg-white text-gray-600 text-sm">
                <AnimatedButton icon={<FaHeart />} label="Like" color="pink" />
                <DividerDot />
                <AnimatedButton
                  icon={<FaComment />}
                  label="Comment"
                  color="blue"
                />
                <DividerDot />
                <AnimatedButton
                  icon={<FaShare />}
                  label="Share"
                  color="green"
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10 select-none">
          <motion.button
            whileHover={{ scale: 1.05 }}
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-200 to-blue-200 text-gray-700 hover:shadow-md"
            }`}
          >
            <FaChevronLeft /> Prev
          </motion.button>

          {[...Array(totalPages)].map((_, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(i + 1)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
                currentPage === i + 1
                  ? "bg-[#A8765F] text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-pink-50"
              }`}
            >
              {i + 1}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-200 to-pink-200 text-gray-700 hover:shadow-md"
            }`}
          >
            Next <FaChevronRight />
          </motion.button>
        </div>
      )}

      {/* Skeleton Loader */}
      {loading && (
        <div className="animate-pulse bg-white/80 border border-gray-200/30 rounded-3xl shadow-sm p-6 flex flex-col gap-4">
          <div className="bg-gray-200 h-5 w-1/3 rounded"></div>
          <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
          <div className="bg-gray-200 h-3 w-full rounded"></div>
          <div className="bg-gray-200 h-3 w-5/6 rounded"></div>
          <div className="bg-gray-200 h-64 w-full rounded-xl"></div>
          <div className="flex justify-between items-center border-t pt-2 mt-auto">
            <div className="bg-gray-200 h-3 w-12 rounded"></div>
            <div className="bg-gray-200 h-3 w-12 rounded"></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------- Helper Components ------------------- */
function AnimatedButton({ icon, label, color }) {
  const hoverVariants = {
    pink: { scale: 1.2, color: "#ec4899" },
    blue: { y: -2, color: "#3b82f6" },
    green: { rotate: -15, color: "#22c55e" },
  };
  return (
    <motion.button
      whileHover={hoverVariants[color]}
      whileTap={{ scale: 0.9 }}
      className="flex items-center gap-2 font-medium transition-all"
    >
      {icon} {label}
    </motion.button>
  );
}
function DividerDot() {
  return <span className="text-gray-300">•</span>;
}

/* ------------------- Fade Gradient ------------------- */
const styles = `
.fade-gradient::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2.5rem;
  width: 100%;
  background: linear-gradient(to bottom, transparent, white 90%);
}
`;
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = styles;
  document.head.appendChild(style);
}
