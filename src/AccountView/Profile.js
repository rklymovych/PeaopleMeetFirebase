import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';
import {useAuth} from "../context/AuthContext";
import {db} from "../firebase";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  },
  center: {
    textAlign: 'center'
  }
}));

const Profile = ({className, ...rest}) => {
  const classes = useStyles();
  const {getUid, currentUser} = useAuth()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = db.collection('users').doc(getUid())
        .onSnapshot((doc) => {
          doc?.exists && setName(doc.data().name)
        });
    return unsubscribe;
  }, []);



  return (

      <Card
          className={clsx(classes.root, className)}
          {...rest}
      >
        <CardContent>
          <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
          >
            <Avatar
                className={classes.avatar}
                // src={user.avatar}
            />
            <Typography
                color="textPrimary"
                gutterBottom
                variant="h3"
                className={classes.center}
            >
              {name}
            </Typography>
            <Typography
                color="textSecondary"
                variant="body1"
            >
              {/*{`${user.city} ${user.country}`}*/}
            </Typography>
            <Typography
                className={classes.dateText}
                color="textSecondary"
                variant="body1"
            >
              {/*{`${moment().format('hh:mm A')} ${user.timezone}`}*/}
            </Typography>
          </Box>
        </CardContent>
        <Divider/>
        <CardActions>
          <Button
              color="primary"
              fullWidth
              variant="text"
          >
            Upload picture
          </Button>
        </CardActions>
      </Card>


  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
