import React from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";

const ReviewCard = ({
  comment,
  rating,
  photoUrl,
  name,
  description,
  courseTitle,
}) => {
  // Fallback values for missing data
  const safeRating = rating || 0;
  const safeName = name || "Anonymous";
  const safeComment = comment || "No comment provided";
  const safeDescription = description || "Student";
  const safeCourseTitle = courseTitle || "Course";

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border max-w-sm w-full h-full flex flex-col">
      <div className="flex items-center mb-3 text-yellow-400 text-sm gap-1">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span key={i}>
              {i < safeRating ? (
                <FaStar className="text-yellow-400" />
              ) : (
                <FaRegStar className="text-gray-300" />
              )}
            </span>
          ))}
      </div>
      <p className="text-yellow-600 text-xs font-semibold mb-3 uppercase">
        {safeCourseTitle}
      </p>
      <p className="text-gray-700 text-sm mb-5 flex-grow line-clamp-3">
        "{safeComment}"
      </p>
      <div className="flex items-center gap-3 mt-auto">
        <img
          src={photoUrl}
          alt={safeName}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
        />
        <div>
          <h2 className="font-semibold text-gray-800 text-sm">{safeName}</h2>
          <p className="text-xs text-gray-500">{safeDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
