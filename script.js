// ===============================
// Amir AI PRO - Brain v2
// ===============================


// عناصر صفحه
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatMessages = document.getElementById("chat-messages");


// حافظه دائمی
let memory = JSON.parse(localStorage.getItem("amir_ai_memory")) || {};

function saveMemory(){
    localStorage.setItem(
        "amir_ai_memory",
        JSON.stringify(memory)
    );
}


// ذخیره اطلاعات
function learn(key,value){
    memory[key] = value;
    saveMemory();
}


// خواندن حافظه
function remember(key){
    return memory[key];
}


// ارسال با دکمه
chatSend.addEventListener("click", sendMessage);


// ارسال با Enter
chatInput.addEventListener("keydown", function(e){

    if(e.key === "Enter"){

        e.preventDefault();

        sendMessage();

    }

});



function sendMessage(){

    let text = chatInput.value.trim();

    if(text === "") return;


    addMessage(text,"user");


    chatInput.value = "";


    setTimeout(()=>{

        let answer = think(text);

        addMessage(answer,"bot");


    },500);

}




function addMessage(text,type){

    let div = document.createElement("div");

    div.className = "message " + type;

    div.innerHTML = text;


    chatMessages.appendChild(div);


    chatMessages.scrollTop = chatMessages.scrollHeight;

}






// ===============================
// مغز هوش مصنوعی
// ===============================


function think(text){


text=text.toLowerCase();



// یادگیری اسم

let name=text.match(
/اسم من (.+)/
);


if(name){

    learn(
    "name",
    name[1]
    );


    return "خوشبختم "+name[1]+" 😊 اسم شما رو یاد گرفتم.";

}



// پرسیدن اسم

if(
text.includes("اسمم چیه") ||
text.includes("اسم من چیست")
){

    if(memory.name){

        return "اسم شما "+memory.name+" است 😊";

    }


    return "هنوز اسمت رو بهم نگفتی.";

}





// یادگیری علاقه


let like=text.match(
/من (.+) دوست دارم/
);


if(like){

    learn(
    "favorite",
    like[1]
    );


    return "علاقه شما به "+like[1]+" رو یاد گرفتم 😎";

}





if(
text.includes("چی دوست دارم") ||
text.includes("علاقه من")
){

    if(memory.favorite){

        return "شما "+memory.favorite+" رو دوست دارید.";

    }


    return "هنوز چیزی درباره علاقه‌هات بهم نگفتی.";

}






// ریاضی ساده

let math =
text.match(
/(\d+)\s*([\+\-\*\/])\s*(\d+)/
);



if(math){


let a=Number(math[1]);
let b=Number(math[3]);
let op=math[2];


let result;


switch(op){

case "+":
result=a+b;
break;


case "-":
result=a-b;
break;


case "*":
result=a*b;
break;


case "/":
result=b!==0?a/b:"خطا";
break;

}


return "جواب میشه: "+result+" 🧮";

}







// جواب‌های هوشمند


const brain=[


{
keys:[
"سلام",
"درود",
"hello",
"hi"
],

answer:[
"سلام! خوش اومدی 😊",
"درود! چطور کمکت کنم؟"
]

},



{
keys:[
"کی هستی",
"تو چی هستی",
"ربات"
],

answer:[
"من Amir AI هستم 🤖 دستیار هوشمند امیر."
]

},



{
keys:[
"خوبی",
"چطوری"
],

answer:[
"من همیشه آماده‌ام کمک کنم 😎"
]

},



{
keys:[
"برنامه نویسی",
"کدنویسی",
"کد"
],

answer:[
"برنامه نویسی یعنی ساختن چیزهای جدید با منطق و خلاقیت 💻"
]

},



{
keys:[
"خداحافظ",
"بای"
],

answer:[
"خداحافظ! دوباره بیا 😊"
]

}


];






for(let item of brain){


for(let key of item.keys){


if(text.includes(key)){


return random(
item.answer
);


}


}


}






return random([

"جالبه! بیشتر توضیح میدی؟ 🤔",

"هنوز اینو یاد نگرفتم، ولی می‌تونم یاد بگیرم 😎",

"سوال خوبی بود!"

]);


}







function random(array){

return array[
Math.floor(
Math.random()*array.length
)
];

}