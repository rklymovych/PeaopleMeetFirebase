import React, {useContext, useEffect, useState} from 'react';
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
import {Avatar, Badge} from "@material-ui/core";
import {useAuth} from "../../context/AuthContext";
import {UserContext} from '../../context/UserContext'
import {db} from "../../firebase";
import {SideNav} from "../SideNav";

import InputIcon from "@material-ui/icons/Input";
import {isOnline} from "../../services/firestoreFunctions";

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

export const ChatPage = () => {
  const history = useHistory()
  const {currentUser, getUid, error, logout} = useAuth()
  let {id} = useParams();
  const {users1} = useContext(UserContext)
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [chatWithUser, setChatWithUSer] = useState(users1)
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const getUsers = () => {
    return db.collection("users").get() // надо ли ретурн???
        .then((querySnapshot) => {
          const users = querySnapshot.docs.filter((user => id === user.id)).map((doc) => {
            return {id: doc.id, ...doc.data()};
          })
          setChatWithUSer(users)
        });
  };

  const getCurrentUSer = (id, users1) => {
    setChatWithUSer(users1.filter(user => user.id === id))
  }

  useEffect(() => {
    if (users1) {
      getUsers()
      getCurrentUSer(id, users1)
    }
  }, [])

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const logoutHandler = () => {
    isOnline(getUid())
    logout()
  }
  return (
      // <SideNav>
      <div className={classes.root}>
        <CssBaseline/>
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
        >
          <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>

       <div style={{display: 'flex'}}>
         <IconButton
             color="inherit"
             aria-label="open drawer"
             onClick={handleDrawerOpen}
             edge="start"
             className={clsx(classes.menuButton, {
               [classes.hide]: open,
             })}
         >
           <MenuIcon/>
         </IconButton>
         <IconButton onClick={() => history.push('/users')}>
           <ChevronLeftIcon
               className={classes.whiteColor}
           />
         </IconButton>
         <List className={classes.padding}>
           <ListItem>
             <ListItemIcon>
               <StyledBadge
                   overlap="circle"
                   anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'right',
                   }}
                   variant="dot"
               >
                 {chatWithUser && chatWithUser.map(el => {
                   return <Avatar key={el.id} alt="Remy Sharp" src={el.avatar}/>
                 })}

               </StyledBadge>
             </ListItemIcon>
             {chatWithUser && chatWithUser.map(el => {
               return <ListItemText key={el.id} primary={el.name}/>
             })}

           </ListItem>

         </List>
       </div>
            <Typography variant="h6" noWrap>
              Chat
            </Typography>
            <IconButton
                color="inherit"
                onClick={logoutHandler}
            >
              <InputIcon/>
            </IconButton>

          </Toolbar>
        </AppBar>
        <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon/>
            </IconButton>
          </div>
          <Divider/>
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                  <ListItemText primary={text}/>
                </ListItem>
            ))}
          </List>
          <Divider/>
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                  <ListItemText primary={text}/>
                </ListItem>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar}/>
          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt

          </Typography>
          <Typography paragraph>

            nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
            accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
          </Typography>
        </main>
      </div>
      // </SideNav>
  );
}
