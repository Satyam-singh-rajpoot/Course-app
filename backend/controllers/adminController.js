import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try{
     if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
     }
     const existingAdmin = await Admin.findOne({ email });
     if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
     }

     const hashedPassword = await bcrypt.hash(password, 10);

     const newAdmin = new Admin({ firstname, lastname, email, password: hashedPassword });
     await newAdmin.save();
     res.status(201).json({ message: "Admin signup successfully", newAdmin });
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
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_ADMIN, { expiresIn: "1d" });
      res.cookie("token", token, { httpOnly: true,secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 });

      res.status(200).json({ message: "Login successful", admin , token});
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  export const logout = (req, res) => {
    try{
        if (!req.cookies.jwt) {
            return res.status(400).json({ message: "Login first" });
        }
      res.clearCookie("token");
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
