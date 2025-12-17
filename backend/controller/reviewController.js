import Review from "../model/reviewModel.js";
import Course from "../model/courseModel.js";

export const createReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const userId = req.userId; // Fix: Use req.userId from middleware, not req.user._id

    console.log("Create Review Request:", {
      userId,
      courseId,
      rating,
      comment,
    });

    // Validate required fields
    if (!userId) {
      return res.status(401).json({ msg: "User not authenticated" });
    }

    if (!courseId || !rating || !comment) {
      console.log("Missing fields:", { courseId, rating, comment });
      return res
        .status(400)
        .json({ msg: "courseId, rating, and comment are required" });
    }

    // Validate rating is between 1 and 5
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    const alreadyReviewed = await Review.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ msg: "You have already reviewed this course" });
    }

    const review = await Review.create({
      user: userId,
      course: courseId,
      rating: ratingNum,
      comment: comment.trim(),
    });

    await review.save();

    // Add review to course if reviews array exists
    if (course.reviews) {
      course.reviews.push(review._id);
      await course.save();
    }

    console.log("Review created successfully:", review._id);
    return res.status(201).json({ msg: "Review created successfully", review });
  } catch (error) {
    console.error("Create Review Error:", error);
    return res.status(500).json({ msg: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user course")
      .sort({ reviewedAt: -1 });
    console.log("Fetched reviews:", reviews.length);
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    return res.status(500).json({ msg: error.message });
  }
};
