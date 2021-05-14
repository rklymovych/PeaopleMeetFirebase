import React, {useEffect} from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RoomIcon from '@material-ui/icons/Room';
import MailIcon from '@material-ui/icons/Mail';
import SupervisorAccountRoundedIcon from '@material-ui/icons/SupervisorAccountRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import {useHistory} from "react-router-dom";
import InputIcon from "@material-ui/icons/Input";
import {db} from "../firebase";
import {useAuth} from "../context/AuthContext";
import defaultAvatar from '../../src/assets/avatars/avatar.jpg'
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../actions";

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
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    height: '200px!important',
    display: 'flex',
    alignItems: 'flex-start',
    padding: '10px 0',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
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
  userName: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translate(-50%)',
    color: theme.palette.common.white
  }
}));

export const SideNav = ({children}) => {
  const history = useHistory()
  const classes = useStyles();

  // const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const {getUid} = useAuth()
  const [avatar, setAvatar] = React.useState(null)
  const [userName, setUserName] = React.useState('')
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const handleDrawerClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    const avatar = db.collection("users").doc(getUid())
        .onSnapshot(doc => {
          if (doc?.exists) {
            setAvatar(doc.data().avatar)
            setUserName(doc.data().name)
          }
        }, error => {
          console.log('sidenavPage', error.message)
        })
    return avatar
  }, [])

  return (
      <div className={classes.root}>
        <CssBaseline/>
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
        >
          <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon/>
            </IconButton>
            <Typography variant="h6" noWrap>
              People Meet
            </Typography>
            <IconButton
                color="inherit"
                onClick={() => dispatch(logout(auth.uid))}
            >
              <InputIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
        >
          <div className={classes.drawerHeader}
               style={{
                 position: 'relative',
                 backgroundImage: `url(${avatar ? avatar : defaultAvatar})`,
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: 'center center',
                 backgroundSize: 'cover'
               }}

          >
            <Typography variant="h4" align='center' className={classes.userName}>
              {userName}
            </Typography>
            <IconButton style={{color: 'white'}} onClick={handleDrawerClose}>
              <ChevronLeftIcon/>
            </IconButton>

          </div>
          <Divider/>
          <List>
            <ListItem button onClick={() => history.push('/test')}>
              <ListItemIcon><RoomIcon/></ListItemIcon>
              <ListItemText primary={'Map'}/>
            </ListItem>
            <ListItem button>
              <ListItemIcon><MailIcon/></ListItemIcon>
              <ListItemText primary={'text'}/>
            </ListItem>
            <ListItem button onClick={() => history.push('/users')}>
              <ListItemIcon><SupervisorAccountRoundedIcon/></ListItemIcon>
              <ListItemText primary={'Users'}/>
            </ListItem>
          </List>
          <Divider/>
          <List>
            <ListItem button onClick={() => history.push('/')}>
              <ListItemIcon><AccountCircleRoundedIcon/></ListItemIcon>
              <ListItemText primary={'My account'}/>
            </ListItem>

          </List>
        </Drawer>
        <main
            className={clsx(classes.content, {
              [classes.contentShift]: open,
            })}
        >
          <div className={classes.padding}/>
          {children}
        </main>
      </div>
  )
}
