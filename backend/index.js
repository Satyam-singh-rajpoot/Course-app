import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import courseRoutes from "./routes/courseRoute.js";
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRoute.js";
import cors from "cors"


const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
//middleware
app.use(express.json());
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(cors({
    origin: process.env.FRONTEND_URL,
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