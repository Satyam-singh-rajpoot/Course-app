import Course from "../models/courseModel.js";
import { v2 as cloudinary } from 'cloudinary';
import Purchase from "../models/purchaseModel.js";

export const createCourse = async (req, res) => {
  const { adminId } = req;
 const { title, description, price } = req.body;
 try{
   if (!title || !description || !price ) {
   return res.status(400).json({ message: "All fields are required" });
 }
 const {image} = req.files;
 if(!image) {
   return res.status(400).json({ message: "Image is required" });
 }

 const allowedFormat = ["image/jpeg", "image/jpg", "image/png"];
 if (!allowedFormat.includes(image.mimetype)) {
   return res.status(400).json({ message: "Invalid image type. Only JPEG, JPG, and PNG are allowed." });
 }

 const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)

 if(!cloud_response || !cloud_response.public_id || !cloud_response.secure_url) {
   return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
 }

 const courseData = new Course({ title, description, price, image: { public_id: cloud_response.public_id, url: cloud_response.url },creatorId:adminId });
 await courseData.save();
 res.status(201).json({ message: "Course created successfully",  courseData });
 }catch (error) {
    res.status(400).json({ message: error.message });
 }

};

export const updateCourse = async (req, res) =>{
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price,image } = req.body;
  try {
    const existingCourse = await Course.findOne({ _id: courseId, creatorId: adminId });
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    const course = await Course.findOneAndUpdate({
      _id: courseId,
      creatorId: adminId
    },  {
      title,
      description,
      price,
      image:{
        public_id: image?.public_id,
        url: image?.url
      }
    });
    if (!course) {
      return res.status(404).json({ message: "Course not update, it is created by other admin" });
    }
    res.status(200).json({ message: "Course updated successfully", course });
  }catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId
    });
    if (!course) {
      return res.status(404).json({ message: "can't delete, created by other admin" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const getAllCourses = async (req, res) => {
  try{
    const courses = await Course.find({});
    res.status(200).json({ courses });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try{
   const course = await Course.findById(courseId);
   if (!course) {
     return res.status(404).json({ message: "Course not found" });
   }
   res.status(200).json({ course });
  }catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const buyCourses = async (req, res) => {
  const {userId} = req;
  const { courseId } = req.params;
  try{
        const course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }
        const existingPurchase = await Purchase.findOne({userId,courseId}) 
        if(existingPurchase){
          return res.status(400).json({ message: "Course already purchased" });
        }

        const newPurchase = new Purchase({ userId, courseId });
        await newPurchase.save();
        res.status(200).json({ message: "Course purchased successfully" , newPurchase});
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
}

