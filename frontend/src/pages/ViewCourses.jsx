import React, { useEffect, useCallback, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCourse } from "../Redux/courseSlice";
import img from "../assets/empty.jpg";
import { FaStar } from "react-icons/fa";
import { FaPlayCircle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { serverUrl } from "../App";
import axios from "axios";
import Card from "../Components/Card";
import { toast } from "react-toastify";

const ViewCourses = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { courseData } = useSelector((state) => state.course);
  const { selectedCourse } = useSelector((state) => state.course);
  const { userData } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [creatorCourses, setCreatorCourses] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const fetchCourseData = useCallback(() => {
    if (!courseData || !courseId) {
      console.log("Missing courseData or courseId");
      return;
    }

    console.log("Searching for course with ID:", courseId);
    console.log("Available courses:", courseData);

    const foundCourse = courseData.find((course) => {
      const isMatch = course._id.toString() === courseId;
      console.log(`Checking course ${course._id}:`, isMatch);
      return isMatch;
    });

    if (foundCourse) {
      console.log("Found course:", foundCourse);
      dispatch(setSelectedCourse(foundCourse));
    } else {
      console.error(`Course with ID ${courseId} not found in courseData`);
    }
  }, [courseData, courseId, dispatch]);

  useEffect(() => {
    const handleCreator = async () => {
      // Change selectedCourse?.creator to selectedCourse?.creators
      if (!selectedCourse?.creators) {
        console.error("No creator found in selectedCourse:", selectedCourse);
        return;
      }

      try {
        console.log("Fetching creator with ID:", selectedCourse.creators);
        const result = await axios.post(
          `${serverUrl}/api/course/creator`,
          { userId: selectedCourse.creators },
          { withCredentials: true }
        );
        console.log("Creator API Response:", result.data);
        setCreatorData(result.data);
      } catch (error) {
        console.error("Error fetching creator:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      }
    };

    if (selectedCourse) {
      handleCreator();
    }
  }, [selectedCourse]);

  const checkEnrollment = () => {
    const verify = userData?.enrollCourses?.some(
      (c) =>
        (typeof c === "string" ? c : c._id).toString() === courseId?.toString()
    );
    if (verify) {
      setIsEnrolled(true);
    }
  };

  useEffect(() => {
    fetchCourseData();
    checkEnrollment();
  }, [courseData, courseId, userData, fetchCourseData]);

  useEffect(() => {
    if (creatorData?._id && courseData.length > 0) {
      const creatorCourse = courseData.filter(
        (course) =>
          course.creators === creatorData._id && course._id !== courseId
      );
      setCreatorCourses(creatorCourse);
    }
  }, [creatorData, courseData, courseId]);

  console.log("creatorCourses", creatorCourses);

  const handleEnroll = async (userId, courseId) => {
    try {
      const orderData = await axios.post(
        serverUrl + "/api/order/razorpay-order",
        { userId, courseId },
        { withCredentials: true }
      );
      console.log("Order Data", orderData.data);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.order.amount,
        currency: "INR",
        name: "Virtual Courses",
        description: "Course Purchase",
        order_id: orderData.data.order.id,
        handler: async function (response) {
          console.log("Payment Response", response);
          try {
            const verifyResponse = await axios.post(
              serverUrl + "/api/order/verifypayment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId,
                userId,
              },
              { withCredentials: true }
            );
            setIsEnrolled(true);
            console.log("Verify Response", verifyResponse.data);
            toast.success(verifyResponse.data.msg);
          } catch (error) {
            console.log("Error in Verifying Payment", error);
            toast.error(
              error.response?.data?.msg || "Payment Verification Failed"
            );
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("Error in Order", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">
        {/* Top Section  */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail  */}
          <div className="w-full md:w-1/2">
            <FaArrowLeft
              className="text-black w-[22px] h-[22px] cursor-pointer"
              onClick={() => navigate("/")}
            />
            {selectedCourse?.thumbnail ? (
              <img
                src={selectedCourse?.thumbnail}
                alt=""
                className="rounded-xl w-full object-cover"
              />
            ) : (
              <img
                src={img}
                alt=""
                className="rounded-xl w-full object-cover"
              />
            )}
          </div>

          {/* CourseInfo  */}
          <div className="flex-1 space-y-2 mt-[20px]">
            <h2 className="text-2xl font-bold">{selectedCourse?.title}</h2>
            <p className="text-gray-600">{selectedCourse?.subTitle}</p>

            <div className="flex items-start flex-col justify-between">
              <div className="text-yellow-500 font-medium flex gap-2">
                <span className="flex justify-start items-center gap-1">
                  <FaStar /> 5
                </span>
                <span className="text-gray-400">(1,200 Reviews)</span>
              </div>
              <div>
                <span className="text-xl font-semibold text-black">
                  ₹ {selectedCourse?.price}
                </span>
                {"  "}
                <span className="line-through text-sm text-gray-400">599</span>
              </div>
              <ul className="text-sm text-gray-700 space-y-1 pt-2">
                <li>10+ Hours of video content</li>
                <li>Lifetime access to Course</li>
              </ul>
              {!isEnrolled ? (
                <button
                  className="bg-[black] text-white px-6 py-2 rounded hover:bg-gray-700 mt-3 cursor-pointer"
                  onClick={() => handleEnroll(userData._id, courseId)}
                >
                  Enroll Now
                </button>
              ) : (
                <button className="bg-green-100 text-green-500 px-6 py-2 rounded hover:bg-gray-700 mt-3 cursor-pointer" onClick={()=>navigate(`/viewlecture/${courseId}`)}>
                  Watch Now
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">What You'll Learn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Learn {selectedCourse?.category} from Beginning</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Who This Course is For</h2>
          <p className="text-gray-700">
            Beginners, aspiring developers, and professionals looking to upgrade
            skills.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-1 text-gray-800">
              Course Curriculum
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedCourse?.lectures?.length} Lectures
            </p>

            <div className="flex flex-col gap-3">
              {selectedCourse?.lectures?.map((lecture, index) => (
                <button
                  key={index}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                    lecture.isPreviewFree
                      ? "hover:bg-gray-100 cursor-pointer border-gray-300"
                      : "cursor-not-allowed opacity-60 border-gray-200"
                  } ${
                    selectedLecture?.lectureTitle === lecture?.lectureTitle
                      ? "bg-gray-100 border-gray-400"
                      : ""
                  }`}
                  onClick={() => {
                    if (lecture.isPreviewFree) {
                      setSelectedLecture(lecture);
                    }
                  }}
                  disabled={!lecture.isPreviewFree}
                >
                  <span className="text-lg text-gray-700">
                    {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {lecture.lectureTitle}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
              {selectedLecture?.videoUrl ? (
                <video
                  className="w-full h-full object-cover"
                  src={selectedLecture?.videoUrl}
                  controls
                />
              ) : (
                <span className="text-white text-sm">
                  Select a Preview lecture to watch
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">Write a Reviews</h2>
          <div className="mb-4">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className="fill-gray-300" />
              ))}
            </div>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Write your review here..."
              rows={3}
            />
            <button className="bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800">
              Submit Review
            </button>
          </div>
        </div>
        {/* for Creator Info  */}
        <div className="flex items-center gap-4 pt-4 border-t">
          {creatorData?.photoUrl ? (
            <img
              src={creatorData?.photoUrl}
              alt=""
              className="border-1 border-gray-200 w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <img
              src={img}
              alt=""
              className="border-1 border-gray-200 w-16 h-16 rounded-full object-cover"
            />
          )}

          <div>
            <h2 className="text-lg font-semibold">{creatorData?.name}</h2>
            <p className="md:text-sm text-gray-600 text-[10px]">
              {creatorData?.description}
            </p>
            <p className="md:text-sm text-gray-600 text-[10px]">
              {creatorData?.email}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xl font-semibold mb-2">
            Other Publish Courses by the Educator
          </p>
        </div>
        <div className="w-full transition-all duration-300 py-[20px] flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px]">
          {courseData?.map((course, index) => (
            <Card
              key={index}
              thumbnail={course.thumbnail}
              id={course._id}
              price={course.price}
              title={course.title}
              category={course.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewCourses;
