import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";

const MyEnrollCourse = () => {

    const {userData} = useSelector(state=>state.user);
    const navigate = useNavigate();


  return (
    <div className='min-h-screen w-full px-4 py-9 bg-gray-50'>
        <FaArrowLeft className='absolute top-[3%] md:top-[6%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate('/')}/>
        <h1 className='text-3xl text-center font-bold text-gray-800 mb-6'>
            My Enrolled Courses
        </h1>
            {
                userData?.enrolledCourses?.length === 0 ? (
                    <p className='text-center text-gray-600 mt-10'>You have not enrolled in any courses yet.</p>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            userData?.enrollCourses?.map((course, index)=>(
                                <div key={index} className='bg-white rounded-2xl shadow-md p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition' onClick={()=>navigate(`/viewcourse/${course._id}`)}>
                                    <img src={course.thumbnail} alt={course.title} className='w-full h-40 object-cover rounded-lg mb-4'/>
                                    <h2 className='text-xl font-bold mb-2 text-gray-800'>{course.title}</h2>
                                    <p className='text-gray-600 mb-4'>{course.description}</p>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-gray-500 font-medium'>Category: {course.category}</span>
                                        <span className='text-gray-500 font-medium'>Level: {course.level}</span>
                                    </div>
                                </div>
                            ))  
                        }
                    </div>
                )
            }
    </div>
  )
}

export default MyEnrollCourse