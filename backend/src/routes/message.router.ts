import express, {Router} from 'express';
import { protectRoute } from '../utils/authMiddleware.js';
import { getConversation,sendMessage } from '../controller/message.controller.js';

const router = Router();

router.post('/send',protectRoute,sendMessage);
router.get('/conversation/:userId', protectRoute, getConversation);


export default router;