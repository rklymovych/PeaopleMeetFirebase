import {userConstants} from "./constants";
import {db} from '../firebase'

export const getRealtimeUsers = (uid) => {
  return async dispatch => {

    dispatch({type: `${userConstants.GET_REALTIME_USERS}_REQUEST`})

    const unsubscribe = db.collection("users")
        // .where("uid", "!=", uid)
        .onSnapshot((querySnapshot) => {
          const users = [];
          querySnapshot.forEach((doc) => {
            if (doc.data().uid != uid) {
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