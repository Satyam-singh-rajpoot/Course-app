import express from "express";
import { login, signup , logout, purchases} from "../controllers/userController.js";
import { middleware } from "../middlewares/userMid.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout)
router.get("/purchases",middleware, purchases)

export default router;