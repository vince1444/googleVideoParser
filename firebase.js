// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");

//config to connect with our firebase app
const firebaseConfig = {
    
};

firebase.initializeApp(firebaseConfig);
//database reference
const database = firebase.database();

const date = new Date();

async function write(data) {
    database.ref(`${date}`).push(data, error => {
        if (error) console.log(error);
        else console.log('Pushed data.');
    })
}

async function clear() {
    database.ref().set(null, error => {
        if (error) console.log(error);
        else console.log('Cleared database.');
    })
}

module.exports = {
    //clearDb: clearDb
    clear,
    write
}