import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import admin from "firebase-admin";
import dotenv from "dotenv";

// Import route files
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());


// Use routes
app.use("/auth", authRoutes);
app.use("/api", userRoutes);


// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
});

// MySQL pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Firebase login route
app.post("/api/firebase-login", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: "Token missing" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists in MySQL
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      await db.query("INSERT INTO users (uid, email, full_name) VALUES (?, ?, ?)", [
        uid,
        email,
        name || "",
        picture || "",
      ]);
    }

    res.json({ message: "Login successful", uid, email, name });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
