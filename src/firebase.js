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

// const app = firebase.initializeApp({
//   apiKey: "AIzaSyCGgMf5pJYmz91Kojii6HcEoFFySu26P_U",
//   authDomain: "radio-aba5d.firebaseapp.com",
//   databaseURL: "https://radio-aba5d.firebaseio.com",
//   projectId: "radio-aba5d",
//   storageBucket: "radio-aba5d.appspot.com",
//   messagingSenderId: "380476704164",
//   appId: "1:380476704164:web:723df3b8852bb831552d31"
// });

export const auth = app.auth()
export const db = app.firestore()
export const storage = app.storage()
export const database = app.database()