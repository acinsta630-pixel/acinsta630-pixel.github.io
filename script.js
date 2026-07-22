// =================================
// Amir AI Engine (Firebase + Gemini)
// =================================

// ۱. فراخوانی کتابخانه‌های فایربیس
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// ۲. تنظیمات دیتابیس فایربیس
const firebaseConfig = {
  apiKey: "AIzaSyC7gBh82OArlYcAVrjEKJfqCcK_VbO8eZg",
  authDomain: "aimysite-249db.firebaseapp.com",
  databaseURL: "https://aimysite-249db-default-rtdb.firebaseio.com",
  projectId: "aimysite-249db",
  storageBucket: "aimysite-249db.firebasestorage.app",
  messagingSenderId: "963797429490",
  appId: "1:963797429490:web:bd50781dde6939959e746b"
};

// ۳. راه اندازی فایربیس
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log("🔥 Firebase Connected");

// تست ارسال اطلاعات به دیتابیس
set(ref(db, "amirAI/test"), {
  message: "Amir AI Online",
  time: new Date().toString()
})
.then(() => {
  console.log("✅ Data Sent To Firebase");
})
.catch((error) => {
  console.log("❌ Firebase Error:", error);
});

// تست خواندن اطلاعات از دیتابیس
get(ref(db, "amirAI/test")).then((snapshot) => {
  if (snapshot.exists()) {
    console.log("📦 Firebase Data:", snapshot.val());
  } else {
    console.log("Database Empty");
  }
});

// =================================
// ۴. موتور هوش مصنوعی (Gemini AI)
// =================================

// کلید API هوش مصنوعی
const GEMINI_API_KEY = "AQ.Ab8RN6K408EqxnM-D9iOoBRtUvUz6dcAFsw1IPird-hvX-1PxA";

window.askAI = async function(userText) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userText }] }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const aiReply = data.candidates[0].content.parts[0].text;
      console.log("🤖 پاسخ هوش مصنوعی:", aiReply);
      return aiReply;
    } else {
      console.error("پاسخ نامعتبر از API:", data);
      return "خطا در دریافت پاسخ از هوش مصنوعی.";
    }

  } catch (error) {
    console.error("❌ خطا در اتصال به هوش مصنوعی:", error);
    return "ارتباط با سرور هوش مصنوعی برقرار نشد!";
  }
};