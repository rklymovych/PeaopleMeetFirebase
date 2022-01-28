import React, {useContext, useEffect, useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/Mail';
import {useHistory} from "react-router-dom";
import {database, db} from "../firebase";
import {useDispatch, useSelector} from "react-redux";
import {Badge, MenuItem} from "@material-ui/core";
import firebase from "firebase";
import {FirebaseContext} from "../context/firebaseContext/firebaseContext";
import {makeStyles} from "@material-ui/core/styles";
import {useAuth} from "../context/AuthContext";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {getCurrentPosition} from "../utils/utils";

const TopBar = ({ setState }) => {
// export const TopBar  = ({setState}) =>{
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
  const storageUser = JSON.parse(localStorage.getItem('user'))
  const isOnline = storageUser?.isOnline

  const classes = useStyles();
  const history = useHistory()
  const {getUid} = useAuth()
  const {
    getWroteUsersIds,
    wroteUsersIds,
  } = useContext(FirebaseContext)
  const handleDrawerOpen = () => {
    setState({'left': true});
  };
  const [valueOnline, setValueOnline] = useState(false)
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const localStorageDarkMode = JSON.parse(localStorage.getItem('darkMode'))

  let darkMode = localStorageDarkMode || false
  //  make offline Users/
  const userStatusDatabaseRef = database.ref('/status/' + auth.uid);
  const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  const onlineHandler = ({target: {checked}}) => {
    const myAccount = db.collection('users').doc(getUid())
    const meFromLocal = JSON.parse(localStorage.getItem('user'))


    setValueOnline(!valueOnline)
    if(checked) {
      getCurrentPosition((position) => {
        myAccount
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
          location: {lat: position.coords.latitude, lng: position.coords.longitude}
        }))
      })

      dispatch({
        type: 'GET_STATUS_CURRENT_USER',
        payload: {checked: true}
      })
    } else {
      myAccount
          .update({
            location: {lat: null, lng: null},
            isOnline: false
          })
      localStorage.setItem('user', JSON.stringify({
        ...meFromLocal,
        isOnline: false,
        location: {lat: null, lng: null}
      }))
      dispatch({
        type: 'GET_STATUS_CURRENT_USER',
        payload: {checked: false}
      })
    }
  }
  useEffect(() => {
    if (auth.uid) {

      database.ref('.info/connected').on('value', function (snapshot) {
        if (snapshot.val() === true) {
          userStatusDatabaseRef.set(isOnlineForDatabase);
        }
        if (snapshot.val() === false) {
          userStatusDatabaseRef.onDisconnect().remove(() => {
            // console.log('status off')
          })
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

   useEffect(()=> {
     localStorage.setItem('darkMode', JSON.stringify(darkMode))
     dispatch({
       type: 'SWITCH_DARK_MODE',
       payload: darkMode
     })
   },[darkMode])

  useEffect(() => {
    let interval;
    const myAccount = db.collection('users').doc(getUid())
    document.addEventListener('visibilitychange',(e) =>{
      if(document.hidden){
        interval = setTimeout(() => {
          firebase.database().goOffline();
          myAccount
              .update({
                location: {
                  lat: null,
                  lng: null,
                },
                isOnline: false
              })
          let localStorageData = JSON.parse(localStorage.getItem('user'))
          let newData = {
            ...localStorageData,
            location: {
              lat: null,
              lng: null,
            },
            isOnline: false
          }
          // todo make one method set localstorage online user and offline user
          localStorage.setItem('user', JSON.stringify(newData))
          }, 60000)
      }
      else {
        clearInterval(interval)
        firebase.database().goOnline();
      }
    })
  },[])
  return (
      <AppBar className={classes.topAndButtons}>
        <Toolbar>
          <IconButton
              className={classes.icons}
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
          >
            <MenuIcon/>
          </IconButton>

          <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
            <MenuItem onClick={() => history.push('/users')}>
              <IconButton aria-label="show 4 new mails"
                          className={classes.icons}
              >
                <Badge badgeContent={wroteUsersIds.length} color="error">
                  <MailIcon/>
                </Badge>
              </IconButton>
            </MenuItem>

            <Typography variant="h6" noWrap  className={classes.icons}>
              People Meet
            </Typography>

            <div>
              <FormControlLabel
                  label={isOnline ? 'Online' : 'Offline'}
                  labelPlacement="start"
                  className='switcher'
                  control={
                    <Switch
                        style={{margin: 0}}
                        classes={{
                          root: classes.root1,
                          switchBase: classes.switchBase,
                          thumb: classes.thumb,
                          track: classes.track,
                          checked: classes.checked,
                        }}
                        checked={isOnline}
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
