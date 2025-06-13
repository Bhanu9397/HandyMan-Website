import { motion } from "framer-motion";
import { Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogCardProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  slug: string;
}

export default function BlogCard({
  title,
  excerpt,
  author,
  date,
  readTime,
  category,
  image,
  slug
}: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <div className="aspect-video relative">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full"
          />
          <Badge className="absolute top-4 right-4">{category}</Badge>
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {date}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {readTime}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/blog/${slug}`}>Read More</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 