// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");

//config to connect with our firebase app
const firebaseConfig = {
    apiKey: "AIzaSyCcf7kqGWUU7bs4fEsCMROmkS_JUr5auHM",
    authDomain: "videoparser-e29b8.firebaseapp.com",
    projectId: "videoparser-e29b8",
    databaseURL: "https://videoparser-e29b8-default-rtdb.firebaseio.com",
    storageBucket: "videoparser-e29b8.appspot.com",
    messagingSenderId: "1033995258360",
    appId: "1:1033995258360:web:9f28248b907487471bae0d",
    measurementId: "G-X55F1SQTYK"
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
    clear,
    write
}