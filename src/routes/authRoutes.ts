import { Router } from 'express';
import { register, login, getMe, updateProfile, deleteProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken as any, getMe);
router.put('/update', authenticateToken as any, updateProfile);
router.delete('/delete', authenticateToken as any, deleteProfile);

export default router;
