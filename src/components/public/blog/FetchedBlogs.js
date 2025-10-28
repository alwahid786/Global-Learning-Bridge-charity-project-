// FetchedBlogs.js
const fetchBlogs = async (page = 1) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const dummyBlogs = Array.from({ length: 10 }, (_, i) => {
    const id = (page - 1) * 10 + i + 1;
    return {
      _id: `blog_${id}`,
      title: `Inspiring Journey #${id}: Empowering Young Minds`,
      description:
        "Through your generous support, Global Learning Bridge continues to provide underprivileged children with quality education.Through your generous support, Global Learning Bridge continues to provide underprivileged children with quality education. Through your generous support, Global Learning Bridge continues to provide underprivileged children with quality education. Through your generous support, Global Learning Bridge continues to provide underprivileged children with quality education.",
      author: id % 2 === 0 ? "Sarah Malik" : "Ahmed Raza",
      category:
        id % 3 === 0 ? "Education" : id % 3 === 1 ? "Community" : "Health",
      image: `https://picsum.photos/seed/blog_${id}/600/400`,
      createdAt: new Date(Date.now() - id * 86400000).toISOString(),
    };
  });
  return dummyBlogs;
};

export default fetchBlogs;
