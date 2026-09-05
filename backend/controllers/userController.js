import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Purchase from "../models/purchaseModel.js";
import Course from "../models/courseModel.js";



export const signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try{
     if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
     }
     const existingUser = await User.findOne({ email });
     if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
     }

     const hashedPassword = await bcrypt.hash(password, 10);

     const newUser = new User({ firstname, lastname, email, password: hashedPassword });
     await newUser.save();
     res.status(201).json({ message: "User signup successfully",newUser });
  }catch(error){
   
    res.status(500).json({ message: "Internal server error" });
  }
  }

  export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      res.cookie("token", token, { httpOnly: true,secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 });

      res.status(200).json({ message: "Login successful", user , token});
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  export const logout = (req, res) => {
    try{
      res.clearCookie("token");
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  export const purchases = async (req, res) => {
    const userId = req.userId;
    try{
        const purchased = await Purchase.find({userId})

        let purchasedCourseId = [];

        for(let i=0;i<purchased.length;i++){
          purchasedCourseId.push(purchased[i].courseId);

          
        }
        const courseData = await Course.find({
            _id:{ $in: purchasedCourseId}
          })
        
        res.status(200).json({ purchased , courseData });
    }catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
}
