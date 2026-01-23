import { Review } from "@/types/review";
import { FaStar } from "react-icons/fa";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
      <div className="flex items-center mb-2">
        <p className="font-bold text-lg text-gray-800 mr-3">
          {review.user?.username || review.userName || "Anonymous"}
        </p>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
      <p className="text-xs text-gray-500">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ReviewCard;
