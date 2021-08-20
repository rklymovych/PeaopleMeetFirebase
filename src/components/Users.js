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
  }
}));

export const Users = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const auth = useSelector(state => state.auth)
  const [selectedUser, setSelectedUser] = useState('')
  const [openModal, setOpenModal] = useState(false)

  let unsubscribe;
  const { wroteUsers, unreadMessages, wroteUsersIds, showWroteUsers} = useContext(FirebaseContext)
  // const getUsers = () => {
  //   return db.collection("users").get() // надо ли ретурн???
  //       .then((querySnapshot) => {
  //         const users = querySnapshot.docs.filter((user => getUid() !== user.id)).map((doc) => {
  //           return {id: doc.id, ...doc.data()};
  //         })
  //         console.log(users)
  //         setUsers(users);
  //         setUsers1(users);
  //       });
  // };
  //
  //
  // useEffect(() => {
  //   getUsers()
  // }, [])
  useEffect(() => {
    if (auth.uid) {
      // getWroteUsers()
    }
  }, [auth.uid, unreadMessages])
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
  useEffect(()=>{
    const unsubscribe = showWroteUsers(wroteUsersIds);
    return unsubscribe;
  },[wroteUsersIds])

  return (
      <>
        <List
            className={classes.root}
        >
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
        </List>
        <UserModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            selectedUser={selectedUser}/>
      </>
      // </SideNav>
  )
}



