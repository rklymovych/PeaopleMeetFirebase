import React, {useReducer} from 'react'
import {FirebaseContext} from "./firebaseContext";
import {firebaseReducer} from "./FirebaseReducer";
import {database, db} from "../../firebase";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  GET_CONVERSATIONS,
  IS_LOADED,
  SET_REAL_USERS,
  GET_WROTE_USERS_IDS,
  SET_SELECTED_USER,
  SET_SELECTED_USER_NULL, GET_WROTE_USERS,
  GET_WROTE_USERS_AND_READ,
  SET_DISTANCE_TO_TARGET
} from "../../actions/constants";
import {useTheme} from "@material-ui/core/styles";

export const FirebaseState = ({children}) => {
  const initialState = {
    myConversationWithCurrentUser: [],
    realUsers: [],
    isLoaded: false,
    unreadMessages: [],
    wroteUsersIds: [],
    wroteUsersAndRead: [],
    wroteUsers: [],
    selectedUserState: {},
    dialogWithUser: [{time: Date.now()}, {userId: ''}],
    distance: null
  }

  const [state, dispatch] = useReducer(firebaseReducer, initialState)

  const useScreenSize = () => {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return (
        keys.reduce((output, key) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const matches = useMediaQuery(theme.breakpoints.up(key));
          return !output && matches ? key : output;
        }, null) || 'xs'
    );
  }

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
      if (pathname.includes(message.user_uid_1) && myId !== message.user_uid_1) {
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
          .where('user_uid_2', '==', uid_1) // wrote to me
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

  const getActiveConversations = (uid_1) => {
    let unsubscribe;
    try {
      unsubscribe = db.collection("conversations")
          .where('user_uid_2', '==', uid_1) // wrote to me
          .onSnapshot((doc) => {
            const wroteUsers = [];
            doc.forEach((user) => {
              if (!wroteUsers.includes(user.data().user_uid_1) && user.data().isRead) {
                wroteUsers.push(user.data().user_uid_1);

              }
              console.log('wroteUsers', wroteUsers)
              checkMessages(uid_1, 'WSFiQhkB09UJNihItiFtC7eLBm43')
            })
// todo: фильтровать юзеров которые написали и все прочитанные!! и выводить вниз юзер пайдж
          })
    } catch (e) {
      console.log(e)
    }
    return unsubscribe;
  }
  // todo закончить эту функцию. Идея такая что показывать в поле существующих юзеров всех юзерв вс кем ведется переписка
  const checkMessages = (uid_1, uid_2) => {
    let unsubscribe;
    try {
      unsubscribe = db.collection("conversations")
          .where('user_uid_1', '==', uid_2)
          .onSnapshot((querySnapshot) => {
            const conversations = []
            querySnapshot.forEach(doc => {

                conversations.push(doc.data())


            })
            console.log('conversations', conversations)
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

  let rad = function (x) {
    return x * Math.PI / 180;
  };
  const getDistanceToTarget = (p1, p2) => {
    let R = 6378137; // Earth’s mean radius in meter
    let dLat = rad(p2.lat - p1.lat);
    let dLong = rad(p2.lng - p1.lng);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    dispatch({
      type: SET_DISTANCE_TO_TARGET,
      payload: d.toFixed(0)
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
        wroteUsers: state.wroteUsers,
        distance: state.distance,
        wroteUsersAndRead: state.wroteUsersAndRead,
        getOnlineUsersChecked,
        makeSelectedUserNull,
        showSelectedUser,
        getConversations,
        filterOwnMessagesDrawerIsOpen,
        updateMessage,
        getWroteUsersIds,
        showWroteUsers,
        removeIdFromWroteUsers,
        makeReadMessages,
        getDistanceToTarget,
        useScreenSize,
        getActiveConversations
      }}
      >
        {children}
      </FirebaseContext.Provider>
  )
}