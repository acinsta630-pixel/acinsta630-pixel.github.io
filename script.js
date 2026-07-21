// ===============================
// Amir AI PRO v9
// Part 1
// ===============================


// عناصر صفحه

const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatMessages = document.getElementById("chat-messages");


// اگر صفحه کامل لود نشده بود

if(!chatInput || !chatSend || !chatMessages){

    console.error("Chat elements not found");

}


// ===============================
// حافظه
// ===============================


let memory = JSON.parse(
    localStorage.getItem("amir_ai_memory")
) || {};


let learned = JSON.parse(
    localStorage.getItem("amir_learned")
) || [];


let chatHistory = JSON.parse(
    localStorage.getItem("amir_chat_history")
) || [];



let unknownQuestions = JSON.parse(
    localStorage.getItem("amir_unknown")
) || [];




// ===============================
// ذخیره
// ===============================


function saveMemory(){

localStorage.setItem(
"amir_ai_memory",
JSON.stringify(memory)
);

}



function saveLearned(){

localStorage.setItem(
"amir_learned",
JSON.stringify(learned)
);

}



function saveChat(){

localStorage.setItem(
"amir_chat_history",
JSON.stringify(chatHistory)
);

}



function saveUnknown(){

localStorage.setItem(
"amir_unknown",
JSON.stringify(unknownQuestions)
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
// شروع چت
// ===============================


function start(){

chatMessages.innerHTML="";


chatHistory.forEach(msg=>{


addMessage(
msg.text,
msg.type
);


});


}



start();



// ===============================
// ارسال پیام
// ===============================


if(chatSend){


chatSend.onclick = sendMessage;


}



if(chatInput){


chatInput.addEventListener(
"keydown",
function(e){


if(e.key==="Enter"){

sendMessage();

}


});


}



function sendMessage(){


let text =
chatInput.value.trim();



if(!text)return;



addMessage(
text,
"user"
);



chatHistory.push({

text:text,

type:"user"

});


saveChat();



chatInput.value="";



setTimeout(()=>{


let answer =
think(text);



addMessage(
answer,
"bot"
);



chatHistory.push({

text:answer,

type:"bot"

});


saveChat();



},500);



}


// ===============================
// ساخت پیام
// ===============================


function addMessage(text,type){


let div =
document.createElement("div");


div.className =
"message "+type;


div.textContent=text;


chatMessages.appendChild(div);


chatMessages.scrollTop =
chatMessages.scrollHeight;


}
// ===============================
// Amir AI PRO v9
// Part 2
// مغز و یادگیری
// ===============================



// ===============================
// آموزش جدید
// ===============================


function addLearned(question,answer){


let old =
learned.find(item =>

item.keywords.includes(question)

);



if(old){


if(!old.answers.includes(answer)){


old.answers.push(answer);


}


}

else{


learned.push({

keywords:[
question
],

answers:[
answer
]


});


}



saveLearned();


}






// ===============================
// حافظه شخصی
// ===============================


function learn(key,value){


memory[key]=value;


saveMemory();


}







// ===============================
// فکر کردن AI
// ===============================


function think(text){



text =
normalize(text);





// -------------------------------
// آموزش دستی
// مثال:
// یاد بگیر ماینکرفت چیست = بازی ساخت و ساز
// -------------------------------


let teach =
text.match(
/یاد بگیر (.+) = (.+)/
);



if(teach){


let question =
teach[1].trim();



let answer =
teach[2].trim();



addLearned(
question,
answer
);



return "یاد گرفتم 🧠✅";



}







// -------------------------------
// اسم کاربر
// -------------------------------


let name =
text.match(
/اسم من (.+)/
);



if(name){


learn(
"name",
name[1]
);



return "خوشبختم "
+name[1]
+" 😊 اسمت رو ذخیره کردم.";


}







if(
text.includes("اسمم چیه")
){



if(memory.name){


return "اسم شما "
+memory.name
+" است 😊";


}



return "هنوز اسمت رو نمی‌دونم.";


}








// -------------------------------
// علاقه
// -------------------------------


let fav =
text.match(
/من (.+) دوست دارم/
);



if(fav){



learn(
"favorite",
fav[1]
);



return "یاد گرفتم که "
+fav[1]
+" رو دوست داری 😎";


}







if(
text.includes("چی دوست دارم")
){


if(memory.favorite){


return "تو "
+memory.favorite
+" رو دوست داری.";


}


return "هنوز علاقه‌ات رو نمی‌دونم.";


}








// -------------------------------
// آموزش‌هایی که خودش یاد گرفته
// -------------------------------


let learnedAnswer =
searchKnowledge(
learned,
text
);



if(learnedAnswer){


return learnedAnswer;


}








// -------------------------------
// سوال‌های ناشناخته
// -------------------------------


saveUnknownQuestion(text);



return random([


"این رو هنوز یاد نگرفتم 🤔",

"جالبه! ذخیره‌اش کردم 🧠",

"دارم یاد می‌گیرم 😎"


]);



}







// ===============================
// جستجو در حافظه
// ===============================


function searchKnowledge(data,text){



let clean =
normalize(text);



for(let item of data){



for(let key of item.keywords){



if(
clean.includes(
normalize(key)
)
){



return random(
item.answers
);



}



}



}



return null;



}







// ===============================
// ذخیره سوال ناشناخته
// ===============================


function saveUnknownQuestion(text){



let exists =
unknownQuestions.some(q=>

normalize(q.question)
===
normalize(text)

);



if(!exists){


unknownQuestions.push({

question:text,

date:
new Date().toLocaleString()

});


saveUnknown();


}



}






// ===============================
// جواب تصادفی
// ===============================


function random(arr){


return arr[
Math.floor(
Math.random()*arr.length
)
];


}



console.log(
"🤖 Amir AI PRO v9 Loaded"
);