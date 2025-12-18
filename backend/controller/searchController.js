
import Course from "../model/courseModel.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'

dotenv.config();

export const searchWithAi = async (req, res) => {
    try {
        const { input } = req.body;
        // Simulate AI search logic
        console.log("Searching with AI:", input);
        if (!input) {
            return res.status(400).json({ msg: "Input cannot be empty" });
        }

        const ai = new GoogleGenAI({
            apiKey : process.env.GEMINI_API_KEY
        });

        const prompt = `You are an Intelligent assistant for an Virtual Course Platform.
        A User will type any query about what they want to learn. your task is to understand the intent and return one **most relevent keyword** from the following list of course categories and levels:
        -App Development
        -AI/ML
        -AI Tools
        -Data Science
        -Data Analytics
        -Ethical Hacking 
        -UI UX Designing
        -Web Development
        -Others
        -Beginner
        -Intermediate
        -Advanced
        
        Only reply with one single keyword from the list above that best matches the query. Do not explain anything. No extra text.
        
        Query : ${input}`

       
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
    
  const keyword = response.text

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

        if(course.length > 0) {
            return res.status(200).json(course);
        }
        else{
           const course = await Course.find({
            isPublished: true,
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { subtitle: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { category: { $regex: keyword, $options: "i" } },
                { level : { $regex: keyword, $options: "i" } },
            ],
        });
            return res.status(200).json(course);
        }
    } catch (error) {
        console.error("Error in AI search:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}