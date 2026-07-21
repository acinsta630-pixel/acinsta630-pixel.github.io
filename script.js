// =================================
// Amir AI Firebase Online Test
// =================================


// Firebase Imports

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";


import {
getDatabase,
ref,
set,
get
}
from
"https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";



// Firebase Config

const firebaseConfig = {

apiKey: "AIzaSyC7gBh82OArlYcAVrjEKJfqCcK_VbO8eZg",

authDomain: "aimysite-249db.firebaseapp.com",

databaseURL:
"https://aimysite-249db-default-rtdb.firebaseio.com",

projectId:
"aimysite-249db",

storageBucket:
"aimysite-249db.firebasestorage.app",

messagingSenderId:
"963797429490",

appId:
"1:963797429490:web:bd50781dde6939959e746b"

};




// Start Firebase

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


console.log("🔥 Firebase Connected");




// تست ارسال اطلاعات

set(
ref(db,"amirAI/test"),
{
message:"Amir AI Online",
time:new Date().toString()
}
)

.then(()=>{

console.log("✅ Data Sent To Firebase");

})


.catch((error)=>{

console.log(
"❌ Firebase Error:",
error
);

});




// تست خواندن

get(
ref(db,"amirAI/test")
)

.then(snapshot=>{


if(snapshot.exists()){


console.log(
"📦 Firebase Data:",
snapshot.val()
);


}

else{


console.log(
"Database Empty"
);


}


});
