const admin = require("firebase-admin")
require("dotenv").config()

// Read and normalize the private key from env. Support both literal newlines and escaped \n sequences,
// and tolerate values wrapped in quotes (common when storing in .env files).
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY

if (!process.env.FIREBASE_PROJECT_ID || !rawPrivateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
  // Allow using a service account JSON file instead of env vars.
  const svcPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  if (!svcPath) {
    console.error("Missing Firebase env vars. Ensure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL are set, or set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON file.")
    throw new Error("Firebase environment variables are not properly configured.")
  }
  // If a service account JSON path is provided, fallthrough to using it below.
}

// Strip surrounding quotes if present
let cleanedKey = rawPrivateKey
if ((cleanedKey.startsWith('"') && cleanedKey.endsWith('"')) || (cleanedKey.startsWith("'") && cleanedKey.endsWith("'"))) {
  cleanedKey = cleanedKey.slice(1, -1)
}

// Replace escaped newlines with actual newlines
cleanedKey = cleanedKey.replace(/\\n/g, "\n")

admin.initializeApp({
  credential: (() => {
    // Prefer a service account JSON file if provided (safer and easier).
    const svcPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    if (svcPath) {
      try {
        // Allow absolute or relative path
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const svc = require(svcPath)
        return admin.credential.cert(svc)
      } catch (err) {
        console.error("Failed to load service account file at", svcPath, err)
        // Fall back to using env vars below and rethrow if that also isn't available.
      }
    }

    // Use env vars (cleanedKey) if no service account file was used.
    return admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: cleanedKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  })()
})

const db = admin.firestore()

module.exports = db