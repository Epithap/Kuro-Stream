Quick Firebase setup for Kuro-Stream

1) Register web app in Firebase Console
   - In your Firebase project, add a Web app and copy the config values.

2) Create `.env.local` at project root (copy from `.env.example`) and fill values
   - Do NOT commit `.env.local`.
   - Example keys: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.

3) Authorized domains
   - Go to Firebase Console > Authentication > Sign-in method > Authorized domains
   - Add `localhost:5173` and `localhost:5174` for local dev and your production domain (e.g. `your-site.vercel.app`).

4) Firestore rules
   - Apply the rules in `firestore.rules` via the Firebase Console (Rules tab) or `firebase deploy --only firestore:rules`.
   - The provided rules restrict `users` documents to their owners and admins.

5) Vercel / Production
   - Add the same `VITE_FIREBASE_*` env vars to your Vercel project settings (Environment Variables).
   - Redeploy after setting env vars.

6) Troubleshooting `auth/invalid-credential` on sign-in
   - Ensure the web app config (apiKey, appId, projectId) matches the Firebase project.
   - Ensure authorized domains include the hostname you're using.
   - Check browser console for detailed error code (we log codes in AuthContext).
   - Verify system clock and network connectivity.

7) Admin users
   - For admin functionality, assign a custom claim `admin=true` via Firebase Admin SDK on the server
     or create an `admins` collection and update `isAdmin()` in the rules accordingly.

If you want, I can apply these steps for you (set env vars, update Firebase rules) if you provide access or the required values.
