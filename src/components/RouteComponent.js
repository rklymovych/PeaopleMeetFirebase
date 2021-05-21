import React, {useEffect} from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import {UpdateProfile} from "./UpdateProfile";
import Signup from "./Signup";
import {Login} from "./Login";
import {ForgotPassword} from "./ForgotPassword";
import Account from "../AccountView";
import {Map} from "./Map";
import {Users} from "./Users";
import {ChatPage} from "./chatroom/ChatPage";
import Join from "./Join/Join";
import {isLoggedInUser} from "../actions";
import {database, db} from "../firebase";
import {useDispatch, useSelector} from "react-redux";
import firebase from "firebase/app"
import {SideNav} from "./SideNav";
import TestChat from "./Chat/Testchat";

export function RouteComponent() {
  const {currentUser, getUid} = useAuth()

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch()


  const userStatusDatabaseRef = database.ref('/status/' + getUid());
  const isOfflineForDatabase = {
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };

  const isOnlineForDatabase = {
    state: 'online',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };


  useEffect(() => {
    database.ref('.info/connected').on('value', function (snapshot) {

      if (snapshot.val() == false) {
        return;
      }
      ;
      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {

        userStatusDatabaseRef.set(isOnlineForDatabase);
      });
    });
  }, [])

  useEffect(() => {
    if (!auth.authenticated) {
      dispatch(isLoggedInUser())
    }
  }, []);

  if (currentUser) {
    return (
        <>
          <Switch>
            <PrivateRoute exact path="/" component={Account}/>
            <PrivateRoute exact path="/map" component={Map}/>
            <PrivateRoute exact path="/users" component={Users}/>
            <PrivateRoute exact path="/update-profile" component={UpdateProfile}/>
            {/*<PrivateRoute exact path='/chat/:id' component={ChatPage}/>*/}
            <PrivateRoute exact path='/chat' component={ChatPage}/>
            <PrivateRoute exact path='/join' component={Join}/>
            <PrivateRoute exact path='/testchat' component={TestChat}/>
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


