import React from 'react'
import { FaArrowLeft } from "react-icons/fa6";
import ai from '../assets/ai.png'
import { RiMicAiFill } from "react-icons/ri";

const SearchWithAi = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-black to-gray-600 text-white flex flex-col items-center px-4 py-16'>
        
        {/* Search Container */}
        
        <div className='bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative'>
            <FaArrowLeft  className='absolute w-[22px] h-[22px] cursor-pointer text-black'/>
            <h1 className='text-2xl sm:text-2xl font-bold mb-6 text-gray-600 flex items-center justify-center gap-2'>
                <img src={ai} alt="" className='w-8 h-8 sm:w-[30px] sm:h-[30px]'/>
                Search Courses with AI
                <span className='text-[#CB99C7]'>AI</span>
            </h1>
            <div className='flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full'>
                <input type="text" className='flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base' placeholder='What do you want to learn? (e.g, java, paython)'/>

                <button className='absolute right-14 sm:right-16 bg-white rounded-full'><img src={ai} alt="" className='w-10 h-10 p-2 rounded-full' /></button>

                <button className='absolute right-2 bg-white rounded-full w-10 flex items-center justify-center'>
                    <RiMicAiFill className='w-5 h-5 text-[#cb87c5]'/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default SearchWithAi