//JWT generator
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function generateSessionToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}
