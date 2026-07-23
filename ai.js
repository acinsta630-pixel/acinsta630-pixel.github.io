// =====================================
// Amir AI - Final ai.js (Firebase + OpenRouter API)
// Part 1: Imports, Firebase Setup & Core AI Engine
// =====================================

// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC7gBh82OArlYcAVrjEKJfqCcK_VbO8eZg",
  authDomain: "aimysite-249db.firebaseapp.com",
  databaseURL: "https://aimysite-249db-default-rtdb.firebaseio.com",
  projectId: "aimysite-249db",
  storageBucket: "aimysite-249db.firebasestorage.app",
  messagingSenderId: "963797429490",
  appId: "1:963797429490:web:bd50781dde6939959e746b"
};

// Start Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log("🔥 Firebase Connected");

// OpenRouter API Key
const OPENROUTER_API_KEY = "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";

// Real AI Request Function
async function askAI(userText) {
  try {
    const response = await fetch("https://acinsta630-pixel-github-io.vercel.app/api/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-chat",
        "messages": [
          { "role": "user", "content": userText }
        ]
      })
    });

    const data = await response.json();
    console.log("پاسخ دریافتی:", data);

    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content;
    } else if (data.error && data.error.message) {
      return `خطای سرور: ${data.error.message}`;
    } else {
      return "خطا در دریافت پاسخ از هوش مصنوعی.";
    }

  } catch (error) {
    console.error("❌ خطا در اتصال به هوش مصنوعی:", error);
    return "ارتباط با سرور هوش مصنوعی برقرار نشد!";
  }
}

// ===============================
// ELEMENTS
// ===============================

const authGate = document.getElementById("auth-gate");
const authStep1 = document.getElementById("auth-step-1");
const authStep2 = document.getElementById("auth-step-2");

const authSubmit = document.getElementById("auth-submit");
const otpSubmit = document.getElementById("otp-submit");

const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userPhone = document.getElementById("user-phone");

const otpInput = document.getElementById("otp-input");

const authError = document.getElementById("auth-error");
const otpError = document.getElementById("otp-error");

const chatWorkspace = document.getElementById("chat-workspace");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const newChatBtn = document.getElementById("new-chat-btn");
const chatList = document.getElementById("chat-list");
const clearChatBtn = document.getElementById("clear-chat-btn");

// ===============================
// DATA
// ===============================

let chats = [];
let activeChat = null;

// ===============================
// CHECK LOGIN AFTER REFRESH
// ===============================

window.addEventListener("load", () => {
  const user = localStorage.getItem("amirAI_user");
  if (user) {
    openChat();
  }
});

// ===============================
// STEP 1 LOGIN
// ===============================

if (authSubmit) {
  authSubmit.addEventListener("click", () => {
    const name = userName.value.trim();
    const email = userEmail.value.trim();
    const phone = userPhone.value.trim();

    if (name === "" || email === "" || phone === "") {
      authError.innerHTML = "لطفاً همه اطلاعات را وارد کنید";
      return;
    }

    if (!email.includes("@")) {
      authError.innerHTML = "ایمیل معتبر نیست";
      return;
    }

    const user = { name, email, phone };
    localStorage.setItem("amirAI_temp", JSON.stringify(user));

    authStep1.style.display = "none";
    authStep2.style.display = "block";
  });
}

// ===============================
// OTP CHECK
// ===============================

if (otpSubmit) {
  otpSubmit.addEventListener("click", () => {
    const code = otpInput.value.trim();

    if (code.length !== 4) {
      otpError.innerHTML = "کد باید ۴ رقمی باشد";
      return;
    }

    const user = localStorage.getItem("amirAI_temp");
    localStorage.setItem("amirAI_user", user);
    localStorage.removeItem("amirAI_temp");

    // ثبت کاربر در فایربیس
    try {
      const parsedUser = JSON.parse(user);
      set(ref(db, "users/" + Date.now()), parsedUser);
    } catch(e) {}

    openChat();
  });
}

// ===============================
// OPEN CHAT
// ===============================

function openChat() {
  if (authGate) authGate.style.display = "none";
  if (chatWorkspace) chatWorkspace.style.display = "flex";
  loadChats();
}

// ===============================
// LOAD & SAVE CHATS (BUG FIX)
// ===============================

function loadChats() {
  const saved = localStorage.getItem("amirAI_chats");
  if (saved) {
    try {
      chats = JSON.parse(saved);
    } catch (e) {
      chats = [];
    }
  }

  if (!Array.isArray(chats) || chats.length === 0) {
    createChat();
  } else {
    // تضمین فعال بودن اولین چت پس از باز شدن
    activeChat = chats[0].id;
    renderChats();
    showMessages();
  }
}

function saveChats() {
  localStorage.setItem("amirAI_chats", JSON.stringify(chats));
}

// ===============================
// CREATE NEW CHAT (FIXED WELCOME MSG)
// ===============================

