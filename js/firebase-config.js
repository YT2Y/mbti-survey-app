// ==========================================
// Firebase 初期化
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyBXgFABlMizrD69s06MHY7vDUKz6TW1vZc",
  authDomain: "mbti-survey-app-2514c.firebaseapp.com",
  projectId: "mbti-survey-app-2514c",
  storageBucket: "mbti-survey-app-2514c.firebasestorage.app",
  messagingSenderId: "401468363780",
  appId: "1:401468363780:web:d44058e0f653b96b5f1151",
  measurementId: "G-44B0HXWS53"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
