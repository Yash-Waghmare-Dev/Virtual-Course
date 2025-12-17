import axios from 'axios'
import React,{ useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setCreatorCourseData } from '../Redux/courseSlice.js'

const useGetCreatorCourse = () => {

    const dispatch = useDispatch()
      const { userData } = useSelector(state=>state.user);


    useEffect(()=>{
        const creatorCourses = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/course/getcreator" , {withCredentials : true});
                console.log(result.data);
                dispatch(setCreatorCourseData(result.data))
            } catch (error) {
                console.log(error);
                
            }
        }
        creatorCourses()
    }, [userData])
  
}

export default useGetCreatorCourse