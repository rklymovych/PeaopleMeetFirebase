import React, {useReducer} from 'react'
import {FirebaseContext} from "./firebaseContext";
import {firebaseReducer} from "./FirebaseReducer";
import {database, db} from "../../firebase";
import {
  GET_CONVERSATIONS,
  IS_LOADED,
  SET_REAL_USERS,
  SET_UNREAD_MESSAGES,
  GET_WROTE_USERS,
  UPDATE_MESSAGES,
  SET_SELECTED_USER,
  SET_SELECTED_USER_NULL
} from "../../actions/constants";

export const FirebaseState = ({children}) => {
  const initialState = {
    conversations: [],
    realUsers: [],
    isLoaded: false,
    unreadMessages: [],
    wroteUsers: [],
    selectedUserState: {}
  }

  const [state, dispatch] = useReducer(firebaseReducer, initialState)

  const getConversations = (uid_1, uid_2) => {
    let unsubscribe;
    try {
      dispatch({type: IS_LOADED, payload: true})

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

    database.ref('status/')
        .on('value', snap => {
          if (!snap.val()) return
          setRealTimeUsers = onlineUsers.filter(user => Object.keys(snap.val()).includes(user.uid))
          dispatch({
            type: SET_REAL_USERS,
            payload: setRealTimeUsers
          })
        })

  }

  const getUnreadMessages = (uid_1) => {
    db.collection("conversations")
        .onSnapshot((doc) => {
          const unreadMessages = [];
          doc.forEach((matchMessages) => {
            if (matchMessages.data().user_uid_2 === uid_1 && matchMessages.data().isRead === false) {
              unreadMessages.push(matchMessages.data())
            }
          })
          dispatch({
            type: SET_UNREAD_MESSAGES,
            payload: unreadMessages
          })
        })
  }

  const getWroteUsers = () => {
    let usersId = new Set([])
    let users = []
    const unreadMessages = state.unreadMessages

    unreadMessages.map(el => usersId.add(el.user_uid_1))
    usersId.forEach(wroteUsers => {
      db.collection('users')
          .where('uid', '==', wroteUsers)
          .onSnapshot(snap => {
            snap.forEach(user => {
              users.push(user.data())
            })
            dispatch({
              type: GET_WROTE_USERS,
              payload: users
            })

          })
    })
  }

  const showSelectedUser = (selectedUser) => {
    dispatch({
      type: SET_SELECTED_USER,
      payload: selectedUser
    })
  }
  const makeSelectedUserNull = () => {
    dispatch({
      type: SET_SELECTED_USER_NULL,
      payload: {}
    })
  }
  return (
      <FirebaseContext.Provider value={{
        isLoaded: state.isLoaded,
        conversations: state.conversations,
        realUsers: state.realUsers,
        unreadMessages: state.unreadMessages,
        wroteUsers: state.wroteUsers,
        selectedUserState: state.selectedUserState,
        getOnlineUsersChecked,
        makeSelectedUserNull,
        showSelectedUser,
        getUnreadMessages,
        getConversations,
        updateMessage1,
        getWroteUsers
      }}
      >
        {children}
      </FirebaseContext.Provider>
  )
}