import {userConstants} from "./constants";
import {db} from '../firebase'

export const updateCurrentUser = (uid, data) => {
  return async dispatch => {
    const unsubscribe = db.collection('users')
        .doc(uid)
        .onSnapshot((querySnapshot) => {
          console.log('updateCurrentUser', querySnapshot)
        })
    return unsubscribe
  }
}


export const getRealtimeUsers = (uid) => {
  return async dispatch => {

    dispatch({type: `${userConstants.GET_REALTIME_USERS}_REQUEST`})

    const unsubscribe = db.collection("users")
        // .where("uid", "!=", uid)
        .onSnapshot((querySnapshot) => {
          const users = [];
          querySnapshot.forEach((doc) => {
            if (doc.data().uid !== uid) {
              users.push(doc.data());
            }
          });

          dispatch({
            type: `${userConstants.GET_REALTIME_USERS}_SUCCESS`,
            payload: {users}
          })
        });
    return unsubscribe;
  }
}

export const updateMessage = (msgObj) => {
  return async dispatch => {
    db.collection('conversations')
        .add({
          ...msgObj,
          isView: false,
          createdAt: new Date()
        })
        .then((data) => {

          // dispatch({
          //   type: userConstants.GET_REALTIME_MESSAGES
          // })
        })
        .catch(error => console.log(error))
  }
}

export const getRealtimeConversations = (user) => {

  return async dispatch => {
    dispatch({type: userConstants.GET_REALTIME_MESSAGES_REQUEST, payload: true})
    db.collection('conversations')
        .where('user_uid_1', 'in', [user.uid_1, user.uid_2])
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {

          const conversations = []

          querySnapshot.forEach(doc => {

            if ((doc.data().user_uid_1 == user.uid_1 && doc.data().user_uid_2 == user.uid_2)
                ||
                (doc.data().user_uid_1 == user.uid_2 && doc.data().user_uid_2 == user.uid_1)) {
              conversations.push(doc.data())
            }

            // if (conversations.length > 0) {
            //   dispatch({
            //     type: userConstants.GET_REALTIME_MESSAGES,
            //     payload: {conversations}
            //   })
            // } else {
            //   dispatch({
            //     type: `${userConstants.GET_REALTIME_MESSAGES}_FAILURE`,
            //     payload: {conversations}
            //   })
            // }
            dispatch({
              type: userConstants.GET_REALTIME_MESSAGES,
              payload: {conversations}
            })

          })
          dispatch({type: userConstants.GET_REALTIME_MESSAGES_REQUEST, payload: false})

        })
  }
}