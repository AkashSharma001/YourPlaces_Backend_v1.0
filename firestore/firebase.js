const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXCg7QxbuHf1jutZQdI-CO6RUyb2hCvmM",
  authDomain: "your-places-1075c.firebaseapp.com",
  projectId: "your-places-1075c",
  storageBucket: "your-places-1075c.appspot.com",
  messagingSenderId: "314799635381",
  appId: "1:314799635381:web:45322b802d714cf62fb7fc",
  measurementId: "G-998844ZV1S",
};

const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
module.exports = getStorage(firebaseApp);
