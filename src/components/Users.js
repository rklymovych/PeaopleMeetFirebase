import React, {useEffect, useState, useContext} from 'react'
import {Avatar, ListItem, ListItemAvatar, ListItemText, makeStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import {UserModal} from "./UserModal";
import {useDispatch, useSelector} from "react-redux";
import {getRealtimeUsers} from "../actions";
import {FirebaseContext} from "../context/firebaseContext/firebaseContext";
import {db} from "../firebase";

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

const OnlineDot = (arg) => {
  return <span style={{background: arg.arg ? '#44b700' : 'red'}} className="circle"></span>
}

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
          {/* eslint-disable-next-line array-callback-return */}
          {wroteUsers && wroteUsers.map(user => {
            // if (user.isOnline) {    // flag isOnline
              return (
                  <ListItem
                      key={user.uid}
                      alignItems="flex-start"
                      className={classes.listItem}
                      onClick={() => handleOpenUserModal(user)}
                  >
                    <ListItemAvatar className={classes.listItemAvatar}>
                      <Avatar
                          className={classes.large}
                          alt={user.avatar}
                          src={user.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                        className={classes.text}
                        primary={<Typography color="textPrimary" variant='subtitle1'>{user.name} {<OnlineDot
                            arg={user.isOnline}
                        />}</Typography>}
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
            // }
          })}
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
              // && firstMessageToUserFromServer.length === 0 не понятно зачем это надо было!
              ?
              <Typography component='div' color='textPrimary'>No existed Chat</Typography>
              :
              ''
          }

          {getActiveChatWithUsers && getActiveChatWithUsers.map(user => {
            // if (user.isOnline) {    // flag isOnline
              return (
                  <ListItem
                      key={user.uid}
                      alignItems="flex-start"
                      className={classes.listItem}
                      onClick={() => handleOpenUserModal(user)}
                  >
                    <ListItemAvatar className={classes.listItemAvatar}>
                      <Avatar
                          className={classes.large}
                          alt={user.avatar}
                          src={user.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                        className={classes.text}
                        primary={<Typography color="textPrimary"
                                             variant='subtitle1'>{user.name} {<OnlineDot
                            arg={user.isOnline}
                        />}</Typography>}
                        secondary={
                          <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                // color="textPrimary"
                            >
                            </Typography>
                            {user.description}
                            {user.id}
                          </React.Fragment>
                        }
                    />
                  </ListItem>
              )
            // }
          })}

          {firstMessageToUserFromServer && firstMessageToUserFromServer.map(user => {
            // if (user.isOnline) {    // flag isOnline
              return (
                  <ListItem
                      key={user.uid}
                      alignItems="flex-start"
                      className={classes.listItem}
                      onClick={() => handleOpenUserModal(user)}
                  >
                    <ListItemAvatar className={classes.listItemAvatar}>
                      <Avatar
                          className={classes.large}
                          alt={user.avatar}
                          src={user.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                        primary={<Typography color="textPrimary" variant='subtitle1'>{user.name} {<OnlineDot
                            arg={user.isOnline}
                        />}</Typography>}
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
            // }
          })}
        </List>
        <UserModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            selectedUser={selectedUser}/>
      </div>
      // </SideNav>
  )
}



