import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"
import courseRoutes from "./routes/courseRoute.js";
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRoute.js";



const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

const configuredOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    if (configuredOrigins.includes(origin)) return true;

    return /^https:\/\/course-app-to43-[a-z0-9-]+\.vercel\.app$/i.test(origin);
};

//middleware
app.use(express.json());
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cors({
    origin: (origin, callback) => {
        callback(null, isAllowedOrigin(origin));
    },
    credentials:true,
    methods:["GET", "POST", "PUT", "DELETE"],
    allowedHeaders:["Content-Type", "Authorization"]
}))

//database connection
try{
   await mongoose.connect(process.env.MONGO_URL);
   console.log("Connected to MongoDB");
}catch(error){
    console.error("Error connecting to MongoDB:");
}

//router
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);

cloudinary.config({ 
        cloud_name: process.env.Cloudinary_Cloud_Name, 
        api_key: process.env.Cloudinary_API_Key, 
        api_secret: process.env.Cloudinary_API_Secret
    });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});