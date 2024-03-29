import { auth, database, db } from '../firebase'
import { authConstant } from "./constants";
import firebase from "firebase";

export const signup = (user) => {
  return async (dispatch) => {

    dispatch({ type: `${authConstant.USER_LOGIN}_REQUEST` })

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
                email: user.email,
                age: '',
                location: { lat: null, lng: null },
                createdAt: new Date(),
                activeConversation: ['not empty array']
              })
          })

          .then(() => {
            const loggedInUser = {
              name: user.name,
              uid: data.user.uid,
              email: data.user.email
            }
            localStorage.setItem('user', JSON.stringify(loggedInUser))
            console.log('User logged successfully')
            dispatch({
              type: `${authConstant.USER_LOGIN}_SUCCESS`,
              payload: { user: loggedInUser }
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
              payload: { error: error.message ? error.message : error }
            })
          })
      })
      .catch(error => {
        console.error(error.message)
        dispatch({
          type: `${authConstant.USER_LOGIN}_FAILURE`,
          payload: { error: error.message ? error.message : error }
        })

      })
  }
}

export const signin = (user) => {
  return async dispatch => {

    dispatch({ type: `${authConstant.USER_LOGIN}_REQUEST` })

    auth
      .signInWithEmailAndPassword(user.email, user.password)
      .then((data) => {
        db.collection('users').doc(auth.currentUser.uid).get()
        .then((res) => {
          dispatch({
            type: `${authConstant.USER_LOGIN}_SUCCESS`,
            payload: { user: res.data() }
          })
          const loggedInUser = {
            name: res.data().name,
            uid: res.data().uid,
            email: res.data().email,
            isOnline: false,
            location: { lat: null, lng: null }
          }
          localStorage.setItem('user', JSON.stringify(loggedInUser))
          database.ref('status/' + data.user.uid)
          .set({
            state: 'online',
            last_changed: firebase.database.ServerValue.TIMESTAMP,
          })
        })
        
      })
      .catch(error => {
        console.log(error.message)
        dispatch({
          type: `${authConstant.USER_LOGIN}_FAILURE`,
          payload: { error: error.message ? error.message : error }
        })
      })
  }
}

// After reloading page we set user data in redux
export const isLoggedInUser = () => {
  return async dispatch => {
    if(auth.currentUser){
      db.collection('users').doc(auth.currentUser.uid).get()
          .then(snapshot => {
            dispatch({
              type: `${authConstant.USER_LOGIN}_SUCCESS`,
              payload: { user: snapshot.data() }
            })
          })
          .catch((err) => {
            console.error('isLoggedInUser', err.message);
      })
    }
  }
}


export const logout = (uid) => {
  return async dispatch => {
    dispatch({ type: `${authConstant.USER_LOGOUT}_REQUEST` })
    db.collection('users')
      .doc(uid)
      .update({ isOnline: false, location: { lat: null, lng: null } })
      .then(() => {
        database.ref('/status/' + uid)
          // .onDisconnect()
          .remove((err) => {
            if (err) {
              console.error("could not establish onDisconnect event", err);
            }
          });
        auth
          .signOut()
          .then(() => {
            localStorage.clear()
            dispatch({ type: `${authConstant.USER_LOGOUT}_SUCCESS` })

          })
          .catch(error => {
            console.log('error', error)
            dispatch({
              type: `${authConstant.USER_LOGOUT}_FAILURE`,
              payload: { error: error }
            })
          })
      })
      .catch(error => console.log(error))

  }
}