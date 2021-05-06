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
import {db} from "../../firebase";
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
import {getRealtimeUsers} from "../../actions";

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
  // const {currentUser, getUid, error, logout} = useAuth()
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
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  // const auth = JSON.parse(localStorage.getItem('user'))
  const user = useSelector(state => state.user)
  let unsubscribe;
  // const getUsers = () => {
  //   return db.collection("users").get() // надо ли ретурн???
  //       .then((querySnapshot) => {
  //         const users = querySnapshot.docs.filter((user => id === user.id)).map((doc) => {
  //           return {id: doc.id, ...doc.data()};
  //         })
  //         setChatWithUSer(users)
  //       });
  // };

  // const getCurrentUSer = (id, users1) => {
  //   setChatWithUSer(users1.filter(user => user.id === id))
  // }
  //
  // useEffect(() => {
  //   if (users1) {
  //     // getUsers()
  //     getCurrentUSer(id, users1)
  //   }
  // }, [])

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };
  // const logoutHandler = () => {
  //   isOnline(getUid())
  //   logout()
  // }

  // const dummy = useRef();
  // const scrollToBottom = () => {
  //   dummy.current.scrollIntoView({behavior: 'smooth'});
  // }
  // const messagesRef = db.collection('messages');
  // const query = messagesRef.orderBy('createdAt', 'asc').limitToLast(25);
  //
  // const [messages] = useCollectionData(query, {idField: 'id'});
  // console.log('displayName',currentUser.displayName)
  // console.log('db.FieldValue', db.FieldValue)
  // const sendMessage = async (e) => {
  //   e.preventDefault();
  //   // gets name, userID and pfp of logged in user
  //
  //   const { displayName, uid, photoURL } = currentUser;
  //
  //   await messagesRef.add({
  //     user: displayName,
  //     body: formValue,
  //     // createdAt: db.FieldValue.serverTimestamp(),
  //     uid: uid,
  //     photoURL: photoURL
  //   })
  //
  //   // resetting form value and scrolling to bottom
  //   setFormValue('');
  //   dummy.current.scrollIntoView({ behavior: 'smooth' });
  // }
  // useEffect(scrollToBottom, [messages]);

  /////////////////////////////////////////////////////////

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

  return (
      // <SideNav>
      // <div className={classes.root}>
      //   <CssBaseline/>
      //   <AppBar
      //       position="fixed"
      //       className={clsx(classes.appBar, {
      //         [classes.appBarShift]: open,
      //       })}
      //   >
      //     <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
      //
      //       <div style={{display: 'flex'}}>
      //         <IconButton
      //             color="inherit"
      //             aria-label="open drawer"
      //             onClick={handleDrawerOpen}
      //             edge="start"
      //             className={clsx(classes.menuButton, {
      //               [classes.hide]: open,
      //             })}
      //         >
      //           <MenuIcon/>
      //         </IconButton>
      //         <IconButton onClick={() => history.push('/users')}>
      //           <ChevronLeftIcon
      //               className={classes.whiteColor}
      //           />
      //         </IconButton>
      //         <List className={classes.padding}>
      //           <ListItem>
      //             <ListItemIcon>
      //               <StyledBadge
      //                   overlap="circle"
      //                   anchorOrigin={{
      //                     vertical: 'bottom',
      //                     horizontal: 'right',
      //                   }}
      //                   variant="dot"
      //               >
      //                 {chatWithUser && chatWithUser.map(el => {
      //                   return <Avatar key={el.id} alt="Remy Sharp" src={el.avatar}/>
      //                 })}
      //
      //               </StyledBadge>
      //             </ListItemIcon>
      //             {chatWithUser && chatWithUser.map(el => {
      //               return <ListItemText key={el.id} primary={el.name}/>
      //             })}
      //
      //           </ListItem>
      //
      //         </List>
      //       </div>
      //       <Typography variant="h6" noWrap>
      //         Chat
      //       </Typography>
      //       <IconButton
      //           color="inherit"
      //           onClick={logoutHandler}
      //       >
      //         <InputIcon/>
      //       </IconButton>
      //
      //     </Toolbar>
      //   </AppBar>
      //   <Drawer
      //       variant="permanent"
      //       className={clsx(classes.drawer, {
      //         [classes.drawerOpen]: open,
      //         [classes.drawerClose]: !open,
      //       })}
      //       classes={{
      //         paper: clsx({
      //           [classes.drawerOpen]: open,
      //           [classes.drawerClose]: !open,
      //         }),
      //       }}
      //   >
      //     <div className={classes.toolbar}>
      //       <IconButton onClick={handleDrawerClose}>
      //         <ChevronLeftIcon/>
      //       </IconButton>
      //     </div>
      //     <Divider/>
      //     <List>
      //       {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
      //           <ListItem button key={text}>
      //             <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
      //             <ListItemText primary={text}/>
      //           </ListItem>
      //       ))}
      //     </List>
      //     <Divider/>
      //     <List>
      //       {['All mail', 'Trash', 'Spam'].map((text, index) => (
      //           <ListItem button key={text}>
      //             <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
      //             <ListItemText primary={text}/>
      //           </ListItem>
      //       ))}
      //     </List>
      //   </Drawer>
      //   <main className={classes.content}>
      //     <div className={classes.toolbar}/>
      //     <div>
      //       {/* we will loop over the message and return a
      //   ChatMessage component for each message */}
      //       {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      //       <span ref={dummy}></span>
      //     </div>
      //     <div style={{display: 'flex'}}>
      //       <form  onSubmit={sendMessage}>
      //         <TextField
      //             id="outlined-multiline-static"
      //             label="Text Here"
      //             multiline
      //             rows={2}
      //             fullWidth
      //             // placeholder="Text here"
      //             variant="outlined"
      //             value={formValue}
      //             onChange={(e) => setFormValue(e.target.value)}
      //         />
      //         <Button
      //             type="submit"
      //             disabled={!formValue}
      //             variant="contained"
      //             color="primary"
      //         >
      //           Send
      //         </Button>
      //       </form>
      //     </div>
      //   </main>
      // </div>
      <SideNav>
        <section className="wrap">


          <div className="listOfUsers">


            {
              user.users.length > 0 ?
                  user.users.map(user => {
                    return (
                        <User
                            // onClick={initChat}
                            key={user.uid}
                            user={user}
                        />
                    );
                  }) : null
            }


          </div>

          <div className="chatArea">

            <div className="chatHeader">
              {/*{*/}
              {/*  chatStarted ? chatUser : ''*/}
              {/*}*/}
            </div>
            <div className="messageSections">
              {/*{*/}
              {/*  chatStarted ?*/}
              {/*      user.conversations.map(con =>*/}
              {/*          <div style={{ textAlign: con.user_uid_1 == auth.uid ? 'right' : 'left' }}>*/}
              {/*            <p className="messageStyle" >{con.message}</p>*/}
              {/*          </div> )*/}
              {/*      : null*/}
              {/*}*/}


            </div>
            {/*{*/}
            {/*  chatStarted ?*/}
            <div className="chatControls">
                <textarea
                    // value={message}
                    // onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write Message"
                />
              <button
                  // onClick={submitMessage}
              >Send
              </button>
            </div>
            {/*: null/*/}
            {/*}*/}

          </div>
        </section>

      </SideNav>
  );
}
