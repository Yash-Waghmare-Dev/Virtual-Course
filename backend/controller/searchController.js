
import Course from "../model/courseModel.js";

export const searchWithAi = async (req, res) => {
    try {
        const { input } = req.body;
        // Simulate AI search logic
        console.log("Searching with AI:", input);
        if (!input) {
            return res.status(400).json({ msg: "Input cannot be empty" });
        }
        const course = await Course.find({
            isPublished: true,
            $or: [
                { title: { $regex: input, $options: "i" } },
                { subtitle: { $regex: input, $options: "i" } },
                { description: { $regex: input, $options: "i" } },
                { category: { $regex: input, $options: "i" } },
                { level : { $regex: input, $options: "i" } },
            ],
        });
        return res.status(200).json(course);
    } catch (error) {
        console.error("Error in AI search:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}