import express, { Router } from 'express';
import { protectRoute } from '../utils/authMiddleware.js';
import { getMatches, getUserProfiles, swipeLeft, swipeRight } from '../controller/match.controller.js';


const router = Router();

router.post('/right/:likeUserId', protectRoute, swipeRight);
router.post('/left/:disLikeUserId', protectRoute, swipeLeft);

router.get('/',protectRoute,getMatches)
router.get("/user-profiles", protectRoute, getUserProfiles);

export default router;