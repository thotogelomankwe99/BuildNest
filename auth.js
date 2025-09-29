import express from "express";
import db from "../db.js"; // adjust the path to your db.js

const router = express.Router();

// This route will be called from your frontend after Firebase signup/login
router.post("/save-user", async (req, res) => {
  try {
    const user = req.body; 
    // expect { uid, email, displayName }

    const [result] = await db.execute(
      "INSERT INTO users (firebase_uid, email, display_name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE email = VALUES(email), display_name = VALUES(display_name)",
      [user.uid, user.email, user.displayName]
    );

    res.json({ success: true, userId: result.insertId });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to save user" });
  }
});

export default router;
