import firebase from "firebase/app"
import 'firebase/auth'

const app = firebase.initializeApp({
  apiKey: "AIzaSyCUjRq6Y8EAuCZfz_G9awPAXkOMGUBjpEs",
  authDomain: "peoplemeet-43891.firebaseapp.com",
  projectId: "peoplemeet-43891",
  storageBucket: "peoplemeet-43891.appspot.com",
  messagingSenderId: "687580881213",
  appId: "1:687580881213:web:360b8a37e9dfc8db202554"
})

export const auth = app.auth()
export default app