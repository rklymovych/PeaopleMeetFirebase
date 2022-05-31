import Typography from "@material-ui/core/Typography";
import {Avatar, ListItem, ListItemAvatar, ListItemText, makeStyles} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {database} from "../../firebase";

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

const FirstMessageFromUser = ({user, handleOpenUserModal}) => {
  const classes = useStyles()
  const [isOnline, setIsOnline] = useState(false)
  const modalHandler = (user) => {
    handleOpenUserModal(user)
  }

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
          onClick={() => modalHandler(user)}
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
                arg={isOnline}
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
}

export default FirstMessageFromUser