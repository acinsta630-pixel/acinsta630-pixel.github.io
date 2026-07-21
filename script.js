// ===============================
// Amir AI PRO v6
// ===============================


// عناصر صفحه

const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatMessages = document.getElementById("chat-messages");



// ===============================
// حافظه Amir AI
// ===============================

let memory = JSON.parse(
    localStorage.getItem("amir_ai_memory")
) || {};


// آموزش‌های کاربر

let learned = JSON.parse(
    localStorage.getItem("amir_learned")
) || [];


// سوال‌هایی که بلد نیست

let unknownQuestions = JSON.parse(
    localStorage.getItem("amir_unknown")
) || [];




// ===============================
// فایل‌های هوش مصنوعی
// ===============================

let brainData = [];

let synonymData = {};

let knowledgeData = [];





// ===============================
// بارگذاری brain.json
// ===============================


fetch("brain/brain.json")

.then(res => res.json())

.then(data => {

    brainData = data;

    console.log("🧠 Brain Loaded");

})

.catch(err => {

    console.log("Brain Error:", err);

});





// ===============================
// بارگذاری synonyms.json
// ===============================


fetch("brain/synonyms.json")

.then(res => res.json())

.then(data => {

    synonymData = data;

    console.log("🧠 Synonyms Loaded");

})

.catch(err => {

    console.log("Synonyms Error:", err);

});






// ===============================
// بارگذاری knowledge.json
// ===============================


fetch("brain/knowledge.json")

.then(res => res.json())

.then(data => {


    knowledgeData = data;


    console.log("📚 Knowledge Loaded");


})

.catch(err => {


    console.log("Knowledge Error:", err);


});






// ===============================
// ذخیره اطلاعات
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



function saveUnknown(){

    localStorage.setItem(
        "amir_unknown",
        JSON.stringify(unknownQuestions)
    );

}





// ===============================
// یادگیری حافظه
// ===============================


function learn(key,value){


    memory[key] = value;


    saveMemory();


}






// ===============================
// ارسال پیام
// ===============================


chatSend.addEventListener(
    "click",
    sendMessage
);





chatInput.addEventListener(
    "keydown",
    function(e){


        if(e.key === "Enter"){


            e.preventDefault();


            sendMessage();


        }


    }
);






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







// ===============================
// نمایش پیام
// ===============================


function addMessage(text,type){



    let div = document.createElement("div");



    div.className =
    "message " + type;



    div.textContent = text;



    chatMessages.appendChild(div);



    chatMessages.scrollTop =
    chatMessages.scrollHeight;



}
// ===============================
// مغز Amir AI
// ===============================


function think(text){


    text = text.toLowerCase().trim();




    // ===============================
    // آموزش دستی
    // مثال:
    // یاد بگیر پایتون چیست = زبان برنامه نویسی
    // ===============================


    let teach = text.match(
        /یاد بگیر (.+) = (.+)/
    );



    if(teach){


        let question =
        teach[1].trim();



        let answer =
        teach[2].trim();




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
    // اسم کاربر
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
    // مترادف‌ها
    // ===============================


    let meaning = checkSynonyms(text);



    if(meaning){



        if(meaning === "سلام"){

            return "سلام! خوش اومدی 😊";

        }



        if(meaning === "خداحافظ"){

            return "خداحافظ! دوباره بیا 👋";

        }



        if(meaning === "خوشحالی"){

            return "خوشحالم که حالت خوبه 😎";

        }


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

                result =
                b !== 0
                ? a/b
                : "خطا";

            break;


        }



        return "جواب میشه: "
        + result
        + " 🧮";


    }







    // ===============================
    // دانش یاد گرفته شده
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
    // knowledge.json
    // ===============================


    for(let item of knowledgeData){



        for(let word of item.keywords){



            if(text.includes(word)){



                return random(
                    item.answers
                );


            }


        }


    }







    // ===============================
    // brain.json
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
    // ذخیره سوال‌های ناشناخته
    // ===============================


    let already =
    unknownQuestions.some(
        q => q.question === text
    );



    if(!already){


        unknownQuestions.push({


            question:text,


            date:
            new Date().toLocaleDateString()


        });



        saveUnknown();


    }






    return random([



        "این رو هنوز یاد نگرفتم 🤔",


        "جالبه! ذخیره‌اش کردم 🧠",


        "دارم یاد می‌گیرم 😎"



    ]);



}
// ===============================
// بررسی مترادف‌ها
// ===============================


function checkSynonyms(text){


    for(let meaning in synonymData){



        for(let word of synonymData[meaning]){



            if(text.includes(word)){



                return meaning;



            }


        }


    }



    return null;


}






// ===============================
// جواب تصادفی
// ===============================


function random(array){



    return array[

        Math.floor(
            Math.random() * array.length
        )

    ];



}






// ===============================
// تست آماده بودن AI
// ===============================


console.log(
    "🤖 Amir AI PRO v6 Ready!"
);