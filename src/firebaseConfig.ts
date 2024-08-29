// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQIFZzUFXx2ZB5EfSZaDBDYatuCv59pcE",
  authDomain: "controle-vacinas.firebaseapp.com",
  projectId: "controle-vacinas",
  storageBucket: "controle-vacinas.appspot.com",
  messagingSenderId: "24969636228",
  appId: "1:24969636228:web:73ac4cbab7e895a42d95d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;