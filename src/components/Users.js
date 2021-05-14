import React, {useEffect, useState, useContext} from 'react'
import {db} from "../firebase";
import {useAuth} from "../context/AuthContext";
import {Avatar, ListItem, ListItemAvatar, ListItemText, makeStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import {UserModal} from "./UserModal";
import {UserContext} from '../context/UserContext'
import {SideNav} from "./SideNav";


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
  const classes = useStyles()
  const {getUid} = useAuth()
  const [selectedUser, setSelectedUser] = useState('')
  const {setUsers1} = useContext(UserContext)
  const [users, setUsers] = useState([])
  const [openModal, setOpenModal] = useState(false)

  const getUsers = () => {
    return db.collection("users").get() // надо ли ретурн???
        .then((querySnapshot) => {
          const users = querySnapshot.docs.filter((user => getUid() !== user.id)).map((doc) => {
            return {id: doc.id, ...doc.data()};
          })
          setUsers(users);
          setUsers1(users);
        });
  };

  useEffect(() => {
    getUsers()
  }, [])

  const handleOpenUserModal = (user) => {
    setSelectedUser(user)
    setOpenModal(!openModal)
  }

  return (
      <SideNav>
        <List
            className={classes.root}
        >
          {users.length && users.map(user => {
            // if(user.isOnline){    // flag isOnline
            return (
                <ListItem
                    key={user.id}
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
            // }
          })}
        </List>
        <UserModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            selectedUser={selectedUser}/>
      </SideNav>
  )
}



