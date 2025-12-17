import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../model/UserModel.js"

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrollCourses");
        if(!user){
            return res.status(404).json({msg : "user not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({msg : `get current user error ${error}`})
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const {name, description} =  req.body;
        let photoUrl;
        if(req.file){
            photoUrl = await uploadOnCloudinary(req.file.path);

        }
        const user = await User.findByIdAndUpdate(userId, {name, description, photoUrl},{new : true});
        if(!user){
            return res.status(404).json({msg : "user not found"})
        }
        await user.save();
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({msg : `Update Profile error ${error}`}) 
    }
}