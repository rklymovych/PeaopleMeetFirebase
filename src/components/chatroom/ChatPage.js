import React, {useContext, useEffect, useRef, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom'
import clsx from 'clsx';
import {makeStyles, useTheme, withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {Avatar, Badge, TextField} from "@material-ui/core";
import {useAuth} from "../../context/AuthContext";
import {UserContext} from '../../context/UserContext'
import {db, auth, messaging} from "../../firebase";
import {SideNav} from "../SideNav";
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollectionData} from 'react-firebase-hooks/firestore';
import InputIcon from "@material-ui/icons/Input";
import {isOnline} from "../../services/firestoreFunctions";
import Button from "@material-ui/core/Button";
import {ChatMessage} from "./ChatMEssage";
import 'firebase/firestore'
import './styles.css';
import {useDispatch, useSelector} from "react-redux";
import {getRealtimeConversations, getRealtimeUsers, updateMessage} from "../../actions";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    height: '100vh',
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  padding: {
    paddingTop: '0!important',
    paddingBottom: '0!important',
  },
  whiteColor: {
    color: theme.palette.primary.contrastText
  },
}));
const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge)
const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar)

const User = (props) => {


  const {user, onClick} = props;

  return (
      <div onClick={() => onClick(user)} className="displayName">
        <div className="displayPic">
          <img src="https://i.pinimg.com/originals/be/ac/96/beac96b8e13d2198fd4bb1d5ef56cdcf.jpg" alt=""/>
        </div>
        <div style={{display: 'flex', flex: 1, justifyContent: 'space-between', margin: '0 10px'}}>
          <span style={{fontWeight: 500}}>{user.name}</span>
          <span className={user.isOnline ? `onlineStatus` : `onlineStatus off`}></span>
        </div>
      </div>
  );
}

export const ChatPage = () => {
  // const history = useHistory()
  // const {currentUser, getUid, error, logout,} = useAuth()
  // let {id} = useParams();
  // const {users1} = useContext(UserContext)
  // const classes = useStyles();
  // const [formValue, setFormValue] = useState()
  // const theme = useTheme();
  // const [open, setOpen] = React.useState(false);
  // const [chatWithUser, setChatWithUSer] = useState(users1)
  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };
  // const [user1] = useAuthState(auth)
  const dummy = useRef();
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const user = useSelector(state => state.user)
  const [chatStarted, setChatStarted] = useState(false)
  const [chatUser, setChatUser] = useState('')
  const [message, setMessage] = useState('')
  const [userUid, setUserUid] = useState(null)
  let unsubscribe;

  const scrollToBottom = () => {
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  useEffect(() => {

    unsubscribe = dispatch(getRealtimeUsers(auth.uid))
        .then(unsubscribe => {
          return unsubscribe;
        })
        .catch(error => console.log(error))


  }, [auth.uid])


  useEffect(() => {
    return () => {
      //cleanup
      unsubscribe.then(f => f()).catch(error => console.log(error))
    }
  }, [])


  const initChat = (user) => {
    scrollToBottom()
    setChatStarted(true)
    setChatUser(user.name)
    setUserUid(user.uid)
    const uid_1 = auth.uid
    const uid_2 = user.uid
    dispatch(getRealtimeConversations({uid_1, uid_2}))
  }


  const submitMessage = (e) => {

    const msgObj = {
      user_uid_1: auth.uid,
      user_uid_2: userUid,
      message,
      idx: new Date()
    }
    console.log(!!message)
    if (message !== '') {
      scrollToBottom()
      dispatch(updateMessage(msgObj))
          .then(() => {
            setMessage('')
          })
    }

  }
  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitMessage()

    }
  }

  return (
      <SideNav>
        <section className="wrap">

          <div className="listOfUsers">

            {
              user.users.length > 0 ?
                  user.users.map(user => {
                    return (
                        <User
                            onClick={initChat}
                            key={user.uid}
                            user={user}
                        />
                    );
                  }) : null
            }

          </div>

          <div className="chatArea">

            <div className="chatHeader">
              {
                chatStarted ? chatUser : ''
              }
            </div>
            <div className="messageSections">
              {
                chatStarted ?
                    user.conversations.map((con, idx) =>
                        <div key={idx} style={{textAlign: con.user_uid_1 === auth.uid ? 'right' : 'left'}}>
                          <p className="messageStyle">{con.message}</p>
                        </div>
                    )
                    : null
              }

              <div ref={dummy}/>
            </div>

            {
              chatStarted ?
                  <div className="chatControls">
                <textarea
                    onKeyDown={_handleKeyDown}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write Message"
                />
                    <button
                        onClick={submitMessage}
                    >Send
                    </button>
                  </div>
                  : null
            }

          </div>
        </section>

      </SideNav>
  );
}
