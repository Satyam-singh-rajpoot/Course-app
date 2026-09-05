import jwt from "jsonwebtoken";

export const adminMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
        req.adminId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

}