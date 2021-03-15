import React, { useEffect, useState } from 'react';
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
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import {getAvatar} from "../services/firestoreFunctions";

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

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();
  const { getUid } = useAuth()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    const unsubscribe = db.collection('users').doc(getUid())
      .onSnapshot((doc) => {
        doc?.exists && setName(doc.data().name)
      });
    return unsubscribe;
  }, []);
  // getAvatar(getUid())
  const uploadPhotoHandler = async (e) => {
    const file = e.target.files[0]
    const storageRef = storage.ref(`users/${getUid()}/`)
    const fileRef = storageRef.child(file.name)
    await fileRef.put(file)
    const fileUrl = await fileRef.getDownloadURL()
    db.collection('users').doc(getUid())
      .set({ avatar: fileUrl }, { merge: true })
    setAvatar(fileUrl)
  }

  useEffect(() => {
    const fetchUsers = async () => {
      db.collection("users").doc(getUid())
        .get()
        .then((doc) => {
          setAvatar(doc?.data()?.avatar ?? '');
        }, error => {
          console.log('Profile', error.message);
        })
    }
    fetchUsers()
  }, [])

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
            src={avatar}
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
      <Divider />
      <CardActions>
        <Button
          variant="contained"
          component="label"
          color="primary"
          fullWidth
          onChange={uploadPhotoHandler}
        >
          Upload Photo
            <input
            type="file"
            hidden
          />
        </Button>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
