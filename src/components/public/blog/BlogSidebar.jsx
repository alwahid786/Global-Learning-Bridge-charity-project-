import React from "react";
import { motion } from "framer-motion";
import { FaEnvelopeOpenText, FaTag, FaArrowRight } from "react-icons/fa";

export default function BlogSidebar() {
  const categories = [
    "Education",
    "Healthcare",
    "Environment",
    "Community",
    "Fundraising",
  ];

  const recentPosts = [
    {
      title: "Building Hope Through Education",
      date: "Oct 24, 2025",
      image: "https://placehold.co/300x180?text=Education",
    },
    {
      title: "Clean Water for Every Village",
      date: "Oct 20, 2025",
      image: "https://placehold.co/300x180?text=Water",
    },
    {
      title: "Youth Volunteering Drives Change",
      date: "Oct 18, 2025",
      image: "https://placehold.co/300x180?text=Volunteering",
    },
  ];

  return (
    <aside className="w-full md:w-80 flex flex-col gap-6">
      {/* Categories */}
      <motion.div
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-100 p-5"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaTag className="text-[#A8765F]" /> Popular Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.07 }}
              className="px-3 py-1.5 text-xs rounded-full bg-pink-50 text-[#A8765F] border border-pink-100 hover:bg-pink-100 transition-all"
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Posts */}
      <motion.div
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-100 p-5"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Posts
        </h3>
        <div className="flex flex-col gap-4">
          {recentPosts.map((post, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 bg-gradient-to-r from-pink-50 to-blue-50/40 rounded-xl p-2 hover:shadow-md transition-all"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">{post.date}</span>
                <p className="text-sm font-medium text-gray-800 line-clamp-2">
                  {post.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Newsletter Signup */}
      <motion.div
        className="bg-gradient-to-br from-pink-100 via-white to-blue-100 rounded-2xl shadow-lg p-6 border border-pink-50"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <FaEnvelopeOpenText className="text-[#A8765F] text-xl" />
          <h3 className="text-lg font-semibold text-gray-800">
            Join Our Newsletter
          </h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Get inspiring stories, impact updates, and upcoming campaigns — right
          in your inbox.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-3"
        >
          <input
            type="email"
            placeholder="Your email"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#A8765F]/40 outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 bg-[#A8765F] text-white rounded-lg py-2 text-sm font-medium shadow hover:bg-[#946956] transition-all"
          >
            Subscribe <FaArrowRight />
          </motion.button>
        </form>
      </motion.div>
    </aside>
  );
}
