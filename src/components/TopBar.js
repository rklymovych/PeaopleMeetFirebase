import React, {useContext, useEffect, useCallback} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/Mail';
import {useHistory, matchPath, useLocation} from "react-router-dom";
import InputIcon from "@material-ui/icons/Input";
import {database} from "../firebase";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../actions";
import {Badge, MenuItem} from "@material-ui/core";
import firebase from "firebase";
import {FirebaseContext} from "../context/firebaseContext/firebaseContext";

// const drawerWidth = 230;

export const TopBar = ({setState}) => {
  const history = useHistory()
  const {
    getWroteUsersIds,
    wroteUsersIds
  } = useContext(FirebaseContext)
  const handleDrawerOpen = () => {
    setState({'left': true});
  };
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()

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


  const showWroteUsers = () => {
    history.push('/users')
  }
  useEffect(() => {
    if (auth.uid) {
      const pathname = window.location.pathname.split('/')
      const pathId = pathname.filter(id => id.length > 20)
      if (pathId.length > 0) {
        console.log(pathId);
        history.push('/map', pathId[0])
      }

      // database.ref('status').on('value', (snapshot) => {
      //   const data = snapshot.val();
      //   for( let [key, val] of Object.entries(data)){
      //     if(pathname.includes(key)){
      //       console.log('data1[key]', key)
      //       history.push({
      //         pathname: '/map',
      //         search: key,
      //       })
      //     }
      //   }
      // })
      // http://localhost:3000/map/chat/5ndXpcYzqVW0T4njq0JlQqwAFvu2
      // if(pathname) {
      //   console.log('pathname', pathname)
      //   console.log('match', match.setState)
      //   console.log('location', location)
      //   console.log('matchPath',a)
      // }
      const unsubscribe = getWroteUsersIds(auth.uid)
      return unsubscribe
    }
  }, [auth.uid]);

  return (
      <AppBar>
        <Toolbar>
          <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
          >
            <MenuIcon/>
          </IconButton>

          <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
            <MenuItem onClick={showWroteUsers}>
              <IconButton aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={wroteUsersIds.length} color="error">
                  <MailIcon/>
                </Badge>
              </IconButton>
            </MenuItem>

            <Typography variant="h6" noWrap>
              People Meet
            </Typography>


            <IconButton
                color="inherit"
                onClick={() => dispatch(logout(auth.uid))}
            >
              <InputIcon/>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
  )
}
