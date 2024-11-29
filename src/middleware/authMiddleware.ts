import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import DataStoredInToken from '../interfaces/DataStoredInToken';
import User from '../models/User';

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return next(new AuthenticationTokenMissingException());
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
    const userId = verificationResponse.id;

    const user = await User.findById(userId);
    if (!user) {
      return next(new WrongAuthenticationTokenException());
    }

    req.user = {
      id: userId,
      // Add other user properties if needed
    };

    next();
  } catch (error) {
    next(new WrongAuthenticationTokenException());
  }
}

export default authMiddleware;