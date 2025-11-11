import express ,{Router}from 'express'
import { protectRoute } from '../utils/authMiddleware.js'
import { updateProfile, getAllUsers, sendFriendRequest, acceptFriendRequest, getFriendRequests, getFriends } from '../controller/user.controller.js'

const router = Router();


router.put("/update",protectRoute,updateProfile);
router.get("/all", protectRoute, getAllUsers);
router.post("/send-request/:recipientId", protectRoute, sendFriendRequest);
router.post("/accept-request/:senderId", protectRoute, acceptFriendRequest);
router.get("/requests", protectRoute, getFriendRequests);
router.get("/friends", protectRoute, getFriends);

export default router;
