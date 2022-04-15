import React, {useEffect} from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import {useAuth} from "../../context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import {UpdateProfile} from "../login.logout";
import Signup from "../login.logout/Signup";
import {Login} from "../login.logout/Login";
import {ForgotPassword} from "../login.logout";
import Account from "../../AccountView";
import {Map} from "../maps";
import {Users} from "../users";
import Join from "../Join/Join";
import {isLoggedInUser} from "../../actions";
import {useDispatch, useSelector} from "react-redux";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Drawer from "../Drawer";
import TopBar from "../TopBar";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  drawerWrapper: {
    width: '250px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
}))

function RouteComponent() {
  const classes = useStyles()
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch()
  const {currentUser} = useAuth()
  const [state, setState] = React.useState({'left': false});


  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({...state, 'left': open});
  }

  useEffect(() => {
    if (!auth.authenticated) {

      dispatch(isLoggedInUser())
    }
  }, []);

  if (currentUser) {
    return (
        <>
          <TopBar setState={setState}/>
          <div style={{height: '60px'}}/>
          <Switch>
            <PrivateRoute exact path="/" component={Account}/>
            <PrivateRoute path="/map" component={Map}/>
            <PrivateRoute exact path="/users" component={Users}/>
            <PrivateRoute exact path="/update-profile" component={UpdateProfile}/>
            {/*<PrivateRoute exact path='/chat/:id' component={ChatPage}/>*/}
            {/*<PrivateRoute exact path='/map/chat/:id' component={ChatPage}/>*/}
            <PrivateRoute exact path='/join' component={Join}/>
            <Redirect to="/"/>
          </Switch>
          <SwipeableDrawer
              open={state['left']}
              onClose={toggleDrawer('left', false)}
              onOpen={toggleDrawer('left', true)}
          >
            <div
                className={classes.drawerWrapper}
                onClick={toggleDrawer('left', false)}
                onKeyDown={toggleDrawer('left', false)}
            >

              <Drawer/>
            </div>
          </SwipeableDrawer>
        </>
    )
  }
  return (
      <Switch>
        <Route path="/signup" component={Signup}/>
        <Route exact path="/login" component={Login}/>
        <Route path="/forgot-password" component={ForgotPassword}/>
        <Redirect to="/login"/>
      </Switch>
  )
}

export default RouteComponent


