import React, {useContext, useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import clsx from 'clsx'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import defaultAvatar from '../assets/avatars/avatar.jpg'
import Typography from "@material-ui/core/Typography";
import {Card, CardActionArea, Grid} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import {useHistory} from "react-router-dom";
import {FirebaseContext} from "../context/firebaseContext/firebaseContext";

const useStyles = makeStyles((theme) => {
  return {
    form: {
      display: 'flex',
      flexDirection: 'column',
      margin: 'auto',
      width: 'fit-content',
    },
    formControl: {
      marginTop: theme.spacing(2),
      minWidth: 120,
    },
    formControlLabel: {
      marginTop: theme.spacing(1),
    },
    media: {
      height: 'auto',
      width: '100%',

    },
    dialogAction: {
      justifyContent: 'space-between',
      display: 'flex'
    },
    padding: {
      padding: '10px 10px 10px 0',
      fontSize: theme.typography.pxToRem(16),
      color: theme.palette.text.primary,
      display: 'block'
    },
    colorError: {
      color: theme.palette.error.main
    },
    colorSuccess: {
      color: theme.palette.success.main
    },
    dialogTitle: {
      paddingBottom: 0,
    },
    paddingTop: {
      padding: '0!important',
    },
    overrides: {
      'MuiDivider-root': {
        root: {
          paddingBottom: '10px!important',
        },
      },
    },
    MuiDividerRoot: {
      paddingTop: '10px!important',
    },
    divider: {
      marginBottom: '10px'
    },
    activeButtons: theme.palette.activeButtons
  }
});

export const UserModal = ({selectedUser, openModal, setOpenModal}) => {
  const classes = useStyles();
  const history = useHistory()
  const {
    distance,
    getDistanceToTarget,
    showSelectedUser,
    wroteUsersIds,
    removeIdFromWroteUsers,
    useScreenSize
  } = useContext(FirebaseContext)
  // todo Cannot destructure property 'location' of 'JSON.parse(...)' as it is null. возможно потому что я добавил новое поле ['not empty array']
  const {location} = JSON.parse(localStorage.getItem('user')) || {}

  const handleClose = () => {
    setOpenModal(false);
  };

  const writeHandler = () => {
    removeIdFromWroteUsers(selectedUser, wroteUsersIds)
    showSelectedUser(selectedUser)
    history.push(`map/chat/${selectedUser.uid}`)
    // history.push('/map')
  }

  useEffect(() => {
    if (selectedUser) {
      getDistanceToTarget(location, selectedUser?.location)
    }
  }, [selectedUser])

  return (
      <React.Fragment>
        <Dialog
            fullWidth
            maxWidth='md'
            open={openModal}
            onClose={handleClose}
        >
          {/*<DialogTitle className={classes.dialogTitle} id="max-width-dialog-title"><b>Information about user</b></DialogTitle>*/}

          <Grid container>
            <Grid item sm={5} style={{height: '100%'}}>
              <DialogContent className='px-0 py-0 px-sm-2 py-sm-2'>
                <Card>
                  <CardActionArea>
                    <img className={classes.media} src={selectedUser?.avatar ?? defaultAvatar}
                         alt={selectedUser?.avatar}/>
                  </CardActionArea>
                </Card>
              </DialogContent>
            </Grid>
            <Grid item sm={7} style={{width: '100%'}}>
              <DialogContent className='px-2 py-0 px-sm-2 py-sm-2'>
                <Typography component={'span'} variant={'body2'} className={classes.padding}>
                  <b>Name</b> - {selectedUser?.name}
                </Typography>
                <Divider classes={{root: classes.divider}}/>
                <Typography component={'span'} variant={'body2'} className={classes.padding}>
                  <b>Age</b> - {selectedUser?.age}
                </Typography>
                <Divider/>
                <Typography component={'span'} variant={'body2'} className={classes.padding}>
                  <b>Sex</b> - {selectedUser?.sex}
                </Typography>
                <Divider/>
                {selectedUser?.isOnline ? (
                    <>
                      <Typography
                          component={'span'}
                          variant={'body2'}
                          style={{color: 'secondary'}}
                          className={clsx(classes.padding, classes.colorSuccess)}
                      >
                        <b>Online</b>
                      </Typography>
                      <Divider/>
                    </>
                ) : (
                    <>
                      <Typography
                          component={'span'}
                          variant={'body2'}
                          className={clsx(classes.padding, classes.colorError)}
                      >
                        <b>Offline</b>
                      </Typography>
                      <Divider/>
                    </>
                )
                }
                <Typography component={'span'} variant={'body2'} className={classes.padding}>
                  <b>Distance</b> - {distance ? distance : ''} m
                </Typography>
                <Divider/>
                <Typography component={'span'} variant={'body2'} className={classes.padding}>
                  <b>About</b> - {selectedUser?.description}
                </Typography>
                <Divider/>
              </DialogContent>
            </Grid>
          </Grid>
          <DialogActions className={classes.dialogAction}>
            <Button
                onClick={handleClose}
                color="secondary"
            >
              <b>Close</b>
            </Button>
            <Button
                variant="contained"
                className={classes.activeButtons}
                onClick={writeHandler} color='secondary'>
              <b>Write</b>
            </Button>

          </DialogActions>
        </Dialog>
      </React.Fragment>
  );
}
