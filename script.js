// Amir AI Firebase Test

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


const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


console.log("🔥 Firebase وصل شد");


set(
ref(db,"test"),
{
message:"Amir AI Online",
time:new Date().toString()
}
);


console.log("✅ اطلاعات ارسال شد");
<script type="module" src="script.js?v=10"></script>
