import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import RatingStars from "./RatingStars";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(500),
  title: z.string().min(5).max(100)
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  serviceId?: string;
  providerId?: string;
  onSubmit?: (data: ReviewFormData) => void;
}

export default function ReviewForm({ serviceId, providerId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      title: ""
    }
  });

  const handleFormSubmit = async (data: ReviewFormData) => {
    try {
      // Here you would typically make an API call to save the review
      console.log({
        ...data,
        serviceId,
        providerId
      });

      if (onSubmit) {
        onSubmit(data);
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <RatingStars
          rating={rating}
          interactive
          onRatingChange={(value) => {
            setRating(value);
            register("rating").onChange({ target: { value } });
          }}
        />
        {errors.rating && (
          <p className="text-sm text-red-500">Please select a rating</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <input
          {...register("title")}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Give your review a title"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Review</label>
        <Textarea
          {...register("comment")}
          placeholder="Share your experience..."
          className="min-h-[100px]"
        />
        {errors.comment && (
          <p className="text-sm text-red-500">{errors.comment.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </motion.form>
  );
} 