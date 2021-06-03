import React, {useContext, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MailIcon from '@material-ui/icons/Mail';
import {useHistory} from "react-router-dom";
import InputIcon from "@material-ui/icons/Input";
import {database, db} from "../firebase";
import {useAuth} from "../context/AuthContext";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../actions";
import {Badge, MenuItem} from "@material-ui/core";
import firebase from "firebase";
import {FirebaseContext} from "../context/firebaseContext/firebaseContext";

const drawerWidth = 230;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  padding: {
    marginTop: '60px',
    background: 'red'
  },
}));

export const TopBar = ({setState}) => {
  const history = useHistory()
  const classes = useStyles();
  const {getUsersOnlineRealTime} = useContext(FirebaseContext)
  // const theme = useTheme()
  const [open, setOpen] = React.useState(false);
  const {getUid} = useAuth()
  const [isNewMessage, setNewMessage] = React.useState(false)

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
          userStatusDatabaseRef.onDisconnect().remove(err => {
            // console.log('err', err)
          })
        }
      });
    }
  }, [auth.uid])
//  make offline Users END****/




  // getUsersOnlineRealTime();
  // useEffect(() => {
  //   let docRef = db.collection("conversations")
  //       .onSnapshot((doc) => {
  //         const myMessages = []
  //         doc.forEach((a) => {
  //           if (a.data().user_uid_2 === auth.uid) {
  //             myMessages.push(a.data())
  //           }
  //           setMyMessages(myMessages)
  //         })
  //       })
  //
  //   return docRef
  // }, [])

  useEffect(() => {
    if (auth.uid) {
      db.collection('conversations')
          .where('user_uid_2', '==', auth.uid)
          .onSnapshot(snap => {
            snap.forEach(el => {
              if (el.data()) {
                setNewMessage(true)
              }
            })
          })
    }
  }, [auth.uid])


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
            <MenuItem onClick={() => history.push('/users')}>
              <IconButton aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={isNewMessage ? '1' : null} color="error">
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
