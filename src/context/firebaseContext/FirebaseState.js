import React, {useReducer} from 'react'
import {FirebaseContext} from "./firebaseContext";
import {firebaseReducer} from "./FirebaseReducer";
import {database, db} from "../../firebase";
import {
  GET_CONVERSATIONS,
  IS_LOADED,
  SET_REAL_USERS,
  GET_WROTE_USERS_IDS,
  SET_SELECTED_USER,
  SET_SELECTED_USER_NULL, GET_WROTE_USERS
} from "../../actions/constants";

export const FirebaseState = ({children}) => {
  const initialState = {
    myConversationWithCurrentUser: [],
    realUsers: [],
    isLoaded: false,
    unreadMessages: [],
    wroteUsersIds: [],
    wroteUsers: [],
    selectedUserState: {},
    dialogWithUser: [{time: Date.now()}, {userId: ''}]
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
    return unsubscribe
  }

  const filterOwnMessagesDrawerIsOpen = (myId) => {
    const pathname = window.location.pathname;
    const messages = state.myConversationWithCurrentUser.filter(mes => mes.isRead === false)
    messages.map(message => {
      if(pathname.includes(message.user_uid_1) && myId !== message.user_uid_1){
        makeReadMessages(message.user_uid_1)
      }
    })
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

  const getWroteUsersIds = (uid_1) => {
    let unsubscribe;
    try {
      unsubscribe = db.collection("conversations")
          .where('user_uid_2', '==', uid_1)
          .onSnapshot((doc) => {
            const wroteUsersIds = [];
            doc.forEach((userId) => {
              const pathname = window.location.pathname
              if (!wroteUsersIds.includes(userId.data().user_uid_1) && !userId.data().isRead && !pathname.includes(userId.data().user_uid_1)) {
                wroteUsersIds.push(userId.data().user_uid_1);
              }
            })
            dispatch({
              type: GET_WROTE_USERS_IDS,
              payload: wroteUsersIds
            })
          })
    } catch (e) {
      console.log(e)
    }
    return unsubscribe;
  }

  const showWroteUsers = (usersId) => {
    let unsubscribe;
    try {
      unsubscribe = db.collection('users')
          .onSnapshot((querySnapshot) => {
            const wroteUsers = [];
            querySnapshot.forEach((user) => {
              if (usersId.includes(user.data().uid)) {
                wroteUsers.push(user.data())
              }
            })

            dispatch({
              type: GET_WROTE_USERS,
              payload: wroteUsers
            })
          })
    } catch (e) {
      console.log(e);
    }
    return unsubscribe;
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

  const removeIdFromWroteUsers = (user, userIds) => {
    if (userIds.includes(user.uid)) {
      makeReadMessages(user.uid)
      userIds.splice(user.uid, 1)
    }
  }

  const makeReadMessages = (wroteUserId) => {
    let unsubscribe;
    try {
      unsubscribe = db.collection('conversations')
          .where("user_uid_1", "==", wroteUserId).get()
          .then(messages => {
            messages.forEach((doc) => {
              doc.ref.update({
                isRead: true
              });
            });
          })

    } catch (e) {
      console.log(e)
    }
    return unsubscribe;
  }
  return (
      <FirebaseContext.Provider value={{
        isLoaded: state.isLoaded,
        myConversationWithCurrentUser: state.myConversationWithCurrentUser,
        realUsers: state.realUsers,
        unreadMessages: state.unreadMessages,
        wroteUsersIds: state.wroteUsersIds,
        selectedUserState: state.selectedUserState,
        wroteUsers: state.wroteUsers,
        getOnlineUsersChecked,
        makeSelectedUserNull,
        showSelectedUser,
        getConversations,
        filterOwnMessagesDrawerIsOpen,
        updateMessage,
        getWroteUsersIds,
        showWroteUsers,
        removeIdFromWroteUsers,
        makeReadMessages
      }}
      >
        {children}
      </FirebaseContext.Provider>
  )
}