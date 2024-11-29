import express from 'express';
import { register, login } from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected route: Fetch user profile
router.get('/profile', authMiddleware, (req, res) => {
  const user = req.user; // This is populated by the middleware
  res.status(200).json({ message: 'User profile data', user });
});

export default router;
