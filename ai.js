// =================================
// Amir AI - ai.js
// Part 1 - Login + Chat Core
// =================================


// ===============================
// ELEMENTS
// ===============================


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



const chatWorkspace =
document.getElementById("chat-workspace");



const chatMessages =
document.getElementById("chat-messages");


const chatInput =
document.getElementById("chat-input");


const chatSend =
document.getElementById("chat-send");


const newChatBtn =
document.getElementById("new-chat-btn");


const chatList =
document.getElementById("chat-list");



const clearChatBtn =
document.getElementById("clear-chat-btn");





// ===============================
// DATA
// ===============================


let chats = [];

let activeChat = null;






// ===============================
// CHECK LOGIN
// ===============================


window.addEventListener("load", ()=>{


    const user =
    localStorage.getItem("amirAI_user");



    if(user){


        openChat();


    }


});







// ===============================
// LOGIN STEP 1
// ===============================


if(authSubmit){


authSubmit.onclick = ()=>{


    let name =
    userName.value.trim();


    let email =
    userEmail.value.trim();


    let phone =
    userPhone.value.trim();





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




    let user = {


        name:name,

        email:email,

        phone:phone


    };




    localStorage.setItem(
        "amirAI_temp",
        JSON.stringify(user)
    );




    authStep1.style.display="none";

    authStep2.style.display="block";



};



}






// ===============================
// OTP LOGIN
// ===============================


if(otpSubmit){


otpSubmit.onclick = ()=>{


    let code =
    otpInput.value.trim();



    if(code.length !== 4){


        otpError.innerHTML =
        "کد باید ۴ رقم باشد";


        return;


    }




    let user =
    localStorage.getItem(
        "amirAI_temp"
    );




    localStorage.setItem(
        "amirAI_user",
        user
    );



    localStorage.removeItem(
        "amirAI_temp"
    );




    openChat();



};



}






// ===============================
// OPEN CHAT
// ===============================


function openChat(){



    if(authGate){

        authGate.style.display="none";

    }



    if(chatWorkspace){

        chatWorkspace.style.display="flex";

    }



    loadChats();



}







// ===============================
// LOAD CHATS
// ===============================


function loadChats(){



    let saved =
    localStorage.getItem(
        "amirAI_chats"
    );



    if(saved){


        chats =
        JSON.parse(saved);


    }



    if(chats.length === 0){


        createChat();


    }
    else{


        activeChat =
        chats[0].id;


        renderChats();

        showMessages();


    }



}






// ===============================
// SAVE
// ===============================


function saveChats(){


    localStorage.setItem(
        "amirAI_chats",
        JSON.stringify(chats)
    );


}







// ===============================
// CREATE CHAT
// ===============================


function createChat(){



    let chat = {


        id:Date.now(),


        title:"گفتگوی جدید",


        messages:[],


        time:
        new Date()
        .toLocaleString("fa-IR")


    };




    chats.unshift(chat);



    activeChat =
    chat.id;



    saveChats();



    renderChats();



    showMessages();



}





// ===============================
// SEND MESSAGE
// ===============================


function sendMessage(){



    let text =
    chatInput.value.trim();




    if(text==="")
    return;




    let chat =
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





    chat.time =
    new Date()
    .toLocaleString("fa-IR");




    saveChats();



    showMessages();



    chatInput.value="";





    setTimeout(()=>{


        chat.messages.push({


            text:
            "🤖 Amir AI پیام شما را دریافت کرد...",


            type:"bot"


        });



        saveChats();


        showMessages();



    },700);



}






if(chatSend){


chatSend.onclick =
sendMessage;


}



if(chatInput){


chatInput.addEventListener(
"keydown",
e=>{


    if(e.key==="Enter"){


        sendMessage();


    }


});


}




if(newChatBtn){


newChatBtn.onclick =
()=>{


    createChat();


};


}
// =================================
// Part 2 - Professional History
// =================================



// ===============================
// RENDER CHAT HISTORY
// ===============================


function renderChats(){


    if(!chatList)
    return;



    chatList.innerHTML="";



    chats.forEach(chat=>{



        let li =
        document.createElement("li");



        li.className =
        "history-item";



        if(chat.id === activeChat){


            li.classList.add("active");


        }






        li.innerHTML = `


        <div class="history-main">


            <div class="history-icon">

                💬

            </div>



            <div class="history-info">


                <div class="history-title">

                    ${chat.title}

                </div>



                <div class="history-time">

                    ${chat.time || "جدید"}

                </div>


            </div>



        </div>




        <div class="history-actions">


            <button class="rename-chat">

                ✏️

            </button>



            <button class="delete-chat">

                🗑️

            </button>


        </div>


        `;







        // باز کردن گفتگو


        li.querySelector(".history-main")
        .onclick=()=>{


            activeChat =
            chat.id;


            renderChats();


            showMessages();



        };







        // تغییر نام


        li.querySelector(".rename-chat")
        .onclick=(e)=>{


            e.stopPropagation();



            let name =
            prompt(
            "نام جدید گفتگو:",
            chat.title
            );



            if(name && name.trim()){


                chat.title =
                name.trim();



                saveChats();


                renderChats();


            }



        };







        // حذف گفتگو


        li.querySelector(".delete-chat")
        .onclick=(e)=>{


            e.stopPropagation();



            chats =
            chats.filter(
                c=>c.id !== chat.id
            );




            if(chats.length===0){


                createChat();


                return;


            }





            activeChat =
            chats[0].id;



            saveChats();



            renderChats();



            showMessages();



        };





        chatList.appendChild(li);



    });



}








// ===============================
// SHOW MESSAGES
// ===============================


function showMessages(){



    if(!chatMessages)
    return;



    chatMessages.innerHTML="";



    let chat =
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
// ADD MESSAGE UI
// ===============================


function addMessage(text,type){



    let div =
    document.createElement("div");



    div.className =
    "message " + type;



    div.innerHTML =
    text;



    chatMessages.appendChild(div);



    chatMessages.scrollTop =
    chatMessages.scrollHeight;



}








// ===============================
// CLEAR CURRENT CHAT
// ===============================


if(clearChatBtn){



clearChatBtn.onclick=()=>{


    let chat =
    chats.find(
        c=>c.id===activeChat
    );



    if(chat){



        chat.messages=[];



        saveChats();



        showMessages();



    }



};



}