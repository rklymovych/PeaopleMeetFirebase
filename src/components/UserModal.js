import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import clsx from 'clsx'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import defaultAvatar from '../assets/avatars/avatar.jpg'
import Typography from "@material-ui/core/Typography";
import {Card, CardActionArea, CardContent, CardMedia, Grid, ListItem, ListItemText} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => {
  console.log(theme)
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
    root: {
      // minWidth: 300
    },
    media: {
      height: 'auto',
      width: '100%',

    },
    dialog: {},
    dialogContent: {
      display: 'flex',
      paddingTop: 0,
    },
    dialogAction: {
      justifyContent: 'space-between',
      display: 'flex'
    },
    padding: {
      padding: '10px 10px 10px 0',
      fontSize: '1.5rem',
      color: theme.palette.text.primary,
      display: 'block'
    },
    colorError: {
      color: theme.palette.error.main
    },
    colorSuccess: {
      color: theme.palette.secondary.main
    }
  }
});

export const UserModal = ({currentUser, openModal, setOpenModal}) => {
  const classes = useStyles();

  const handleClose = () => {
    setOpenModal(false);
  };

  const writeHandler = () => {
    console.log('write handler')
  }

  return (
      <React.Fragment>
        <Dialog
            fullWidth
            maxWidth='lg'
            open={openModal}
            onClose={handleClose}
        >
          <DialogTitle id="max-width-dialog-title"><b>Information about user</b></DialogTitle>

          <Grid container className={classes.dialogContent}>
            <Grid item md={5} sm={12}>
              <DialogContent>
                <Card className={classes.root}>
                  <CardActionArea>
                    <img className={classes.media} src={currentUser?.avatar ?? defaultAvatar}
                         alt={currentUser?.avatar}/>
                  </CardActionArea>
                </Card>
              </DialogContent>
            </Grid>
            <Grid item md={7} sm={12}>
              <DialogContent>
                <Typography component={'span'} variant={'body2'} className={classes.padding}>
                  <b>Name</b> - {currentUser?.name}
                </Typography>
                <Divider/>
                <Typography component={'span'} variant={'body2'} className={classes.padding}>
                  <b>Age</b> - 26
                </Typography>
                <Divider/>
                <Typography component={'span'} variant={'body2'} className={classes.padding}>
                  <b>Sex</b> - Male
                </Typography>
                <Divider/>
                {currentUser?.isOnline ? (
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
                  <b>About</b> - {currentUser?.description}
                </Typography>
                <Divider/>
              </DialogContent>
            </Grid>
          </Grid>
          <DialogActions className={classes.dialogAction}>
            <Button onClick={writeHandler} color="secondary">
              <b>Write to {currentUser?.name}</b>
            </Button>
            <Button onClick={handleClose} color="primary">
              <b>Close</b>
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
  );
}
