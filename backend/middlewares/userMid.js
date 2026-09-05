import jwt from "jsonwebtoken";

export const middleware = (req, res, next) => {
    const cookieToken = req.cookies.token;
    const authorization = req.headers.authorization;
    const bearerToken = authorization?.startsWith("Bearer ")
        ? authorization.slice(7)
        : null;
    const token = cookieToken || bearerToken;
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId || decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }

}
