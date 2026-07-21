// ===============================
// Amir AI PRO v7
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



// دانش‌هایی که کاربر داده

let learned = JSON.parse(
    localStorage.getItem("amir_learned")
) || [];



// سوال‌های ناشناخته

let unknownQuestions = JSON.parse(
    localStorage.getItem("amir_unknown")
) || [];





// ===============================
// فایل‌های مغز
// ===============================


let brainData = [];

let synonymData = {};

let knowledgeData = [];





// ===============================
// لود brain.json
// ===============================


loadJSON(
    "brain/brain.json",
    data => {

        brainData = data;

        console.log("🧠 Brain Loaded");

    }
);





// ===============================
// لود synonyms.json
// ===============================


loadJSON(
    "brain/synonyms.json",
    data => {

        synonymData = data;

        console.log("🧠 Synonyms Loaded");

    }
);





// ===============================
// لود knowledge.json
// ===============================


loadJSON(
    "brain/knowledge.json",
    data => {

        knowledgeData = data;

        console.log("📚 Knowledge Loaded");

    }
);





// ===============================
// تابع عمومی خواندن JSON
// ===============================


function loadJSON(file,callback){


    fetch(file)

    .then(res => res.json())

    .then(data => {


        callback(data);


    })

    .catch(err => {


        console.log(
            file,
            "Error:",
            err
        );


    });


}







// ===============================
// ذخیره‌ها
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
// حافظه شخصی
// ===============================


function learn(key,value){


    memory[key] = value;


    saveMemory();


}







// ===============================
// آموزش هوشمند
// ===============================


function addLearned(question,answer){



    let existing = learned.find(item =>

        item.keywords.includes(question)

    );




    if(existing){


        if(
            !existing.answers.includes(answer)
        ){


            existing.answers.push(answer);


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
// ارسال پیام
// ===============================


chatSend.addEventListener(
    "click",
    sendMessage
);




chatInput.addEventListener(
    "keydown",
    e => {


        if(e.key === "Enter"){


            e.preventDefault();


            sendMessage();


        }


    }
);







function sendMessage(){


    let text =
    chatInput.value.trim();



    if(!text) return;




    addMessage(
        text,
        "user"
    );



    chatInput.value = "";





    setTimeout(()=>{


        let answer =
        think(text);



        addMessage(
            answer,
            "bot"
        );



    },300);



}






// ===============================
// نمایش پیام
// ===============================


function addMessage(text,type){



    let div =
    document.createElement("div");



    div.className =
    "message " + type;



    div.textContent =
    text;



    chatMessages.appendChild(div);



    chatMessages.scrollTop =
    chatMessages.scrollHeight;



}

// ===============================
// مغز Amir AI v7
// ===============================


function think(text){



    text =
    text.toLowerCase().trim();






    // ===============================
    // آموزش جدید
    // مثال:
    // یاد بگیر امیر کیه = سازنده Amir AI است
    // ===============================



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



        return "یاد گرفتم! 🧠✅";

    }








    // ===============================
    // اسم کاربر
    // ===============================



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
    // علاقه‌ها
    // ===============================



    let favorite =
    text.match(
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



    let meaning =
    checkSynonyms(text);



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



    let math =
    text.match(
        /(\d+)\s*([\+\-\*\/])\s*(\d+)/
    );



    if(math){



        let a =
        Number(math[1]);



        let b =
        Number(math[3]);



        let op =
        math[2];



        let result;




        switch(op){


            case "+":

                result =
                a+b;

            break;



            case "-":

                result =
                a-b;

            break;



            case "*":

                result =
                a*b;

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
    // اولویت ۱
    // چیزهایی که خودش یاد گرفته
    // ===============================



    let learnedAnswer =
    searchKnowledge(
        learned,
        text
    );



    if(learnedAnswer){


        return learnedAnswer;


    }







    // ===============================
    // اولویت ۲
    // knowledge.json
    // ===============================



    let knowledgeAnswer =
    searchKnowledge(
        knowledgeData,
        text
    );



    if(knowledgeAnswer){


        return knowledgeAnswer;


    }







    // ===============================
    // اولویت ۳
    // brain.json
    // ===============================



    let brainAnswer =
    searchKnowledge(
        brainData,
        text
    );



    if(brainAnswer){


        return brainAnswer;


    }








    // ===============================
    // ذخیره سوال ناشناخته
    // ===============================



    saveUnknownQuestion(text);





    return random([


        "این رو هنوز یاد نگرفتم 🤔",


        "جالبه! ذخیره‌اش کردم 🧠",


        "دارم یاد می‌گیرم 😎"



    ]);




}
// ===============================
// جستجوی هوشمند در دانش
// ===============================


function searchKnowledge(data,text){



    for(let item of data){



        for(let word of item.keywords){



            if(
                text.includes(
                    word.toLowerCase()
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
    unknownQuestions.some(
        q => q.question === text
    );



    if(!exists){



        unknownQuestions.push({


            question:text,


            date:
            new Date().toLocaleDateString()



        });



        saveUnknown();


    }


}








// ===============================
// بررسی مترادف‌ها
// ===============================


function checkSynonyms(text){



    for(let meaning in synonymData){



        for(let word of synonymData[meaning]){



            if(
                text.includes(word)
            ){



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
    "🤖 Amir AI PRO v7 Ready!"
);