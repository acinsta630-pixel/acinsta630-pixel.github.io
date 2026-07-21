// ===============================
// Amir AI PRO v3
// ===============================


const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatMessages = document.getElementById("chat-messages");


// حافظه
let memory = JSON.parse(
    localStorage.getItem("amir_ai_memory")
) || {};


// مغز خارجی
let brainData = [];


// بارگذاری brain.json
fetch("brain/brain.json")
.then(response => response.json())
.then(data => {

    brainData = data;

    console.log("🧠 Amir Brain Loaded");

})
.catch(error => {

    console.log("Brain Error:", error);

});



// ذخیره حافظه
function saveMemory(){

    localStorage.setItem(
        "amir_ai_memory",
        JSON.stringify(memory)
    );

}


// یادگیری
function learn(key,value){

    memory[key] = value;

    saveMemory();

}



// ارسال با دکمه
chatSend.addEventListener(
"click",
sendMessage
);



// ارسال با Enter
chatInput.addEventListener(
"keydown",
function(e){

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


        addMessage(
            answer,
            "bot"
        );


    },500);


}



function addMessage(text,type){


    let div=document.createElement("div");


    div.className =
    "message "+type;


    div.innerHTML=text;


    chatMessages.appendChild(div);


    chatMessages.scrollTop =
    chatMessages.scrollHeight;


}
// ===============================
// مغز و فکر کردن
// ===============================


function think(text){


    text = text.toLowerCase();



    // یادگیری اسم

    let name = text.match(
        /اسم من (.+)/
    );


    if(name){

        learn(
            "name",
            name[1]
        );


        return "خوشبختم " + name[1] + " 😊 اسمت رو یاد گرفتم.";

    }





    // پرسیدن اسم

    if(
        text.includes("اسمم چیه") ||
        text.includes("اسم من چیست")
    ){


        if(memory.name){

            return "اسم شما " + memory.name + " است 😊";

        }


        return "هنوز اسمت رو بهم نگفتی.";

    }





    // یادگیری علاقه


    let favorite = text.match(
        /من (.+) دوست دارم/
    );


    if(favorite){


        learn(
            "favorite",
            favorite[1]
        );


        return "علاقه شما به " + favorite[1] + " رو یاد گرفتم 😎";


    }





    // پرسیدن علاقه


    if(
        text.includes("چی دوست دارم") ||
        text.includes("علاقه من")
    ){


        if(memory.favorite){

            return "شما " + memory.favorite + " رو دوست دارید.";

        }


        return "هنوز علاقه‌ات رو بهم نگفتی.";

    }







    // ماشین حساب


    let math = text.match(
        /(\d+)\s*([\+\-\*\/])\s*(\d+)/
    );



    if(math){


        let a = Number(math[1]);

        let b = Number(math[3]);

        let op = math[2];


        let result;



        if(op === "+")
            result = a+b;


        if(op === "-")
            result = a-b;


        if(op === "*")
            result = a*b;


        if(op === "/")
            result = b !== 0 ? a/b : "خطا";



        return "جواب میشه: " + result + " 🧮";


    }






    // استفاده از brain.json


    for(let item of brainData){


        for(let word of item.keywords){


            if(text.includes(word)){


                return random(
                    item.answers
                );


            }


        }


    }






    return random([

        "این رو هنوز یاد نگرفتم 🤔",

        "جالبه! بیشتر توضیح میدی؟",

        "دارم یاد می‌گیرم، سوال بعدی رو بپرس 😎"

    ]);



}
// ===============================
// ابزارهای کمکی Amir AI
// ===============================



function random(array){


    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];


}




// تست آماده شدن هوش مصنوعی

console.log(
    "🤖 Amir AI PRO Ready!"
);