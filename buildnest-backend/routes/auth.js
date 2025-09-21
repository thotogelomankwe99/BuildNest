import express from "express";
import db from "../db.js";
import admin from "../firebase.js";
const router = express.Router();
import { manualSignup, manualLogin } from "../controllers/authController.js";


// Manual signup route
router.post("/manual-signup", manualSignup);

// Manual login route
router.post("/manual-login", manualLogin);
// Firebase login/signup endpoint

router.post("/login-firebase", async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const fullName = decodedToken.name || "No Name";

    const [rows] = await db.query("SELECT * FROM users WHERE firebase_uid = ?", [uid]);

    if (rows.length === 0) {
      await db.query(
        "INSERT INTO users (full_name, email, firebase_uid) VALUES (?, ?, ?)",
        [fullName, email, uid]
      );
    }

    res.json({ message: "Login successful", uid, email, fullName });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});


export default router;
