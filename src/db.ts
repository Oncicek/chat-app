/* eslint-disable */
import firebase from 'firebase/compat/app'
import 'firebase/compat/database'

const config = {
    apiKey: "AIzaSyBUvUZi0rUMoYyb7oQsJaLesVKswvAHYMk",
    authDomain: "mustafar-chat-app.firebaseapp.com",
    projectId: "mustafar-chat-app",
    storageBucket: "mustafar-chat-app.appspot.com",
    messagingSenderId: "616029607397",
    appId: "1:616029607397:web:055f1f9aa01fad10914b0c",
    measurementId: "G-T53P7LNYS4"
}

const db = firebase.initializeApp(config)
export default db