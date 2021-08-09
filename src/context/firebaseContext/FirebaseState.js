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
  SET_SELECTED_USER,
  SET_SELECTED_USER_NULL
} from "../../actions/constants";

export const FirebaseState = ({children}) => {
  const initialState = {
    myConversationWithCurrentUser: [],
    realUsers: [],
    isLoaded: false,
    unreadMessages: [],
    wroteUsersIds: [],
    selectedUserState: {},
    dialogWithUser: [{time: Date.now()}, {userId: ''}]
  }

  const [state, dispatch] = useReducer(firebaseReducer, initialState)

  const getConversations = async (uid_1, uid_2) => {
    let unsubscribe;
    try {
      dispatch({type: IS_LOADED, payload: true})

      unsubscribe = await db.collection('conversations')
          .where('user_uid_1', 'in', [uid_1, uid_2])
          .orderBy('createdAt', 'asc')
          .onSnapshot((querySnapshot) => {
            const conversations = []
            querySnapshot.forEach(doc => {
              if ((doc.data().user_uid_1 === uid_1 && doc.data().user_uid_2 === uid_2)
                  ||
                  (doc.data().user_uid_1 === uid_2 && doc.data().user_uid_2 === uid_1)) {
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
    return unsubscribe;
  }

  const updateMessage = async (msgObj) => {
    console.log('first')
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

  const getWroteUsersIds = async (uid_1) => {
    let unsubscribe;
    try {
      unsubscribe = await db.collection("conversations")
          .where('user_uid_2', '==', uid_1)
          .orderBy('createdAt', 'asc')
          .onSnapshot((doc) => {
            const unreadMessages = [];
            const wroteUsersID = [];
            doc.forEach((matchMessages) => {
              // unreadMessages.push(matchMessages.data())
              console.log(matchMessages.data().user_uid_1)
              if(!wroteUsersID.includes(matchMessages.data().user_uid_1)){
                wroteUsersID.push(matchMessages.data().user_uid_1);
              }
            })
            dispatch({
              type: GET_WROTE_USERS,
              payload: wroteUsersID
            })
          })
    } catch (e) {
      console.log(e)
    }
    return unsubscribe;
  }

  const   getMyUnreadMessages= (unreadMessages) => {
    console.log('getWroteUsers1')
    // let usersId = new Set([])
    // let users = []
    // // const unreadMessages = state.unreadMessages
    // unreadMessages && unreadMessages.map(el => usersId.add(el.user_uid_1))
    // console.log(3)
    // usersId.forEach(wroteUsers => {
    //   console.log(usersId, wroteUsers)
    //   db.collection('users')
    //       .where('uid', '==', wroteUsers)
    //       .onSnapshot(snap => {
    //           console.log('thiiiiiis')
    //         snap.forEach(user => {
    //           users.push(user.data())
    //         })
    //         console.log('thiiiiiis222')
    //         dispatch({
    //           type: GET_WROTE_USERS,
    //           payload: users
    //         })
    //         console.log('thiiiiiis3333')
    //       })
    // })
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
        myConversationWithCurrentUser: state.myConversationWithCurrentUser,
        realUsers: state.realUsers,
        unreadMessages: state.unreadMessages,
        wroteUsersIds: state.wroteUsersIds,
        selectedUserState: state.selectedUserState,
        getOnlineUsersChecked,
        makeSelectedUserNull,
        showSelectedUser,
        getMyUnreadMessages,
        getConversations,
        updateMessage,
        getWroteUsersIds,
      }}
      >
        {children}
      </FirebaseContext.Provider>
  )
}