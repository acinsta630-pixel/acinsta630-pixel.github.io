document.addEventListener("DOMContentLoaded", () => {


    // عناصر ورود
    const authGate = document.getElementById("auth-gate");
    const step1 = document.getElementById("auth-step-1");
    const step2 = document.getElementById("auth-step-2");

    const authBtn = document.getElementById("auth-submit");
    const otpBtn = document.getElementById("otp-submit");

    const nameInput = document.getElementById("user-name");
    const emailInput = document.getElementById("user-email");
    const phoneInput = document.getElementById("user-phone");

    const otpInput = document.getElementById("otp-input");

    const authError = document.getElementById("auth-error");
    const otpError = document.getElementById("otp-error");

    const chatWorkspace = document.getElementById("chat-workspace");


    let userName = "";



    // مرحله اول ورود
    authBtn.addEventListener("click", () => {


        if(
            nameInput.value.trim() === "" ||
            emailInput.value.trim() === "" ||
            phoneInput.value.trim() === ""
        ){

            authError.innerHTML =
            "لطفا همه اطلاعات را وارد کنید ❌";

            return;

        }



        userName = nameInput.value;



        authError.innerHTML = "";

        step1.style.display = "none";
        step2.style.display = "block";



    });





    // تایید کد
    otpBtn.addEventListener("click", () => {


        if(otpInput.value !== "1234"){


            otpError.innerHTML =
            "کد اشتباه است (برای تست: 1234) ❌";


            return;

        }



        authGate.style.display = "none";

        chatWorkspace.style.display = "flex";



        addMessage(
            "سلام " + userName + " 👋\nمن Amir AI هستم. چطور کمکت کنم؟",
            "bot"
        );


    });







    // چت
    const sendBtn =
    document.getElementById("chat-send");


    const chatInput =
    document.getElementById("chat-input");


    sendBtn.addEventListener("click", sendMessage);



    chatInput.addEventListener("keypress", (e)=>{


        if(e.key === "Enter"){

            sendMessage();

        }

    });






    function sendMessage(){


        let text =
        chatInput.value.trim();



        if(text === "") return;



        addMessage(text,"user");

        chatInput.value = "";



        setTimeout(()=>{


            let reply =
            getAIReply(text);



            addMessage(reply,"bot");



        },700);



    }







    function addMessage(text,type){


        const box =
        document.getElementById("chat-messages");


        const msg =
        document.createElement("div");


        msg.className =
        "message " + type;



        msg.innerHTML =
        text.replace(/\n/g,"<br>");



        box.appendChild(msg);



        box.scrollTop =
        box.scrollHeight;


    }







    function getAIReply(text){


        text=text.toLowerCase();



        if(text.includes("سلام")){

            return "سلام 👋 خوش اومدی. من آماده‌ام کمک کنم.";

        }


        if(text.includes("کد") || text.includes("برنامه")){

            return "عالیه 💻 بگو چه چیزی میخوای بسازی.";

        }


        if(text.includes("اسم")){

            return "من Amir AI هستم 🤖";

        }


        return "متوجه شدم ✅ بیشتر توضیح بده تا بهتر کمک کنم.";

    }








    // پاک کردن چت

    const clearBtn =
    document.getElementById("clear-chat-btn");


    if(clearBtn){

        clearBtn.addEventListener("click",()=>{


            document.getElementById("chat-messages").innerHTML="";


        });

    }






    // چت جدید

    const newChat =
    document.getElementById("new-chat-btn");


    if(newChat){


        newChat.addEventListener("click",()=>{


            document.getElementById("chat-messages").innerHTML="";


            addMessage(
            "گفتگوی جدید شروع شد 🚀",
            "bot"
            );


        });


    }



});