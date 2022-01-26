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
  GET_ACTIVE_CHAT_WITH_USERS,
  GET_ACTIVE_CONVERSATION,
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
    getActiveChatWithUsers: [],
    firstMessageToUserFromServer: [],
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

  const getIdsActiveChat = (uid_1) => {
    let unsubscribe;
    try {
      unsubscribe = db.collection("conversations")
          .where('user_uid_2', '==', uid_1) // wrote to me
          .onSnapshot((doc) => {
            const numberWroteUsersIds = [];
            const wroteUsersIds = state.wroteUsersIds;
            doc.forEach((messages) => {
              if (!numberWroteUsersIds.includes(messages.data().user_uid_1)) {
                numberWroteUsersIds.push(messages.data().user_uid_1);
              }
            })
            let activeChatWithUsersIds = numberWroteUsersIds.filter(id => {
              return !wroteUsersIds.includes(id)
            })

            filterIdsActiveChatFromServer(uid_1, activeChatWithUsersIds)
            makeUsersFromIdsActiveChat(activeChatWithUsersIds)

          })
    } catch (e) {
      console.log(e)
    }
    return unsubscribe;
  }

  const filterIdsActiveChatFromServer = (uid_1, activeChatWithUsersIds) => {

    db.collection('users').doc(uid_1).get()
        .then(idsCollection => {
          let collection = idsCollection.data().activeConversation || [];
          collection = collection.filter(usersId => !state.wroteUsersIds.includes(usersId) && !activeChatWithUsersIds.includes(usersId));
          db.collection('users').doc(uid_1)
              .update({
                activeConversation: collection
              })
          // console.log('active Chat With Users Ids', activeChatWithUsersIds)
          // console.log('first message to user Ids', collection)
          // console.log('unread Users Ids', state.wroteUsersIds)
        })
  }


  // todo: переназвать срочно все функции по человечески


  const setIdFirstActiveConversationOnServer = (uid_1, uid_2) => {
    let unsubscribe;
    try {
      unsubscribe = db.collection("conversations")
      unsubscribe.where('user_uid_1', '==', uid_2).where('user_uid_2', '==', uid_1)
          .onSnapshot((querySnapshot) => {
            if (!querySnapshot.empty) return;

            let active = db.collection('users').doc(uid_1).get()
            active.then(el => {
              let activeConv = el.data().activeConversation
              if (!activeConv) {
                el.ref.update({
                  activeConversation: [uid_2]
                })
              } else {
                if (!activeConv.includes(uid_2)) {
                  activeConv.push(uid_2)
                  el.ref.update({
                    activeConversation: activeConv
                  })
                }

              }

            })
          })
    } catch (e) {
      console.log(e)
    }
    return unsubscribe
  }

  const makeUsersFromIdsActiveChat = (activeChatWithUsersIds) => {
    let unsubscribe;
    try {
      unsubscribe = db.collection('users')
          .onSnapshot((querySnapshot) => {
            const chatWithUsers = [];
            querySnapshot.forEach((user) => {
              if (activeChatWithUsersIds.includes(user.data().uid)) {
                chatWithUsers.push(user.data())
              }
            })
            dispatch({
              type: GET_ACTIVE_CHAT_WITH_USERS,
              payload: chatWithUsers
            })
          })
    } catch (e) {
      console.log(e)
    }
    return unsubscribe;
  }

  const getActiveConversationWithoutAnswer = (uid) => {
    let activeIds;
    try {
      activeIds = db.collection('users').doc(uid).get()
      activeIds.then(el => {
        let activeConversation = el.data()?.activeConversation

        if (activeConversation !== undefined ) {
          db.collection('users')
              .where('uid', 'in', activeConversation)// activeConversation этот массив не должен быть пустым!
              .onSnapshot((querySnapshot) => {
                const activeUsersArr = []
                querySnapshot.forEach(activeUsers => {

                  activeUsersArr.push(activeUsers.data())
                })

                dispatch({
                  type: GET_ACTIVE_CONVERSATION,
                  payload: activeUsersArr
                })
              })
        }
      })
    } catch (e) {
      console.log(e)
    }
    return activeIds;
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
      let index = userIds.indexOf(user.uid)
      if (index > -1) {
        userIds.splice(index, 1)

      }
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
        getActiveChatWithUsers: state.getActiveChatWithUsers,
        firstMessageToUserFromServer: state.firstMessageToUserFromServer,
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
        getIdsActiveChat,
        setIdFirstActiveConversationOnServer,
        getActiveConversationWithoutAnswer
      }}
      >
        {children}
      </FirebaseContext.Provider>
  )
}