import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BlogCard from "@/components/blog/BlogCard";

// Mock data - Replace with actual data from your backend
const blogPosts = [
  {
    id: 1,
    title: "Essential Home Maintenance Tips for Indian Homes",
    excerpt: "Learn the most important maintenance tasks to keep your home in top condition throughout the year.",
    author: "Rajesh Kumar",
    date: "March 15, 2024",
    readTime: "5 min read",
    category: "Home Maintenance",
    image: "/blog/home-maintenance.jpg",
    slug: "essential-home-maintenance-tips"
  },
  {
    id: 2,
    title: "How to Choose the Right Service Provider",
    excerpt: "A comprehensive guide to finding and selecting reliable service providers for your home needs.",
    author: "Priya Sharma",
    date: "March 12, 2024",
    readTime: "4 min read",
    category: "Guides",
    image: "/blog/choose-provider.jpg",
    slug: "choose-right-service-provider"
  },
  {
    id: 3,
    title: "Common Plumbing Issues and Their Solutions",
    excerpt: "Identify and fix common plumbing problems in your home with these expert tips.",
    author: "Amit Patel",
    date: "March 10, 2024",
    readTime: "6 min read",
    category: "Plumbing",
    image: "/blog/plumbing-issues.jpg",
    slug: "common-plumbing-issues-solutions"
  },
  // Add more blog posts as needed
];

const categories = [
  "All Categories",
  "Home Maintenance",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Guides",
  "Tips & Tricks"
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Blog & Resources</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Expert advice, tips, and guides to help you maintain your home and make informed decisions.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <BlogCard
            key={post.id}
            title={post.title}
            excerpt={post.excerpt}
            author={post.author}
            date={post.date}
            readTime={post.readTime}
            category={post.category}
            image={post.image}
            slug={post.slug}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No articles found matching your criteria.</p>
        </div>
      )}
    </div>
  );
} 