import React, {useEffect, useRef, useState, useContext} from 'react';
import {useParams} from 'react-router-dom'
import ReactEmoji from 'react-emoji'
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import {Paper, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import 'firebase/firestore'
import {useDispatch, useSelector} from "react-redux";
import {FirebaseContext} from "../../context/firebaseContext/firebaseContext";
import Loader from "../loader/Loader";

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
    // marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
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
  drawerOpen: {
    // width: drawerWidth,
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
  paperHeader: {
    padding: '0.5rem',
    // margin: 'auto',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    fontWeight: 600,

  },
  paperBody: {
    height: '100%',
    background: 'transparent',
    marginTop: theme.spacing(1),
    overflowX: 'auto'
  },
  paperFooter: {
    // marginTop: theme.spacing(1),
    display: 'flex',
    padding: '0.5rem'
  },
  wrap: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'space-between'
  },
  textRight: {
    textAlign: 'right',
    background: '#b694dc'
  },
  textLeft: {
    textAlign: 'left',
    background: '#8fd7da'
  },
  messageStyle: {
    display: 'inline-block',
    padding: '5px 10px',
    borderRadius: '10px',
    margin: '5px',
    maxWidth: '50vw'
  }
}));

export const ChatPage = ({selected}) => {

  const {getConversations, conversations, isLoaded} = useContext(FirebaseContext)
  const firebase = useContext(FirebaseContext)
  const classes = useStyles();

  const dummy = useRef();
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const user = useSelector(state => state.user)
  const loading = useSelector(state => state.user.loading)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const unsubscribe = getConversations(auth.uid, selected.uid)
    return unsubscribe

    // eslint-disable-next-line
  }, [])
  const submitMessage = (e) => {
    if (message !== '') {
      const msgObj = {
        user_uid_1: auth.uid,
        user_uid_2: selected.uid,
        message,
      }
      firebase.updateMessage1(msgObj).then(() => {
        setMessage('')
      })
    }
  }

  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitMessage()
      e.preventDefault()
    }
  }

  useEffect(() => {
    dummy.current.scrollIntoView({behavior: "smooth"})
  }, [conversations, isLoaded])

  return (
      <div
          className={classes.wrap}
      >
        <Paper elevation={3} className={classes.paperHeader}>
          {selected?.name}
        </Paper>

        <Paper
            className={classes.paperBody}
            elevation={0}
        >
          {isLoaded ? <div className="loader-wrapper-chat-page"><Loader/></div>
              :
              (
                  !isLoaded && conversations.map((con, idx) =>
                      <div
                          key={idx}
                          style={{textAlign: con.user_uid_1 == auth.uid ? 'right' : 'left'}}
                      >
                        <Paper
                            className={clsx(classes.messageStyle,
                                con.user_uid_1 == auth.uid ?
                                    [classes.textRight] :
                                    [classes.textLeft])}
                            elevation={3}
                        >{ReactEmoji.emojify(con.message)}</Paper>
                      </div>
                  )
              )
          }
          <div ref={dummy}></div>
        </Paper>

        <Paper
            className={classes.paperFooter}
            elevation={3}
        >
          <TextField
              style={{width: '100%'}}
              id="outlined-multiline-static"
              label="Write the message"
              multiline
              // rows={1}
              variant="outlined"
              onKeyDown={_handleKeyDown}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write Message"
          />
          <Button variant="contained" color="primary" onClick={submitMessage}>
            Send
          </Button>
        </Paper>
      </div>
  );
}
