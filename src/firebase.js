import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/database'

const app = firebase.initializeApp({
  apiKey: "AIzaSyCUjRq6Y8EAuCZfz_G9awPAXkOMGUBjpEs",
  authDomain: "peoplemeet-43891.firebaseapp.com",
  databaseURL:"https://peoplemeet-43891-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "peoplemeet-43891",
  storageBucket: "peoplemeet-43891.appspot.com",
  messagingSenderId: "687580881213",
  appId: "1:687580881213:web:360b8a37e9dfc8db202554"
})

export const auth = app.auth()
export const db = app.firestore()
export const storage = app.storage()
export const database = app.database()