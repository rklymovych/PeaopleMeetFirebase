import React, {useEffect, useState, useContext} from 'react'
import {Avatar, ListItem, ListItemAvatar, ListItemText, makeStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import {UserModal} from "./UserModal";
import {useDispatch, useSelector} from "react-redux";
import {getRealtimeUsers} from "../actions";
import {FirebaseContext} from "../context/firebaseContext/firebaseContext";


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: '5px',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  listItem: {
    cursor: 'pointer',
    border: '1px solid grey',
    borderRadius: '6px',
    marginTop: '5px',
    '&:hover': {
      backgroundColor: '#e6dff0'
    }
  },
  srtike: {
    display: 'block',
    textAlign: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    '& > span': {
      position: 'relative',
      display: 'inline-block',
    },
    '& > span:before': {
      content: "''",
      position: 'absolute',
      top: '50%',
      width: '9999px',
      height: '1px',
      background: theme.palette.grey[300],
      right: '100%',
      marginRight: '15px',
    },
    '& > span:after': {
      content: "''",
      position: 'absolute',
      top: '50%',
      width: '9999px',
      height: '1px',
      background: theme.palette.grey[300],
      left: '100%',
      marginLeft: '15px',
    }
  }
}));

export const Users = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const auth = useSelector(state => state.auth)
  const [selectedUser, setSelectedUser] = useState(null)
  const [openModal, setOpenModal] = useState(false)

  let unsubscribe;
  const {
    wroteUsers,
    wroteUsersIds,
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
      <>
        <List
            className={classes.root}
        >
          <div className={classes.srtike}>
            <span>Unread Chat</span>
          </div>
          {wroteUsers.length === 0 ? <div>No unread messages</div> : ''}
          {/* eslint-disable-next-line array-callback-return */}
          {wroteUsers && wroteUsers.map(user => {
            if (user.isOnline) {    // flag isOnline
              return (
                  <ListItem
                      key={user.uid}
                      alignItems="flex-start"
                      className={classes.listItem}
                      onClick={() => handleOpenUserModal(user)}
                  >
                    <ListItemAvatar>
                      <Avatar
                          alt={user.avatar}
                          src={user.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                        primary={user.name}
                        secondary={
                          <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >
                            </Typography>
                            {user.description}
                            {user.id}
                          </React.Fragment>
                        }
                    />
                  </ListItem>
              )
            }
          })}
          <div className={classes.srtike}>
            <span>Existed Chat</span>
          </div>
          {getActiveChatWithUsers.length === 0 && firstMessageToUserFromServer.length === 0
              ?
              <div>No existed Chat</div>
              :
              ''
          }
          {/* eslint-disable-next-line array-callback-return */}
          {/*{ getActiveChatWithUsers && [...new Set([...firstMessageToUserFromServer, ...getActiveChatWithUsers])].map(user => {*/}
          {getActiveChatWithUsers && getActiveChatWithUsers.map(user => {
            if (user.isOnline) {    // flag isOnline
              return (
                  <ListItem
                      key={user.uid}
                      alignItems="flex-start"
                      className={classes.listItem}
                      onClick={() => handleOpenUserModal(user)}
                  >
                    <ListItemAvatar>
                      <Avatar
                          alt={user.avatar}
                          src={user.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                        primary={user.name}
                        secondary={
                          <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >
                            </Typography>
                            {user.description}
                            {user.id}
                          </React.Fragment>
                        }
                    />
                  </ListItem>
              )
            }
          })}
<hr/>
          {firstMessageToUserFromServer && firstMessageToUserFromServer.map(user => {
            if (user.isOnline) {    // flag isOnline
              return (
                  <ListItem
                      key={user.uid}
                      alignItems="flex-start"
                      className={classes.listItem}
                      onClick={() => handleOpenUserModal(user)}
                  >
                    <ListItemAvatar>
                      <Avatar
                          alt={user.avatar}
                          src={user.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                        primary={user.name}
                        secondary={
                          <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >
                            </Typography>
                            {user.description}
                            {user.id}
                          </React.Fragment>
                        }
                    />
                  </ListItem>
              )
            }
          })}
        </List>
        <UserModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            selectedUser={selectedUser}/>
      </>
      // </SideNav>
  )
}



