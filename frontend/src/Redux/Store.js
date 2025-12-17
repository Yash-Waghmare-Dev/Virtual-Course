import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js"
import courseSlice from "./courseSlice.js"
import lectureSlice from "./lectureSlice.js"
import reviewSlice from "./reviewSlice.js"
export const Store = configureStore({
    reducer : {
        user : userSlice,
        course : courseSlice,
        lecture : lectureSlice,
        review : reviewSlice,
    }
})

