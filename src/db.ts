import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import 'firebase/compat/auth'

const config = {
    apiKey: "AIzaSyCY3oraSCuMe53GYe0suW7QpesY2BDPCOw",
    authDomain: "chat-app-97db9.firebaseapp.com",
    databaseURL: "https://chat-app-97db9-default-rtdb.firebaseio.com",
    projectId: "chat-app-97db9",
    storageBucket: "chat-app-97db9.appspot.com",
    messagingSenderId: "49816693073",
    appId: "1:49816693073:web:f9c4b1c1e206e11fb84b70",
    measurementId: "G-E03B46EPT6"
}

const db = firebase.initializeApp(config)
export default db