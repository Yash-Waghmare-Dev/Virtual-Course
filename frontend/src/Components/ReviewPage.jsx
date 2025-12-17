import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ReviewCard from './ReviewCard';

const ReviewPage = () => {


    const {reviewData} = useSelector(state=>state.review);
    const [latestReviews, setLatestReviews] = useState([]);


    console.log('reviewData',reviewData);
    

    useEffect(() => {
        setLatestReviews(reviewData?.slice(0, 6));
    }, [reviewData]);

  return (
    <div className='flex items-center justify-center flex-col'>
        <h1 className='md:text-[45px] text-[30px] font-semibold text-center mt-[30px] px-[20px]'>Real Reviews for real course</h1>
        
        <span className='lg:w-[50%] md:w-[80%] text-[15px] text-center mt-[30px] mb-[30px] px-[20px]'>
            Discover how our Virtual Courses is transforming learning experience through feedback from students worldwide. Read authentic reviews that highlight the impact of our courses on skills development, career growth, and personal enrichment.
        </span>
        
        <div className='w-[100%] min-[100vh] flex items-center justify-center flex-wrap gap-[50px] lg:p-[50px] md:p-[30px] p-[10px] mb-[40px]'>
            {
                latestReviews?.map((review, index) => (
                    <ReviewCard key={index} comment={review.comment} rating={review.rating} photoUrl={review.user.photoUrl} name={review.user.name} description={review.user.description} courseTitle={review.course.title}/>
                ))
            }
        </div>
    </div>
  )
}

export default ReviewPage