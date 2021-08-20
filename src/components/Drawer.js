import defaultAvatar from "../assets/avatars/avatar.jpg";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import RoomIcon from "@material-ui/icons/Room";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import SupervisorAccountRoundedIcon from "@material-ui/icons/SupervisorAccountRounded";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import FeedbackIcon from '@material-ui/icons/Feedback';
import React, {useEffect} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {db} from "../firebase";
import {useAuth} from "../context/AuthContext";

const useStyles = makeStyles((theme) => ({
  drawerHeader: {
    height: '200px!important',
    display: 'flex',
    alignItems: 'flex-start',
    padding: '10px 0',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  userName: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translate(-50%)',
    color: theme.palette.common.white
  },
  feedback : {
    alignSelf: 'flex-end',
    marginTop: 'auto'
  }
}))

const Drawer = () => {
  const classes = useStyles()
  const history = useHistory()
  const {getUid} = useAuth()
  const [avatar, setAvatar] = React.useState(null)
  const [userName, setUserName] = React.useState('')

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
      <>
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


        </div>
        <Divider/>
        <List>
          <ListItem button onClick={() => history.push('/map')}>
            <ListItemIcon><RoomIcon/></ListItemIcon>
            <ListItemText primary={'Map'}/>
          </ListItem>
          <ListItem button onClick={() => history.push('/join')}>
            <ListItemIcon><MailIcon/></ListItemIcon>
            <ListItemText primary={'Join'}/>
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
        <ListItem button className={classes.feedback}>
          <ListItemIcon><FeedbackIcon/></ListItemIcon>
          <ListItemText primary={'v: 1.202.8.20'}/>
        </ListItem>
      </>
  )
}

export default Drawer