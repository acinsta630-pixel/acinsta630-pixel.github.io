// ===============================
// Amir AI PRO v4
// ===============================


const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatMessages = document.getElementById("chat-messages");


// حافظه اصلی
let memory = JSON.parse(
    localStorage.getItem("amir_ai_memory")
) || {};


// چیزهایی که یاد گرفته
let learned = JSON.parse(
    localStorage.getItem("amir_learned")
) || [];


// مغز اصلی
let brainData = [];
let synonymData = {};


// خواندن brain.json
fetch("brain/brain.json")
.then(res => res.json())
.then(data => {

    brainData = data;

    console.log("🧠 Brain Loaded");

})
.catch(err => {

    console.log("Brain Error:", err);

});
fetch("brain/synonyms.json")
.then(res => res.json())
.then(data => {

    synonymData = data;

    console.log("🧠 Synonyms Loaded");

})
.catch(err => {

    console.log("Synonyms Error:", err);

});



// ذخیره حافظه
function saveMemory(){

    localStorage.setItem(
        "amir_ai_memory",
        JSON.stringify(memory)
    );

}



// ذخیره یادگیری
function saveLearned(){

    localStorage.setItem(
        "amir_learned",
        JSON.stringify(learned)
    );

}



// یادگیری
function learn(key,value){

    memory[key] = value;

    saveMemory();

}



// دکمه ارسال
chatSend.addEventListener(
"click",
sendMessage
);



// دکمه Enter
chatInput.addEventListener(
"keydown",
(e)=>{

    if(e.key === "Enter"){

        e.preventDefault();

        sendMessage();

    }

});



// ارسال پیام
function sendMessage(){

    let text = chatInput.value.trim();


    if(!text) return;


    addMessage(
        text,
        "user"
    );


    chatInput.value = "";


    setTimeout(()=>{

        let answer = think(text);


        addMessage(
            answer,
            "bot"
        );


    },500);

}



// نمایش پیام
function addMessage(text,type){

    let div = document.createElement("div");


    div.className =
    "message " + type;


    div.innerHTML = text;


    chatMessages.appendChild(div);


    chatMessages.scrollTop =
    chatMessages.scrollHeight;

}
// ===============================
// مغز فکر کردن Amir AI
// ===============================


function think(text){


    text = text.toLowerCase();




    // ===============================
    // آموزش دادن به AI
    // مثال:
    // یاد بگیر پایتون چیست = یک زبان برنامه نویسی است
    // ===============================


    let teach = text.match(
        /یاد بگیر (.+) = (.+)/
    );


    if(teach){


        let question = teach[1];

        let answer = teach[2];



        learned.push({

            keywords:[
                question
            ],

            answers:[
                answer
            ]

        });



        saveLearned();



        return "یاد گرفتم! 🧠✅";

    }







    // ===============================
    // یادگیری اسم
    // ===============================


    let name = text.match(
        /اسم من (.+)/
    );


    if(name){


        learn(
            "name",
            name[1]
        );


        return "خوشبختم "
        + name[1]
        + " 😊 اسمت رو یاد گرفتم.";


    }






    // پرسیدن اسم


    if(
        text.includes("اسمم چیه") ||
        text.includes("اسم من چیست")
    ){


        if(memory.name){


            return "اسم شما "
            + memory.name
            + " است 😊";


        }


        return "هنوز اسمت رو بهم نگفتی.";

    }








    // ===============================
    // علاقه
    // ===============================


    let favorite = text.match(
        /من (.+) دوست دارم/
    );


    if(favorite){


        learn(
            "favorite",
            favorite[1]
        );


        return "یاد گرفتم که "
        + favorite[1]
        + " رو دوست داری 😎";


    }






    if(
        text.includes("چی دوست دارم") ||
        text.includes("علاقه من")
    ){


        if(memory.favorite){


            return "تو "
            + memory.favorite
            + " رو دوست داری.";


        }


        return "هنوز علاقه‌ات رو نمی‌دونم.";

    }






    // ===============================
    // ماشین حساب
    // ===============================


    let math = text.match(
        /(\d+)\s*([\+\-\*\/])\s*(\d+)/
    );



    if(math){


        let a = Number(math[1]);

        let b = Number(math[3]);

        let op = math[2];


        let result;



        switch(op){


            case "+":
                result = a+b;
                break;


            case "-":
                result = a-b;
                break;


            case "*":
                result = a*b;
                break;


            case "/":
                result = b !== 0 ? a/b : "خطا";
                break;


        }



        return "جواب میشه: "
        + result
        + " 🧮";


    }
    // ===============================
// ادامه مغز Amir AI
// ===============================



    // ===============================
    // بررسی چیزهایی که خودش یاد گرفته
    // ===============================


    for(let item of learned){


        for(let word of item.keywords){


            if(text.includes(word)){


                return random(
                    item.answers
                );


            }

        }

    }






    // ===============================
    // بررسی brain.json
    // ===============================


    for(let item of brainData){


        for(let word of item.keywords){


            if(text.includes(word)){


                return random(
                    item.answers
                );


            }

        }

    }







    // ===============================
    // جواب پیش فرض
    // ===============================


    return random([


        "این رو هنوز یاد نگرفتم 🤔",

        "جالبه! بیشتر توضیح میدی؟",

        "دارم یاد می‌گیرم 😎",

        "سوال خوبی بود، باید بیشتر یاد بگیرم 🧠"


    ]);



}







// ===============================
// انتخاب جواب تصادفی
// ===============================


function random(array){


    return array[
        Math.floor(
            Math.random()*array.length
        )
    ];


}




console.log(
    "🤖 Amir AI PRO v4 Ready!"
);