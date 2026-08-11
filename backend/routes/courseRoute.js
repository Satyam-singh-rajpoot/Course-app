import express from "express";
import { createCourse, deleteCourse,getAllCourses, updateCourse,courseDetails ,buyCourses} from "../controllers/courseController.js";
import { middleware } from "../middlewares/userMid.js";
import { adminMiddleware } from "../middlewares/adminMid.js";

const router = express.Router();

router.post("/create",adminMiddleware ,createCourse);
router.put("/update/:courseId", adminMiddleware, updateCourse);
router.delete("/delete/:courseId", adminMiddleware, deleteCourse);

router.get("/courses", getAllCourses);
router.get("/:courseId", courseDetails);


router.post("/buy/:courseId",middleware,buyCourses);

export default router;
