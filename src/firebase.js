/**
 * Firebase Configuration
 *
 * ⚠️  SETUP:
 * 1. Go to https://console.firebase.google.com/
 * 2. Click "Create a project" (or use existing)
 * 3. Go to Project Settings (⚙️) → General → scroll to "Your apps"
 * 4. Click the web icon (</>) → Register app → copy the config
 * 5. Paste the values below
 * 6. Go to Firestore Database → Create database → Start in test mode
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 👇 PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
    apiKey: 'AIzaSyC7rQFUSQkd6R_EGz8pZTZZJpOVOjGrk7s',
    authDomain: 'kill-switch-login-page.firebaseapp.com',
    projectId: 'kill-switch-login-page',
    storageBucket: 'kill-switch-login-page.firebasestorage.app',
    messagingSenderId: '656384831346',
    appId: '1:656384831346:web:8937a50dd0dcd78c5837eb',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
