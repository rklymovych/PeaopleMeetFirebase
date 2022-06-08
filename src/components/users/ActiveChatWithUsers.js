import {Avatar, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, {useEffect, useState} from "react";
import {database} from "../../firebase";

const ActiveChatWithUsers = ({user, handleOpenUserModal, OnlineDot, classes}) => {
  const [isOnline, setIsOnline] = useState(false)

  const checkOnlineUser = async (id) => {
    const starCountRef = database.ref('/status/' + id);
    starCountRef.on('value', (async (snapshot) => {
      const isOnlineData = await snapshot.val() && snapshot.val().isOnline;
      setIsOnline(isOnlineData)
    }))
  }

  useEffect(async () => {
    await checkOnlineUser(user?.uid)

  }, [user])

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
                arg={isOnline}
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
}

export default ActiveChatWithUsers;