import React, { useEffect, useState, useContext } from 'react'
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import { useDispatch, useSelector } from "react-redux";
import { getRealtimeUsers } from "../../actions";
import { FirebaseContext } from "../../context/firebaseContext/firebaseContext";
import UserModal from "./UserModal";
import WroteUsers from "./WroteUsers";
import ActiveChatWithUsers from "./ActiveChatWithUsers";
import FirstMessageFromUser from "./FirstMessageFromUSer";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: '5px',
  },
  inline: {
    display: 'inline',
  },
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  listItemAvatar: {
    minWidth: '80px',
    marginTop: 0
  },
  listItem: theme.listItem,
  customDivider: theme.customDivider,
  userPageWrapper: theme.userPageWrapper,
  text: theme.palette.text.primary,
}));


const Users = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const auth = useSelector(state => state.auth)
  const [selectedUser, setSelectedUser] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  let unsubscribe;
  const {
    wroteUsers, // юзеры которые написали и сообщение еще не прочитанны
    wroteUsersIds, // id юзеров которые написали и сообщение еще не прочитанны
    getIdsActiveChat,
    showWroteUsers,
    getActiveChatWithUsers,
    getActiveConversationWithoutAnswer,
    firstMessageToUserFromServer // users
  } = useContext(FirebaseContext)

  useEffect(() => {
    if (auth.uid) {
      const unsubscribe = getIdsActiveChat(auth.uid)
      return unsubscribe
    }

  }, [wroteUsersIds])

  useEffect(() => {
    if (auth.uid) {
      let unsubscribe = getActiveConversationWithoutAnswer(auth.uid);
      return unsubscribe
    }

  }, [wroteUsersIds, getActiveChatWithUsers])

  useEffect(() => {

    unsubscribe = dispatch(getRealtimeUsers(auth.uid))
      .then(unsubscribe => {
        return unsubscribe;
      })
      .catch(error => console.log(error))


  }, [auth.uid])


  useEffect(() => {
    return () => {
      //cleanup
      unsubscribe.then(f => f()).catch(error => console.log(error))
    }
  }, [])

  const handleOpenUserModal = (user) => {
    setSelectedUser(user)
    setOpenModal(!openModal)
  }
  useEffect(() => {
    const unsubscribe = showWroteUsers(wroteUsersIds);
    return unsubscribe;
  }, [wroteUsersIds])

  useEffect(() => {
    if (!openModal) {
      setSelectedUser(null)
    }
  }, [openModal])

  return (
    <div className={classes.userPageWrapper}>
      <List
        className={classes.root}
      >
        <div className={classes.customDivider}>
          <Typography
            component='span'
            variant='body1'
            color="textPrimary"
          >
            Unread Messages
          </Typography>
        </div>
        {wroteUsers.length === 0 ?
            <Typography component='div' color='textPrimary'>No unread messages</Typography> : ''}
        {wroteUsers && wroteUsers.map(user => {
          return <WroteUsers key={user.uid} user={user} handleOpenUserModal={handleOpenUserModal} />
          })
        }

        <div className={classes.customDivider}>
          <Typography
            component='span'
            variant='body1'
            color="textPrimary"
          >
            Read Messages
          </Typography>
        </div>
        {getActiveChatWithUsers.length === 0
          ?
          <Typography component='div' color='textPrimary'>No existed Chat</Typography>
          :
          ''
        }

        {getActiveChatWithUsers && getActiveChatWithUsers.map((user) => {
          return <ActiveChatWithUsers key={user.uid} user={user} handleOpenUserModal={handleOpenUserModal}/>
        })}

        {firstMessageToUserFromServer && firstMessageToUserFromServer.map(user => {
          return <FirstMessageFromUser key={user.uid} user={user} handleOpenUserModal={handleOpenUserModal} />
        })}
      </List>
      <UserModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedUser={selectedUser} />
    </div>
    // </SideNav>
  )
}

export default Users