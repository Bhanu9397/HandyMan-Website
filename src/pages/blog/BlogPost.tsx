import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data - Replace with actual data from your backend
const blogPosts = {
  "essential-home-maintenance-tips": {
    title: "Essential Home Maintenance Tips for Indian Homes",
    content: `
      <h2>Introduction</h2>
      <p>Maintaining your home is crucial for its longevity and your comfort. In India's diverse climate, regular maintenance becomes even more important.</p>

      <h2>Monthly Maintenance Tasks</h2>
      <ul>
        <li>Check and clean air filters</li>
        <li>Inspect plumbing for leaks</li>
        <li>Test smoke detectors</li>
        <li>Clean gutters and drains</li>
      </ul>

      <h2>Seasonal Maintenance</h2>
      <p>Different seasons require different maintenance approaches:</p>
      <ul>
        <li><strong>Summer:</strong> Check AC units, clean fans</li>
        <li><strong>Monsoon:</strong> Inspect roof, check drainage</li>
        <li><strong>Winter:</strong> Service heating systems</li>
      </ul>

      <h2>Professional Services</h2>
      <p>Some tasks require professional expertise:</p>
      <ul>
        <li>Electrical system inspection</li>
        <li>Plumbing maintenance</li>
        <li>Structural assessment</li>
      </ul>
    `,
    author: "Rajesh Kumar",
    date: "March 15, 2024",
    readTime: "5 min read",
    category: "Home Maintenance",
    image: "/blog/home-maintenance.jpg"
  }
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="aspect-video relative mb-8 rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full"
          />
          <Badge className="absolute top-4 right-4">{post.category}</Badge>
        </div>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-6 text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {post.readTime}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </header>

        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.article>
    </div>
  );
} 