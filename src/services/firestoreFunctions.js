import {db} from "../firebase";

export const getAvatar =  (id) => {
  db.collection('users').doc(id)
      .get().then((doc) => {
        if (doc.exists) {
           const  avatar =  doc.data().avatar
          console.log(avatar)
          return avatar
        }
      }, error => {
        console.log(error.message)
      }
  )
}
export const isOnline = (id) => {
  db.collection('users').doc(id).set({
    isOnline: false
  }, {merge: true})
}