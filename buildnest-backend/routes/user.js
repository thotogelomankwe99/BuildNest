import express from "express";
const router = express.Router();
import { saveUser, getUser } from "../controllers/userController.js";

// Save user after Firebase signup
router.post("/save-user", saveUser);

// Fetch user by UID
router.get("/get-user/:uid", getUser);

export default router;
