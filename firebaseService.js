// firebaseService.js

const admin = require("firebase-admin");
const path = require("path");

// Path to your service account JSON file
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    // Optional: you can set databaseURL if needed
    // databaseURL: "https://<your-project-id>.firebaseio.com"
  });
}

module.exports = admin;

