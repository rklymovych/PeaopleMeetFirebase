import React, {useContext, useEffect, useCallback} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/Mail';
import {useHistory} from "react-router-dom";
import InputIcon from "@material-ui/icons/Input";
import {database} from "../firebase";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../actions";
import {Badge, Box, MenuItem} from "@material-ui/core";
import firebase from "firebase";
import {FirebaseContext} from "../context/firebaseContext/firebaseContext";
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import {authConstant} from "../actions/constants";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';



export const TopBar = ({setState}) => {
  const useStyles = makeStyles((theme) => {
    return {
      root: {
        // backgroundColor: !isDarkMode ? '#3d5afe' : '#ffffff',
        backgroundColor: '#3d5afe',
        // backgroundColor: theme.palette.action.active,
        boxShadow: theme.shadows[4]
      },
      topAndButtons: theme.palette.topAndButtons,
      icons: theme.palette.icons,
    }
  })
  const classes = useStyles();
  const history = useHistory()
  const {
    getWroteUsersIds,
    wroteUsersIds,
    wroteUsersAndRead
  } = useContext(FirebaseContext)
  const handleDrawerOpen = () => {
    setState({'left': true});
  };
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [darkMode, setDarkMode] = React.useState(false)
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


  const showUsers = () => {
    history.push('/users')
  }
  useEffect(() => {
    if (auth.uid) {
      const unsubscribe = getWroteUsersIds(auth.uid)
      return unsubscribe
    }
  }, [auth.uid]);

   useEffect(()=> {
     dispatch({
       type: 'SWITCH_DARK_MODE',
       payload: darkMode
     })
   },[darkMode])



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
            <MenuItem onClick={showUsers}>
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
