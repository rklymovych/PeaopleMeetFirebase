import React,{useEffect} from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import {UpdateProfile} from "./UpdateProfile";
import Signup from "./Signup";
import {Login} from "./Login";
import {ForgotPassword} from "./ForgotPassword";
import Account from "../AccountView";
import {Test} from "./Test";
import {Users} from "./Users";
import {ChatPage} from "./chatroom/ChatPage";
import {isLoggedInUser} from "../actions";
import {auth} from "../firebase";
import {useDispatch, useSelector} from "react-redux";

export function RouteComponent() {
  const {currentUser} = useAuth()


  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch()



  useEffect(() => {
    if(!auth.authenticated){
      dispatch(isLoggedInUser())
    }
  }, []);


  if (currentUser) {
    return (
        <>
          <Switch>
            <PrivateRoute exact path="/" component={Account}/>
            <PrivateRoute exact path="/test" component={Test}/>
            <PrivateRoute exact path="/users" component={Users}/>
            <PrivateRoute exact path="/update-profile" component={UpdateProfile}/>
            {/*<PrivateRoute exact path='/chat/:id' component={ChatPage}/>*/}
            <PrivateRoute exact path='/chat' component={ChatPage}/>
            <Redirect to="/"/>
          </Switch>
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


