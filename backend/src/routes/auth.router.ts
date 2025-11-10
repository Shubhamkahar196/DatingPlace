import express, { Router } from 'express';
import { signin,signup,logout ,getme } from '../controller/auth.controller.js';
import   {protectRoute} from "../middleware/auth.middleware.js";
const router = Router();

router.post("/signin",signin);
router.post("/signup",signup);
router.post("/logout",logout);

router.get('/me', protectRoute, getme)

export default router

