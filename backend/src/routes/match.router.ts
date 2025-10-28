import express, { Router } from 'express';
import { protectRoute } from '../utils/authMiddleware.js';
import { getMatches, getUserProfiles, Left, Right } from '../controller/match.controller.js';


const router = Router();

router.post('/right/:likeUserId', protectRoute,Left);
router.post('/left/: disLikeUserId', protectRoute, Left);

router.get('/',protectRoute,getMatches)
router.get("/user-profiles", protectRoute, getUserProfiles);

export default router;