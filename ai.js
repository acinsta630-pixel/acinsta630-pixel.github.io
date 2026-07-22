// ===============================
// Amir AI - ai.js
// Part 1: Login System
// ===============================


// گرفتن المنت‌ها

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




// ===============================
// بررسی ورود قبلی
// ===============================


window.addEventListener("load", ()=>{


    const savedUser = localStorage.getItem("amirAI_user");


    if(savedUser){


        openAIChat();


    }


});





// ===============================
// مرحله اول ورود
// ===============================


if(authSubmit){


authSubmit.addEventListener("click", ()=>{


    const name = userName.value.trim();
    const email = userEmail.value.trim();
    const phone = userPhone.value.trim();



    if(
        name === "" ||
        email === "" ||
        phone === ""
    ){

        authError.innerHTML =
        "لطفاً همه اطلاعات را وارد کنید";

        return;

    }



    if(!email.includes("@")){


        authError.innerHTML =
        "ایمیل صحیح نیست";

        return;


    }




    // ذخیره موقت اطلاعات

    const userData = {

        name:name,
        email:email,
        phone:phone

    };


    localStorage.setItem(
        "amirAI_temp",
        JSON.stringify(userData)
    );



    // رفتن به مرحله کد


    authStep1.style.display="none";

    authStep2.style.display="block";


    authError.innerHTML="";


});

}



// ===============================
// تایید کد
// ===============================


if(otpSubmit){


otpSubmit.addEventListener("click", ()=>{


    const code = otpInput.value.trim();



    if(code.length !== 4){


        otpError.innerHTML =
        "کد باید ۴ رقمی باشد";


        return;


    }




    const tempUser =
    JSON.parse(
        localStorage.getItem("amirAI_temp")
    );




    localStorage.setItem(
        "amirAI_user",
        JSON.stringify(tempUser)
    );



    localStorage.removeItem("amirAI_temp");



    openAIChat();



});

}






// ===============================
// باز کردن محیط چت
// ===============================


function openAIChat(){



    if(authGate){

        authGate.style.display="none";

    }



    if(chatWorkspace){

        chatWorkspace.style.display="flex";

    }



}
// ===============================
// Part 2: Chat System
// ===============================


const chatList = document.getElementById("chat-list");
const newChatBtn = document.getElementById("new-chat-btn");

const chatMessages = document.getElementById("chat-messages");

const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

const clearChatBtn = document.getElementById("clear-chat-btn");

let chats = [];

let activeChat = null;



// ===============================
// گرفتن تاریخچه ذخیره شده
// ===============================


function loadChats(){


    const saved =
    localStorage.getItem("amirAI_chats");


    if(saved){

        chats = JSON.parse(saved);

    }



    if(chats.length === 0){

        createNewChat();

    }
    else{


        activeChat = chats[0].id;

        renderChats();

        loadMessages();


    }


}





// ===============================
// ذخیره تاریخچه
// ===============================


function saveChats(){


    localStorage.setItem(
        "amirAI_chats",
        JSON.stringify(chats)
    );


}





// ===============================
// ساخت چت جدید
// ===============================


function createNewChat(){


    const newChat = {


        id: Date.now(),


        title:
        "گفتگوی جدید",


        messages: []


    };



    chats.unshift(newChat);



    activeChat = newChat.id;



    saveChats();


    renderChats();


    loadMessages();



}





// دکمه چت جدید


if(newChatBtn){


newChatBtn.addEventListener("click", ()=>{


    createNewChat();


});


}






// ===============================
// نمایش لیست چت‌ها
// ===============================


function renderChats(){


    if(!chatList) return;



    chatList.innerHTML="";



    chats.forEach(chat=>{


        const li =
        document.createElement("li");



        li.innerHTML = `

        <span class="chat-title">
        ${chat.title}
        </span>

        `;



        if(chat.id === activeChat){

            li.classList.add("active");

        }



        li.onclick=()=>{


            activeChat = chat.id;


            renderChats();


            loadMessages();


        };



        chatList.appendChild(li);



    });



}





// ===============================
// نمایش پیام‌ها
// ===============================


function loadMessages(){


    if(!chatMessages)
    return;



    chatMessages.innerHTML="";



    const chat =
    chats.find(
        c=>c.id===activeChat
    );



    if(!chat)
    return;



    chat.messages.forEach(msg=>{


        addMessage(
            msg.text,
            msg.type
        );


    });


}





// ===============================
// اضافه کردن پیام
// ===============================


function addMessage(text,type){



    const div =
    document.createElement("div");



    div.className =
    "message " + type;



    div.innerHTML=text;



    chatMessages.appendChild(div);



    chatMessages.scrollTop =
    chatMessages.scrollHeight;



}





// ===============================
// ارسال پیام
// ===============================


function sendMessage(){



    const text =
    chatInput.value.trim();



    if(text==="")
    return;




    const chat =
    chats.find(
        c=>c.id===activeChat
    );



    if(!chat)
    return;



    chat.messages.push({

        text:text,

        type:"user"

    });



    if(chat.title==="گفتگوی جدید"){

        chat.title =
        text.substring(0,25);

    }




    saveChats();



    renderChats();


    loadMessages();



    chatInput.value="";





    // جواب آزمایشی AI


    setTimeout(()=>{


        chat.messages.push({

            text:
            "🤖 پیام شما دریافت شد. Amir AI در حال آماده‌سازی پاسخ است...",


            type:"bot"


        });



        saveChats();


        loadMessages();



    },700);




}





if(chatSend){


chatSend.addEventListener(
"click",
sendMessage
);


}




if(chatInput){


chatInput.addEventListener(
"keydown",
(e)=>{


    if(e.key==="Enter"){

        sendMessage();

    }


});


}





// ===============================
// پاک کردن گفتگو
// ===============================


if(clearChatBtn){


clearChatBtn.addEventListener(
"click",
()=>{


    const chat =
    chats.find(
        c=>c.id===activeChat
    );


    if(chat){


        chat.messages=[];


        saveChats();


        loadMessages();


    }


});


}





// شروع سیستم چت

loadChats();
