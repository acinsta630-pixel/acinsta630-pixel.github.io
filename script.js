// ===============================
// Amir AI PRO v7.1
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



let learned = JSON.parse(
    localStorage.getItem("amir_learned")
) || [];



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
// بارگذاری فایل‌ها
// ===============================


loadJSON(
    "brain/brain.json",
    data => {

        brainData = data;

        console.log(
            "🧠 Brain Loaded"
        );

    }
);



loadJSON(
    "brain/synonyms.json",
    data => {

        synonymData = data;

        console.log(
            "🧠 Synonyms Loaded"
        );

    }
);




loadJSON(
    "brain/knowledge.json",
    data => {

        knowledgeData = data;

        console.log(
            "📚 Knowledge Loaded"
        );

    }
);





// ===============================
// خواندن JSON
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
// حافظه شخصی
// ===============================


function learn(key,value){


    memory[key] = value;


    saveMemory();


}






// ===============================
// اضافه کردن دانش جدید
// ===============================


function addLearned(question,answer){



    let existing = learned.find(item =>

        item.keywords.some(

            word => normalize(word) === normalize(question)

        )

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
// دکمه‌ها و ارسال پیام
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
// مغز Amir AI
// ===============================


function think(text){


    text =
    normalize(text);





    // ===============================
    // آموزش مستقیم
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



        return "یاد گرفتم 🧠✅";


    }






    // ===============================
    // اسم
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
        + " 😊";


    }






    if(
        text.includes("اسمم چیه")
    ){


        if(memory.name){


            return "اسم شما "
            + memory.name
            + " است 😊";


        }


        return "هنوز اسمت رو نمی‌دونم.";


    }







    // ===============================
    // اول حافظه خودش
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
    // دانش آماده
    // ===============================


    let knowledgeAnswer =
    searchKnowledge(
        knowledgeData,
        text
    );



    if(knowledgeAnswer){


        return knowledgeAnswer;


    }





    let brainAnswer =
    searchKnowledge(
        brainData,
        text
    );



    if(brainAnswer){


        return brainAnswer;


    }
    // ===============================
// ذخیره سوال‌های ناشناخته
// ===============================


function saveUnknownQuestion(text){


    let exists =
    unknownQuestions.some(
        q => normalize(q.question) === normalize(text)
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
// جستجوی هوشمند دانش
// ===============================


function searchKnowledge(data,text){



    let cleanText =
    normalize(text);




    for(let item of data){



        for(let word of item.keywords){



            let cleanWord =
            normalize(word);




            if(
                cleanText.includes(cleanWord)
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
// مترادف‌ها
// ===============================


function checkSynonyms(text){



    let cleanText =
    normalize(text);




    for(let meaning in synonymData){



        for(let word of synonymData[meaning]){



            if(
                cleanText.includes(
                    normalize(word)
                )
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
            Math.random() *
            array.length
        )

    ];


}








// ===============================
// وقتی چیزی پیدا نشد
// ===============================


function unknownAnswer(text){


    saveUnknownQuestion(text);



    return random([


        "این رو هنوز یاد نگرفتم 🤔",

        "جالبه! ذخیره‌اش کردم 🧠",

        "دارم یاد می‌گیرم 😎"


    ]);


}








console.log(
    "🤖 Amir AI PRO v7.1 Ready!"
);