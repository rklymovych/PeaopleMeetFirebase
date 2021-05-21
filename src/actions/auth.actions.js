import {auth, database, db} from '../firebase'
import {authConstant} from "./constants";
import firebase from "firebase";


// export const signup =(user)=>{
//
//   return async (dispatch) => {
//
//      auth.createUserWithEmailAndPassword(user.email, user.password)
//       .then(cred =>  {
//         return db.collection('users').doc(cred?.user?.uid).set({
//           id: cred?.user?.uid,
//           name: user.name,
//           isOnline: false,
//           description: '',
//           sex:'',
//           avatar:'',
//           email: '',
//           age:''
//         })
//       }
//       )
//       .then(() => console.log('success'))
//       .catch(error => console.log(error.message))
//   }
// }


export const signup = (user) => {
  return async (dispatch) => {

    dispatch({type: `${authConstant.USER_LOGIN}_REQUEST`})

    auth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(data => {
          const currentUser = auth.currentUser
          const name = user.name
          currentUser.updateProfile({
            displayName: name,
          })
              .then(() => {
                db.collection('users')
                    .doc(data.user.uid)
                    .set({
                      uid: data.user.uid,
                      name: currentUser.displayName,
                      isOnline: false,
                      description: '',
                      sex: '',
                      avatar: '',
                      email: '',
                      age: '',
                      location: {lat: null, lng: null},
                      createdAt: new Date()
                    })
              })

              .then(() => {
                const loggedInUser = {
                  name: user.name,
                  uid: data.user.uid,
                  email: data.user.email
                }
                localStorage.setItem('user', JSON.stringify(loggedInUser))
                console.log('USer logged successfully')
                dispatch({
                  type: `${authConstant.USER_LOGIN}_SUCCESS`,
                  payload: {user: loggedInUser}
                })
                database.ref('status/' + data.user.uid)
                    .set({
                      state: 'online',
                      last_changed: firebase.database.ServerValue.TIMESTAMP,
                    })
              })
              .catch(error => {
                console.log(error.message)
                dispatch({
                  type: `${authConstant.USER_LOGIN}_FAILURE`,
                  payload: {error: error.message ? error.message : error}
                })
              })
        })
        .catch(error => console.log(error.message))
  }
}

export const signin = (user) => {
  return async dispatch => {

    dispatch({type: `${authConstant.USER_LOGIN}_REQUEST`})

    auth
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
          const name = data.user.displayName;
          const loggedInUser = {
            name,
            uid: data.user.uid,
            email: data.user.email
          }
          localStorage.setItem('user', JSON.stringify(loggedInUser))
          dispatch({
            type: `${authConstant.USER_LOGIN}_SUCCESS`,
            payload: {user: loggedInUser}
          })
          database.ref('status/' + data.user.uid)
              .set({
                state: 'online',
                last_changed: firebase.database.ServerValue.TIMESTAMP,
              })
        })
        .catch(error => {
          console.log(error)
          dispatch({
            type: `${authConstant.USER_LOGIN}_FAILURE`,
            payload: {error: error.message ? error.message : error}
          })
        })
  }
}

export const isLoggedInUser = () => {
  return async dispatch => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    if (user) {
      dispatch({
        type: `${authConstant.USER_LOGIN}_SUCCESS`,
        payload: {user}
      })
    } else {
      dispatch({
        type: `${authConstant.USER_LOGIN}_FAILURE`,
        payload: {error: 'Login again please'}
      })
    }

  }
}


export const logout = (uid) => {
  console.log('uid', uid)
  return async dispatch => {
    dispatch({type: `${authConstant.USER_LOGOUT}_REQUEST`})
    // await database.ref('status/' + uid)
    //     // .onDisconnect()
    //     .remove((err) => {
    //       if (err) {
    //         console.error("could not establish onDisconnect event", err);
    //       }
    //     });
    db.collection('users')
        .doc(uid)
        .update({isOnline: false, location: {lat: null, lng: null}})
        .then(() => {
          database.ref('/status/' + uid)
              // .onDisconnect()
              .remove((err) => {
                if (err) {
                  console.error("could not establish onDisconnect event", err);
                }
              });
          // .set({
          //   state: 'offline',
          //   last_changed: firebase.database.ServerValue.TIMESTAMP,
          // })
          auth
              .signOut()
              .then(() => {
                localStorage.clear()
                dispatch({type: `${authConstant.USER_LOGOUT}_SUCCESS`})

              })
              .catch(error => {
                console.log('error', error)
                dispatch({
                  type: `${authConstant.USER_LOGOUT}_FAILURE`,
                  payload: {error: error}
                })
              })
        })
        .catch(error => console.log(error))

  }
}