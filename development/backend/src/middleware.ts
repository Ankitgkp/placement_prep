import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import 'dotenv/config';
const JWT_SECRET = process.env.JWT_SECRET;

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token!, JWT_SECRET!);
        req.body.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
