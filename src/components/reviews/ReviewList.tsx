import { motion } from "framer-motion";
import { Calendar, ThumbsUp, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import RatingStars from "./RatingStars";

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  title: string;
  comment: string;
  date: string;
  likes: number;
  replies: number;
  verified: boolean;
}

interface ReviewListProps {
  reviews: Review[];
  showProviderResponse?: boolean;
}

export default function ReviewList({ reviews, showProviderResponse = false }: ReviewListProps) {
  return (
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={review.user.avatar} alt={review.user.name} />
              <AvatarFallback>{review.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{review.user.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {review.date}
                    {review.verified && (
                      <Badge variant="secondary" className="ml-2">Verified</Badge>
                    )}
                  </div>
                </div>
                <RatingStars rating={review.rating} size="sm" />
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">{review.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
              </div>

              {showProviderResponse && review.replies > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500">
                    Provider responded to this review
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <button className="flex items-center gap-1 hover:text-primary">
                  <ThumbsUp className="h-4 w-4" />
                  {review.likes}
                </button>
                <button className="flex items-center gap-1 hover:text-primary">
                  <MessageSquare className="h-4 w-4" />
                  {review.replies}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 