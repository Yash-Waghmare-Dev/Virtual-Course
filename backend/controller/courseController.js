import Course from "../model/courseModel.js";
import mongoose from "mongoose";
import uploadOnCloudinary from "../config/cloudinary.js";
import { Lecture } from "../model/lectureModel.js";
import User from "../model/UserModel.js";  // Add this import

//for Course


export const createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ msg: "title or category is required" });
    }
    const course = await Course.create({
      title,
      category,
      creators: req.userId,
    });
    return res.status(201).json(course);
  } catch (error) {
    return res.status(500).json({ msg: `Create Course error ${error}` });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate('creators', 'name email').populate('lectures reviews');
    if (!courses) {
      return res.status(404).json({ msg: "No courses found" });
    }
    return res.status(200).json(courses);
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Failed to get isPublished Corses ${error}` });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    console.log("Incoming request");

    // Debug userId
    const userID = req.userId;
    console.log("User ID:", userID);

    const objectId = new mongoose.Types.ObjectId(userID);

    // Query DB
    // const courses = await Course.find({ creators: userID });
    const courses = await Course.find({
      creators: objectId,
    });

    // Debug DB response
    console.log("Courses from DB:", courses);
    console.log("Total courses:", courses.length);

    if (!courses || courses.length === 0) {
      console.log("No courses found for creator:", userID);
      return res.status(404).json({ msg: "No courses found" });
    }

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("DB Error:", error);
    return res.status(500).json({
      msg: "Failed to get Creator Courses",
      error: error.message,
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      subTitle,
      description,
      category,
      level,
      price,
      isPublished,
    } = req.body;
    let thumbnail;
    if (req.file) {
      thumbnail = await uploadOnCloudinary(req.file.path);
    }
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    const updateData = {
      title,
      subTitle,
      description,
      category,
      level,
      price,
      isPublished,
      ...(thumbnail && { thumbnail }), // Add thumbnail to updateData if it exists
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
    await course.save();
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ msg: `Edit Course error ${error}` });
  }
};


export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
        const course = await Course.findById(courseId).populate('creators', 'name email') // Add this line.populate('lectures');
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ msg: `Get Course by Id error ${error}` });
  }
};

export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }
    course = await Course.findByIdAndDelete(courseId, { new: true });
    return res.status(200).json({ msg: "Course removed successfully" });
  } catch (error) {
    return res.status(500).json({ msg: `Remove Course error ${error}` });
  }
};



//for lectures

export const createLecture = async(req, res) => {
  try {
   const {lectureTitle} = req.body 
   const {courseId} = req.params

   if(!lectureTitle || !courseId){
    return res.status(400).json({msg : "Lecture title required"})
   }
   const lecture = await Lecture.create({lectureTitle})
   const course = await Course.findById(courseId)
   if(course){
    course.lectures.push(lecture._id)
   }
   await course.populate('lectures')
   await course.save()
   return res.status(201).json({lecture, course})
  } catch (error) {
    return res.status(500).json({ msg: `Failed to create lecture error ${error}` });
  }
}



export const getCourseLecture = async (req, res) => {
  try {
    const {courseId} = req.params
    const course = await Course.findById(courseId)
    if(!course){
      return res.status(404).json({msg : "Course is not found"})
    }
    await course.populate("lectures")
    await course.save()
    return res.status(200).json(course)
  } catch (error) {
    return res.status(500).json({ msg: `Failed to get CourseLecture error ${error}` });
  }
} 

export const editLecture = async (req, res) => {
  try {
    const {lectureId} = req.params
    const {isPreviewFree, lectureTitle} = req.body
    const lecture = await Lecture.findById(lectureId)
    if(!lecture){
      return res.status(404).json({msg : "Lecture is not found"})
    }
    let videoUrl
    if(req.file){
      videoUrl = await uploadOnCloudinary(req.file.path)
      lecture.videoUrl = videoUrl
    }
    if(lectureTitle){
      lecture.lectureTitle = lectureTitle
    }
    lecture.isPreviewFree = isPreviewFree

    await lecture.save()

    return res.status(200).json(lecture)
  } catch (error) {
    return res.status(500).json({ msg: `Failed to edit CourseLecture error ${error}` });
  }
}


export const removeLecture = async (req, res) => {
  try {
    const {lectureId} = req.params
    const lecture = await Lecture.findByIdAndDelete(lectureId)
    if(!lecture) { 
      return res.status(404).json({msg : "Lecture is not found"})
    }
    await Course.updateOne(
      {lectures : lectureId},
      {$pull : {lectures : lectureId} }
    )
    return res.status(200).json({msg : "Lecture Removed"})
  } catch (error) {
    return res.status(500).json({ msg: `Failed to Delete CourseLecture error ${error}` });
  }
}


//get Creator

export const getCreatorById = async (req, res) => {
  try {
    const {userId} = req.body

    const user = await User.findById(userId).select("-password")

    if(!user) {
      return res.status(404).json({msg : "User is not Found"})
    }
      return res.status(200).json(user)

  } catch (error) {
    return res.status(500).json({ msg: `Failed to get Creator ${error}` });
    
  }
}