function createChat() {
  const chat = {
    id: Date.now(),
    title: "گفتگوی جدید",
    messages: [
      { text: "سلام! من AI امیر هستم. چطور می‌تونم کمکت کنم؟", type: "bot" } // پیام خوش‌آمدگویی رسمی ثبت میشه
    ],
    time: new Date().toLocaleString("fa-IR")
  };

  chats.unshift(chat);
  activeChat = chat.id;

  saveChats();
  renderChats();
  showMessages();
}

// ===============================
// RENDER HISTORY
// ===============================

function renderChats() {
  if (!chatList) return;
  chatList.innerHTML = "";

  chats.forEach(chat => {
    const li = document.createElement("li");
    li.className = "history-item";
    if (chat.id === activeChat) li.classList.add("active");

    li.innerHTML = `
      <div class="history-main">
        <div class="history-icon">💬</div>
        <div>
          <div class="history-title">${chat.title}</div>
          <div class="history-time">${chat.time}</div>
        </div>
      </div>
      <div class="history-actions">
        <button class="rename-chat">✏️</button>
        <button class="delete-chat">🗑️</button>
      </div>
    `;

    // OPEN CHAT
    li.querySelector(".history-main").onclick = () => {
      activeChat = chat.id;
      renderChats();
      showMessages();
    };

    // RENAME
    li.querySelector(".rename-chat").onclick = (e) => {
      e.stopPropagation();
      const name = prompt("نام جدید:", chat.title);
      if (name && name.trim()) {
        chat.title = name.trim();
        saveChats();
        renderChats();
      }
    };

    // DELETE
    li.querySelector(".delete-chat").onclick = (e) => {
      e.stopPropagation();
      chats = chats.filter(c => c.id !== chat.id);

      if (chats.length === 0) {
        createChat();
        return;
      }

      activeChat = chats[0].id;
      saveChats();
      renderChats();
      showMessages();
    };

    chatList.appendChild(li);
  });
}

// ===============================
// SHOW MESSAGES
// ===============================

function showMessages() {
  if (!chatMessages) return;
  chatMessages.innerHTML = "";

  const chat = chats.find(c => c.id === activeChat);
  if (!chat) return;

  chat.messages.forEach(msg => {
    addMessage(msg.text, msg.type);
  });
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = type === "bot" ? "message bot ai-bubble" : "message user user-bubble";
  div.innerHTML = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ===============================
// SEND MESSAGE (AUTO-RECOVERY BUG FIX)
// ===============================

async function sendMessage() {
  const text = chatInput.value.trim();
  if (text === "") return;

  // بازیابی خودکار چت فعال در صورت خالی بودن activeChat
  let chat = chats.find(c => c.id === activeChat);
  if (!chat) {
    if (chats.length > 0) {
      activeChat = chats[0].id;
      chat = chats[0];
    } else {
      createChat();
      chat = chats.find(c => c.id === activeChat);
    }
  }

  // ۱. افزودن پیام کاربر به دیتابیس محلی
  chat.messages.push({ text: text, type: "user" });

  if (chat.title === "گفتگوی جدید") {
    chat.title = text.substring(0, 25);
  }

  chat.time = new Date().toLocaleString("fa-IR");

  saveChats();
  renderChats();
  showMessages();

  chatInput.value = "";

  // ۲. نمایش حالت در حال فکر کردن
  showThinking();

  // ۳. ارسال درخواست واقعی به AI
  const aiReply = await askAI(text);

  // ۴. حذف انیمیشن فکر کردن و تایپ پاسخ واقعی
  removeThinking();
  typeAIMessage(aiReply);
}

// مدیریت کلیک دکمه ارسال (یکپارچه برای دسکتاپ و لمس موبایل)
if (chatSend) {
  chatSend.onclick = (e) => {
    e.preventDefault();
    sendMessage();
  };
}

// مدیریت کلید Enter در کیبورد گوشی و کامپیوتر
if (chatInput) {
  chatInput.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
}

// ===============================
// THINKING ANIMATION
// ===============================

function showThinking() {
  const div = document.createElement("div");
  div.id = "ai-thinking";
  div.className = "message bot thinking";
  div.innerHTML = `<span></span><span></span><span></span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeThinking() {
  const item = document.getElementById("ai-thinking");
  if (item) item.remove();
}

// ===============================
// AI TYPING EFFECT
// ===============================

function typeAIMessage(text) {
  const div = document.createElement("div");
  div.className = "message bot ai-bubble";
  chatMessages.appendChild(div);

  let index = 0;
  const timer = setInterval(() => {
    div.innerHTML += text[index];
    index++;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (index >= text.length) {
      clearInterval(timer);

      const chat = chats.find(c => c.id === activeChat);
      if (chat) {
        chat.messages.push({ text: text, type: "bot" });
        saveChats();
      }
    }
  }, 25);
}

// ===============================
// CLEAR CHAT
// ===============================

if (clearChatBtn) {
  clearChatBtn.onclick = () => {
    const chat = chats.find(c => c.id === activeChat);
    if (chat) {
      chat.messages = [];
      saveChats();
      showMessages();
    }
  };
}