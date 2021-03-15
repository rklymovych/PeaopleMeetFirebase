import React, { useEffect, useState } from 'react'
import { SideNav } from "./SideNav";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { Avatar, ListItem, ListItemAvatar, ListItemText, makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";

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
  const { getUid } = useAuth()
  const [users, setUsers] = useState([])

  const getUsers = () => {
    return db.collection("users").get()
      .then((querySnapshot) => {
        const arr = querySnapshot.docs.filter((user => getUid() !== user.id)).map((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.data().uid);
          return doc.data()
        })
        setUsers(arr);
      });
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <SideNav>
      <List
        className={classes.root}
      >
        {users.length && users.map((user, idx) => {
          return (
            <ListItem key={idx} alignItems="flex-start" className={classes.listItem}>
              <ListItemAvatar>
                <Avatar
                  alt={user.avatar}
                  src={user.avatar}
                  onClick={() => console.log(user.uid)}
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
                  </React.Fragment>
                }
              />
            </ListItem>
          )
        })}


      </List>
    </SideNav>

  )
}



