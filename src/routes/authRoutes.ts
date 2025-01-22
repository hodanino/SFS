import express from 'express';
import { register, login } from '../controllers/loginController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authMiddleware, (req, res) => {
  const user = req.user; 
  res.status(200).json({ message: 'User profile data', user });
});

export default router;
