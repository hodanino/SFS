import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/DataStoredInToken';
import User from '../models/User';

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log("AuthMiddleware: Verifying token");

    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AuthenticationTokenMissingException());
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.JWT_SECRET!;
        const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
        const userId = verificationResponse.id;

        const user = await User.findById(userId);
        if (!user) {
            console.error("User not found for ID:", userId);
            return next(new WrongAuthenticationTokenException());
        }

        req.user = {
            id: userId,
            role: user.role,
        };

        console.log("AuthMiddleware: Token verified, user authenticated:", req.user);
        next();
    } catch (error) {
        console.error("AuthMiddleware: JWT verification error:", error);
        next(new WrongAuthenticationTokenException());
    }
}

export default authMiddleware;
