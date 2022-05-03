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
import {useDispatch} from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    height: 200,
    width: 200
  },
  center: {
    textAlign: 'center'
  },
  topAndButtons: theme.palette.topAndButtons,
  activeButtons: theme.palette.activeButtons

}));

const Profile = ({ className, auth, ...rest }) => {
  const dispatch = useDispatch()
  const classes = useStyles();
  const { getUid, myAccount } = useAuth()

  const uploadPhotoHandler = async (e) => {
    const file = e.target.files[0]
    const storageRef = storage.ref(`users/${getUid()}/`)
    const fileRef = storageRef.child(file.name)
    await fileRef.put(file)
    const fileUrl = await fileRef.getDownloadURL()
    myAccount()
      .set({ avatar: fileUrl }, { merge: true })
      dispatch({
        type: 'SET_AVATAR_CURRENT_USER',
        payload: fileUrl
      })
  }

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
            src={auth.avatar}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
            className={classes.center}
          >
            {auth.name}
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
          className={classes.activeButtons}
          variant="contained"
          component="label"
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
