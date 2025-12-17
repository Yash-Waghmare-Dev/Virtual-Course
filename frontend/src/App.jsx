import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import useGetCurrentUser from './customHooks/useGetCurrentUser.jsx'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import EditProfile from './pages/EditProfile.jsx'
import DashBoard from './pages/Educator/DashBoard.jsx'
import Courses from './pages/Educator/Courses.jsx'
import CreateCourses from './pages/Educator/CreateCourses.jsx'
import EditCourse from './pages/Educator/EditCourse.jsx'
import useGetCreatorCourse from './customHooks/useGetCreatorCourse.jsx'
import useGetPublishedCourse from './customHooks/useGetPublishedCourse.jsx'
import AllCourse from './pages/AllCourse.jsx'
import CreateLecture from './pages/Educator/CreateLecture.jsx'
import EditLecture from './pages/Educator/EditLecture.jsx'
import ViewCourses from './pages/ViewCourses.jsx'
import ScrollToTop from './Components/ScrollToTop.jsx'
import ViewLecture from './pages/ViewLecture.jsx'
import MyEnrollCourse from './pages/MyEnrollCourse.jsx'
import useGetAllReviews from './customHooks/useGetAllReviews.jsx'
import SearchWithAi from './pages/SearchWithAi.jsx'

export const serverUrl = "http://localhost:8000"

function App() {
      useGetCurrentUser();
      useGetCreatorCourse();
      useGetPublishedCourse();
      useGetAllReviews();
      
      const { userData } = useSelector(state=>state.user);
  return (
    <>
    <ToastContainer/>
    <ScrollToTop/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={!userData ? <SignUp/> : <Navigate to={'/'}/> }/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/profile' element={userData ? <Profile/> : <Navigate to={'/signup'}/>}/>
        <Route path='/forget' element={!userData ? <ForgetPassword/> : <Navigate to={'/signup'}/>}/>
        <Route path='/editprofile' element={userData ? <EditProfile/> : <Navigate to={'/signup'}/>}/>
        <Route path='/allcourses' element={userData ? <AllCourse/> : <Navigate to={'/signup'}/>}/>
        <Route path='/dashboard' element={userData?.role == "educator" ? <DashBoard/> : <Navigate to={'/signup'}/>}/>
        <Route path='/courses' element={userData?.role == "educator" ? <Courses/> : <Navigate to={'/signup'}/>}/>
        <Route path='/createcourses' element={userData?.role == "educator" ? <CreateCourses/> : <Navigate to={'/signup'}/>}/>
        <Route path='/editcourse/:courseId' element={userData?.role == "educator" ? <EditCourse/> : <Navigate to={'/signup'}/>}/>
        <Route path='/createlecture/:courseId' element={userData?.role == "educator" ? <CreateLecture/> : <Navigate to={'/signup'}/>}/>
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role == "educator" ? <EditLecture/> : <Navigate to={'/signup'}/>}/>
        <Route path='/viewcourse/:courseId' element={userData ? <ViewCourses/> : <Navigate to={'/signup'}/>}/>
        <Route path='/viewlecture/:courseId' element={userData ? <ViewLecture/> : <Navigate to={'/signup'}/>}/>
        <Route path='/mycourses' element={userData ? <MyEnrollCourse/> : <Navigate to={'/signup'}/>}/>
        <Route path='/search' element={userData ? <SearchWithAi/> : <Navigate to={'/signup'}/>}/>
        
      </Routes>
    </>
  )
}

export default App
