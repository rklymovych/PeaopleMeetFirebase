import React, {useContext, useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/Mail';
import {useHistory} from "react-router-dom";
import InputIcon from "@material-ui/icons/Input";
import {database, db} from "../firebase";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../actions";
import {Badge, MenuItem} from "@material-ui/core";
import firebase from "firebase";
import {FirebaseContext} from "../context/firebaseContext/firebaseContext";
import {makeStyles} from "@material-ui/core/styles";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import {useAuth} from "../context/AuthContext";

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
    }
  })
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
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const localStorageDarkMode = JSON.parse(localStorage.getItem('darkMode'))

  const [darkMode, setDarkMode] = React.useState(localStorageDarkMode || false)
  //  make offline Users/
  const userStatusDatabaseRef = database.ref('/status/' + auth.uid);
  const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };
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
              {darkMode ? (
                  <IconButton
                      className={classes.icons}
                      onClick={()=> setDarkMode(!darkMode)}>
                <Brightness4Icon color="inherit"/>
              </IconButton>
              ):(
                  <IconButton
                      className={classes.icons}
                      onClick={()=> setDarkMode(!darkMode)}>
                    <Brightness7Icon color="inherit"/>
                  </IconButton>
              )}

              <IconButton
                  className={classes.icons}
                  onClick={() => dispatch(logout(auth.uid))}
              >
                <InputIcon/>
              </IconButton>
            </div>

          </div>
        </Toolbar>
      </AppBar>
  )
}

export default React.memo(TopBar)
