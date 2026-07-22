// =================================
// Amir AI Engine (Firebase + Gemini)
// =================================

// 1. Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// 2. Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC7gBh82OArlYcAVrjEKJfqCcK_VbO8eZg",
  authDomain: "aimysite-249db.firebaseapp.com",
  databaseURL: "https://aimysite-249db-default-rtdb.firebaseio.com",
  projectId: "aimysite-249db",
  storageBucket: "aimysite-249db.firebasestorage.app",
  messagingSenderId: "963797429490",
  appId: "1:963797429490:web:bd50781dde6939959e746b"
};

// 3. Start Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log("🔥 Firebase Connected");

// تست اتصال دیتابیس
set(ref(db, "amirAI/test"), {
  message: "Amir AI Online",
  time: new Date().toString()
})
.then(() => console.log("✅ Data Sent To Firebase"))
.catch((error) => console.log("❌ Firebase Error:", error));


// =================================
// 4. موتور هوش مصنوعی (Gemini AI)
// =================================

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
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("پاسخ نامعتبر از API:", data);
      return "خطا در دریافت پاسخ از هوش مصنوعی.";
    }

  } catch (error) {
    console.error("❌ خطا در اتصال به هوش مصنوعی:", error);
    return "ارتباط با سرور هوش مصنوعی برقرار نشد!";
  }
};


// =================================
// 5. مدیریت ارسال پیام در صفحه ai.html
// =================================

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  if (sendBtn && userInput && chatBox) {
    
    async function handleSend() {
      const text = userInput.value.trim();
      if (!text) return;

      // ۱. نمایش پیام کاربر
      chatBox.innerHTML += `<div class="user-msg"><b>شما:</b> ${text}</div>`;
      userInput.value = "";

      // ۲. نمایش وضعیت در حال فکر کردن
      const loadingDiv = document.createElement("div");
      loadingDiv.className = "ai-msg";
      loadingDiv.innerText = "Amir AI: در حال فکر کردن...";
      chatBox.appendChild(loadingDiv);
      chatBox.scrollTop = chatBox.scrollHeight;

      // ۳. گرفتن پاسخ هوش مصنوعی
      const aiReply = await window.askAI(text);

      // ۴. جاگذاری پاسخ اصلی
      loadingDiv.innerHTML = `<b>Amir AI:</b> ${aiReply}`;
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    sendBtn.addEventListener("click", handleSend);

    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSend();
    });
  }
});