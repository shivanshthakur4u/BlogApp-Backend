import express from "express";
import { registerUser, userSignIn } from "../controller/userController.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", userSignIn);

export default router;
