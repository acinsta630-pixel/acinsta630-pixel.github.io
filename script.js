// ===============================
// Amir AI PRO v10
// Firebase Online Memory
// Part 1
// ===============================


// ===============================
// Firebase اتصال
// ===============================

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import { 
getDatabase,
ref,
set,
get,
push,
onValue
} from 
"https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";



// تنظیمات Firebase

const firebaseConfig = {

apiKey: "AIzaSyC7gBh82OArlYcAVrjEKJfqCcK_VbO8eZg",

authDomain: "aimysite-249db.firebaseapp.com",

databaseURL:
"https://aimysite-249db-default-rtdb.firebaseio.com",

projectId: "aimysite-249db",

storageBucket:
"aimysite-249db.firebasestorage.app",

messagingSenderId:
"963797429490",

appId:
"1:963797429490:web:bd50781dde6939959e746b",

measurementId:
"G-KF6216EB3K"

};



// شروع Firebase

const app =
initializeApp(firebaseConfig);



const db =
getDatabase(app);





console.log(
"🔥 Firebase Connected"
);





// ===============================
// عناصر چت
// ===============================


const chatInput =
document.getElementById(
"chat-input"
);


const chatSend =
document.getElementById(
"chat-send"
);


const chatMessages =
document.getElementById(
"chat-messages"
);





// ===============================
// حافظه آنلاین
// ===============================


let memory = {};

let learned = [];

let chatHistory = [];

let unknownQuestions = [];






// ===============================
// گرفتن حافظه از Firebase
// ===============================


async function loadAI(){


try{


const memorySnap =
await get(
ref(db,"amirAI/memory")
);


if(memorySnap.exists()){

memory =
memorySnap.val();

}




const learnedSnap =
await get(
ref(db,"amirAI/learned")
);



if(learnedSnap.exists()){


learned =
learnedSnap.val();


}





const chatSnap =
await get(
ref(db,"amirAI/chats")
);



if(chatSnap.exists()){


chatHistory =
chatSnap.val();


}




console.log(
"🧠 AI Memory Loaded",
memory
);


console.log(
"📚 Learned Loaded",
learned
);



loadChatHistory();



}
catch(error){


console.log(
"Firebase Load Error",
error
);


}



}



loadAI();







// ===============================
// ذخیره حافظه آنلاین
// ===============================


function saveMemory(){


set(

ref(db,"amirAI/memory"),

memory

);


}




function saveLearned(){


set(

ref(db,"amirAI/learned"),

learned

);


}




function saveChat(){


set(

ref(db,"amirAI/chats"),

chatHistory

);


}






// ===============================
// تمیز کردن متن
// ===============================


function normalize(text){


return text

.toLowerCase()

.replace(/[؟?!.,]/g,"")

.replace(/\s+/g," ")

.trim();


}






// ===============================
// پیام‌ها
// ===============================


function addMessage(text,type){


let div =
document.createElement(
"div"
);



div.className =
"message "+type;



div.textContent =
text;



chatMessages.appendChild(
div
);



chatMessages.scrollTop =
chatMessages.scrollHeight;


}




// ===============================
// نمایش تاریخچه
// ===============================


function loadChatHistory(){


chatMessages.innerHTML="";


chatHistory.forEach(msg=>{


addMessage(

msg.text,

msg.type

);


});


}




console.log(
"🟢 Amir AI v10 Part 1 Ready"
);
