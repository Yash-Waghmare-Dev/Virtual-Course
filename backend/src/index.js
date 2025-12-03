import express  from "express";
import dotenv from 'dotenv'
import connectDB from "../config/connectDB.js";
import cookieParser from 'cookie-parser'
import authRouter from "../route/authRoute.js";
dotenv.config();




const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json())
app.use(cookieParser())



app.use('/api/auth',authRouter )

app.get('/', (req, res) => {
    res.send("Hello")
})


app.listen(PORT, () => {
    console.log("Server Started", PORT);
    connectDB()
})