import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaArrowLeft } from "react-icons/fa6";
import { FaPlayCircle } from "react-icons/fa";


const ViewLecture = () => {
    const {courseId} = useParams();
    const {courseData} = useSelector(state=>state.course);
    const {userData} = useSelector(state=>state.user);

    const selectedCourse = courseData.find(
        (course) => course._id.toString() === courseId?.toString()
      );
    const [creatorData, setCreatorData] = useState(null);
    const [selectedLecture, setSelectedLecture] = useState(selectedCourse?.lectures?.[0] || null);
    const navigate = useNavigate();



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
            console.log(selectedLecture);
            
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

  return (
    <div className='min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6'>


    {/* Left or Top */}
        <div className='w-full md:w-2/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200'>
            <div className='mb-6'>
                <h2 className='text-2xl font-bold flex items-center justify-center gap-[20px] text-gray-800'>
                    <FaArrowLeft className='text-black w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate('/')}/>
                    {selectedLecture?.lectureTitle
}
                </h2>
                    <div className='mt-4 flex gap-4 text-sm text-gray-500 font-medium'>
                        <span>Category : {selectedLecture?.category}</span>
                        <span>Level : {selectedLecture?.level}</span>
                    </div>
            </div>
    {/* Video Player  */}
        <div className='aspect-video rounded-xl overflow-hidden mb-4 border border-gray-300'>
            {selectedLecture?.videoUrl ? (
                <video 
                    src={selectedLecture.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="h-full bg-gray-200 flex items-center justify-center text-white">
                    <p className="text-gray-500">No video available</p>
                </div>
            )}
        </div>
        <div className='mt-2'>
            <h2 className='text-xl font-semibold text-gray-800'>
                {selectedLecture?.lectureTitle}
            </h2>
        </div>
        </div>

        {/* Right or Bottom  */}
            <div className='w-full md:w-1/3 bg-white rounded-2xl shadow-md p-6 border border-gray-200 h-fit '>
                <h2 className='text-xl font-bold mb-4 text-gray-800'>Lectures</h2>
                <div className='flex flex-col gap-3 mb-6'>
                    {selectedCourse?.lectures?.map((lecture, index) => (
                        <button
                            key={index}
                            className={`p-4 flex justify-between items-center rounded-lg border cursor-pointer hover:bg-gray-100 text-left transition ${
                                selectedLecture?._id === lecture._id ? 'bg-gray-200 border-gray-400' : 'hover:bg-gray-50 border-gray-300'
                            }`}
                            onClick={() => setSelectedLecture(lecture)}
                        >
                            <h3 className='text-lg font-medium text-gray-800'>{lecture.lectureTitle}</h3>
                            <FaPlayCircle className="ml-2 text-gray-500" />
                        </button>
                    ))}
                </div>

                <div>
                    <h2 className='text-xl font-bold mb-4 mt-4 border-t text-gray-800'>Creator</h2>
                    {creatorData ? (
                        <div className='flex items-center gap-4'>
                            {/* <h1>{creatorData}</h1> */}
                            <img
                                src={creatorData.photoUrl || '/default-profile.png'}
                                alt={creatorData.name}  
                                className='w-16 h-16 rounded-full object-cover border border-gray-300'
                            />
                            <div>
                                <h3 className='text-lg font-medium text-gray-800'>{creatorData.name}</h3>
                                <p className='text-gray-500 text-sm'>{creatorData.description}</p>
                                <p className='text-gray-500 text-sm'>{creatorData.email}</p>
                            </div>
                        </div>
                    ) : (
                        <p className='text-gray-500'>Loading instructor information...</p>
                    )}
                </div>

            </div>

    </div>
  )
}

export default ViewLecture