document.addEventListener("DOMContentLoaded", () => {


const authGate = document.getElementById("auth-gate");

const step1 = document.getElementById("auth-step-1");
const step2 = document.getElementById("auth-step-2");


const authBtn = document.getElementById("auth-submit");
const otpBtn = document.getElementById("otp-submit");


const nameInput = document.getElementById("user-name");
const emailInput = document.getElementById("user-email");
const phoneInput = document.getElementById("user-phone");


const otpInput = document.getElementById("otp-input");


const authError = document.getElementById("auth-error");
const otpError = document.getElementById("otp-error");


const chatWorkspace =
document.getElementById("chat-workspace");


const chatMessages =
document.getElementById("chat-messages");


const chatInput =
document.getElementById("chat-input");


const sendBtn =
document.getElementById("chat-send");


const clearBtn =
document.getElementById("clear-chat-btn");


const newChatBtn =
document.getElementById("new-chat-btn");



let userName = "";



/* =====================
   ذخیره کاربر
===================== */


let savedUser =
localStorage.getItem("amirAI_user");



if(savedUser){

    userName = savedUser;

    openChat();

}






/* =====================
   ورود مرحله اول
===================== */


authBtn.addEventListener("click",()=>{


if(
nameInput.value.trim()==="" ||
emailInput.value.trim()==="" ||
phoneInput.value.trim()===""
){


authError.innerHTML =
"لطفا همه اطلاعات را وارد کنید ❌";


return;


}



userName =
nameInput.value.trim();



authError.innerHTML="";


step1.style.display="none";

step2.style.display="block";



});







/* =====================
   تایید کد
===================== */


otpBtn.addEventListener("click",()=>{


if(otpInput.value !== "1234"){


otpError.innerHTML =
"کد اشتباه است (تست: 1234) ❌";


return;


}



localStorage.setItem(
"amirAI_user",
userName
);



openChat();



});







function openChat(){


authGate.style.display="none";


chatWorkspace.style.display="flex";



loadMessages();



if(chatMessages.innerHTML===""){


addMessage(
"سلام "+userName+" 👋🤖\nمن Amir AI هستم. آماده‌ام کمک کنم.",
"bot"
);


}


}









/* =====================
   ارسال پیام
===================== */


sendBtn.addEventListener("click",sendMessage);



chatInput.addEventListener(
"keypress",
(e)=>{


if(e.key==="Enter"){

sendMessage();

}


});







function sendMessage(){


let text =
chatInput.value.trim();



if(text==="") return;



addMessage(text,"user");


chatInput.value="";



showTyping();



setTimeout(()=>{


removeTyping();


addMessage(
getAIReply(text),
"bot"
);



},1000);



}









/* =====================
   نمایش پیام
===================== */


function addMessage(text,type){


let msg =
document.createElement("div");


msg.className =
"message "+type;



msg.innerHTML =
text.replace(/\n/g,"<br>");



chatMessages.appendChild(msg);



saveMessages();



chatMessages.scrollTop =
chatMessages.scrollHeight;



}









/* =====================
   جواب AI
===================== */


function getAIReply(text){


text=text.toLowerCase();



if(text.includes("سلام"))

return "سلام 👋 خوش اومدی به Amir AI";



if(text.includes("کدنویسی") || text.includes("برنامه"))

return "عالیه 💻 بگو چه چیزی میخوای بسازی";



if(text.includes("html"))

return "HTML ساختار صفحه وب را می‌سازد 🌐";



if(text.includes("css"))

return "CSS ظاهر و طراحی سایت را کنترل می‌کند 🎨";



if(text.includes("تو کی هستی"))

return "من Amir AI هستم 🤖 دستیار هوشمند شما";



return "جالبه 🤔 بیشتر توضیح بده تا بهتر کمکت کنم";



}








/* =====================
   ذخیره چت
===================== */


function saveMessages(){


localStorage.setItem(
"amirAI_chat",
chatMessages.innerHTML
);


}





function loadMessages(){


let old =
localStorage.getItem(
"amirAI_chat"
);



if(old){

chatMessages.innerHTML=old;

}


}








/* =====================
   حالت تایپ
===================== */


function showTyping(){


let typing =
document.createElement("div");


typing.id="typing";


typing.className="message bot";


typing.innerHTML=
"Amir AI در حال فکر کردن... 🤖";


chatMessages.appendChild(typing);



}



function removeTyping(){


let typing =
document.getElementById("typing");



if(typing){

typing.remove();

}


}








/* =====================
   پاک کردن چت
===================== */


if(clearBtn){


clearBtn.onclick=()=>{


chatMessages.innerHTML="";


localStorage.removeItem(
"amirAI_chat"
);


};


}







/* =====================
   چت جدید
===================== */


if(newChatBtn){


newChatBtn.onclick=()=>{


chatMessages.innerHTML="";


addMessage(
"گفتگوی جدید شروع شد 🚀",
"bot"
);


};


}



});