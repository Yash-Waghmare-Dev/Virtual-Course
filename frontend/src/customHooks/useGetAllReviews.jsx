import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setReviewData } from "../Redux/reviewSlice";

const useGetAllReviews = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const allReviews = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/review/getReviews", {
          withCredentials: true,
        });
        console.log("All reviews fetched:", result.data);
        // Handle both direct array response and nested data object
        const reviewsData = Array.isArray(result.data)
          ? result.data
          : result.data.data || [];
        dispatch(setReviewData(reviewsData));
      } catch (error) {
        console.log("Error fetching reviews:", error);
        dispatch(setReviewData([]));
      }
    };
    allReviews();
  }, [dispatch]);
};

export default useGetAllReviews;
