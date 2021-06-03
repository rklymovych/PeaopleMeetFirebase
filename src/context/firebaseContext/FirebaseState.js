import React, {useReducer} from 'react'
import {FirebaseContext} from "./firebaseContext";
import {firebaseReducer} from "./FirebaseReducer";
import {database, db} from "../../firebase";
import {GET_CONVERSATIONS, IS_LOADED, SET_REAL_USERS, UPDATE_MESSAGES} from "../../actions/constants";

export const FirebaseState = ({children}) => {
  const initialState = {
    conversations: [],
    realUsers: [],
    isLoaded: false
  }
  const [state, dispatch] = useReducer(firebaseReducer, initialState)

  const getConversations = (uid_1, uid_2) => {
    let unsubscribe;
    try {
      dispatch({type: IS_LOADED, payload: true})
      console.log(initialState.isLoaded)
      unsubscribe = db.collection('conversations')
          .where('user_uid_1', 'in', [uid_1, uid_2])
          .orderBy('createdAt', 'asc')
          .onSnapshot((querySnapshot) => {
            const conversations = []
            querySnapshot.forEach(doc => {
              if ((doc.data().user_uid_1 == uid_1 && doc.data().user_uid_2 == uid_2)
                  ||
                  (doc.data().user_uid_1 == uid_2 && doc.data().user_uid_2 == uid_1)) {
                conversations.push(doc.data())

              }
            })

            dispatch({
              type: GET_CONVERSATIONS,
              payload: conversations
            })
            dispatch({type: IS_LOADED, payload: false})
          })
    } catch (e) {
      throw new Error(e.message)
    }
    return unsubscribe
  }

  const updateMessage1 = async (msgObj) => {
    try {
      await db.collection('conversations')
          .add({
            ...msgObj,
            isRead: false,
            createdAt: new Date()
          })
    } catch (e) {
      throw new Error(e.message)
    }
  }
  // rxjs
  const getOnlineUsersChecked = () => {

    let unsubscribe
    try {
      unsubscribe = db.collection('users')
          .where('isOnline', '==', true)
          .onSnapshot((querySnapshot) => {
            const users = []
            querySnapshot.forEach((doc) => {
              users.push(doc.data())
            });
            getUsersOnlineRealTime(users)
          });
    } catch (e) {
      console.log(e.message)
    }
    return unsubscribe
  }

  const getUsersOnlineRealTime = (onlineUsers) => {
    let setRealTimeUsers = [];
    let unsubscribe;
    try {
      unsubscribe = database.ref('status/')
          .on('value', snap => {
            if (!snap.val()) return
            setRealTimeUsers = onlineUsers.filter(user => Object.keys(snap.val()).includes(user.uid))
            dispatch({
              type: SET_REAL_USERS,
              payload: setRealTimeUsers
            })
          })
    } catch (e) {
      console.log(e.message)
      return e
    }
    return unsubscribe;
  }

  const messagesUnread = (uid_1) => {
    db.collection("conversations")
        .onSnapshot((doc) => {
          const myMessages = []
          doc.forEach((matchMessages) => {
            if (matchMessages.data().user_uid_2 === uid_1) {
              console.log('matchMessages.data().user_uid_2', matchMessages.data().user_uid_2)
              myMessages.push(matchMessages.data())
            }
            console.log('myMessages', myMessages)
            return myMessages
          })
        })

  }

  return (
      <FirebaseContext.Provider value={{
        isLoaded: state.isLoaded,
        conversations: state.conversations,
        realUsers: state.realUsers,
        getOnlineUsersChecked,
        messagesUnread,
        getConversations,
        updateMessage1,
      }}
      >
        {children}
      </FirebaseContext.Provider>
  )
}