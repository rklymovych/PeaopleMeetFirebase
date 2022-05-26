import React, { useContext, useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/Mail';
import { useHistory } from "react-router-dom";
import { database, db } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { Badge, MenuItem } from "@material-ui/core";
import firebase from "firebase";
import { FirebaseContext } from "../context/firebaseContext/firebaseContext";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from "../context/AuthContext";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { getCurrentPosition } from "../utils/utils";

const TopBar = ({ setState }) => {
  // export const TopBar  = ({setState}) =>{
  const auth = useSelector(state => state.auth)
  const localStorageDarkMode = JSON.parse(localStorage.getItem('darkMode'))
  let darkMode = localStorageDarkMode || false

  const useStyles = makeStyles((theme) => {
    return {
      root: {
        backgroundColor: '#3d5afe',
        boxShadow: theme.shadows[4]
      },
      topAndButtons: theme.palette.topAndButtons,
      icons: theme.palette.icons,
      switchBase: theme.palette.switchBase,
      checked: theme.palette.checked,
      track: theme.palette.track,
    }

  })

  const classes = useStyles();
  const history = useHistory()
  const { getUid, myAccount } = useAuth()
  const {
    getWroteUsersIds,
    wroteUsersIds,
  } = useContext(FirebaseContext)
  const handleDrawerOpen = () => {
    setState({ 'left': true });
  };

  const dispatch = useDispatch()

  //  make offline Users/
  const userStatusDatabaseRef = database.ref('/status/' + auth.uid);
  // myAccount().get()
  //     .then((r) => {
  //       // console.log(58, r.data());
  //     })

  const isOnlineForDatabase = {
    isOnline: true, // todo visible
    isActive: auth.isOnline,
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  const isOfflineForDatabase = {
    isOnline: false,
    isActive: auth.isOnline,
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  const onlineHandler = ({target: {checked}}) => {
    const meFromLocal = JSON.parse(localStorage.getItem('user'))

    if (checked) {
      getCurrentPosition((position) => {
        myAccount()
          .update({
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isOnline: true
          })

        localStorage.setItem('user', JSON.stringify({
          ...meFromLocal,
          isOnline: true,
          location: { lat: position.coords.latitude, lng: position.coords.longitude }
        }))

        dispatch({
          type: 'GET_STATUS_CURRENT_USER',
          payload: {
            isOnline: true,
            location: { lat: position.coords.latitude, lng: position.coords.longitude }
          }
        })
      })
    } else {
      myAccount()
        .update({
          location: { lat: null, lng: null },
          isOnline: false
        })
      localStorage.setItem('user', JSON.stringify({
        ...meFromLocal,
        isOnline: false,
        location: { lat: null, lng: null }
      }))
      dispatch({
        type: 'GET_STATUS_CURRENT_USER',
        payload: {
          isOnline: false,
          location: { lat: null, lng: null }
        }
      })
    }
  }
  useEffect(() => {
    if (auth.uid) {

      database.ref('.info/connected').on('value', function (snapshot) {
        if (snapshot.val() === true) {
          userStatusDatabaseRef.set(isOnlineForDatabase);
        } else {
          console.log(1)
          userStatusDatabaseRef.onDisconnect().remove()
                                                              // ТУТ КАКАЯ-ТО ДИЧЬ
          // userStatusDatabaseRef.set();
          // myAccount().update({
          //   location: {
          //     lat: null,
          //     lng: null,
          //   },
          //   isOnline: false
          // });
          // не получается надо сделать что бы не удалялось поле из реалтайм, а делалось оффлайн
          // userStatusDatabaseRef.onDisconnect().remove(()=>{
          //   firebase.database().ref(`status/${getUid()}/`).update({
          //     leaved: true
          //   })
          // // })
          // // firebase.database().goOffline();
          // console.log('что за чепуха')
          //
          //
          // userStatusDatabaseRef.onDisconnect().set({
          //   leaved: true
          // })
          // .then(()=>{
          //
          //   myAccount().update({
          //     location: false
          //   })
          // })
        }
      });
    }
  }, [auth.uid])
  //  make offline Users END****/

  useEffect(() => {
    if (auth.uid) {
      const unsubscribe = getWroteUsersIds(auth.uid)
      return unsubscribe
    }
  }, [auth.uid]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    dispatch({
      type: 'SWITCH_DARK_MODE',
      payload: darkMode
    })
  }, [darkMode])

  useEffect(() => {
    let interval;

    document.addEventListener('visibilitychange', (e) => {
      const turnOffline = {
        location: {
          lat: null,
          lng: null,
        },
        isOnline: false
      }
      if (document.hidden) {
        // interval = setTimeout(() => {
        //   console.log(4)
        //   firebase.database().goOffline();
        //   firebase.database().ref(`status/${getUid()}/`).update(isOfflineForDatabase)
        //   console.log('here paste func to set isOnline')
        //   myAccount().update(turnOffline);
        //
        //   dispatch({
        //     type: 'GET_STATUS_CURRENT_USER',
        //     payload: {
        //       location: {
        //         lat: null,
        //         lng: null,
        //       },
        //       isOnline: false
        //     }
        //   })
        //   let localStorageData = JSON.parse(localStorage.getItem('user'))
        //   let newData = {
        //     ...localStorageData,
        //     location: {
        //       lat: null,
        //       lng: null,
        //     },
        //     isOnline: false
        //   }
        //   // todo make one method set localstorage online user and offline user
        //   localStorage.setItem('user', JSON.stringify(newData))
        // }, 3000)
      } else {
        clearInterval(interval)
        firebase.database().goOnline(); // todo 1
      }
    })
  }, [])

  return (
    <AppBar className={classes.topAndButtons}>
      <Toolbar>
        <IconButton
          className={classes.icons}
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
        >
          <MenuIcon />
        </IconButton>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <MenuItem onClick={() => history.push('/users')}>
            <IconButton aria-label="show 4 new mails"
              className={classes.icons}
            >
              <Badge badgeContent={wroteUsersIds.length} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
          </MenuItem>

          <Typography variant="h6" noWrap className={classes.icons}>
            People Meet
          </Typography>

          <div>
            <FormControlLabel
              label={auth.isOnline ? 'Online' : 'Offline'}
              labelPlacement="start"
              className='switcher'
              control={
                <Switch
                  style={{ margin: 0 }}
                  classes={{
                    switchBase: classes.switchBase,
                    track: classes.track,
                    checked: classes.checked,
                  }}
                  checked={auth.isOnline}
                  // color='primary'
                  onChange={onlineHandler}
                  name="isonline"
                />
              }

            />
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default React.memo(TopBar)
