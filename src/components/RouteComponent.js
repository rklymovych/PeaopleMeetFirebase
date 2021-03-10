import React, {useState} from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import {Dashboard} from "./Dashboard";
import {UpdateProfile} from "./UpdateProfile";
import Signup from "./Signup";
import {Login} from "./Login";
import {ForgotPassword} from "./ForgotPassword";
import TopBar from "./TopBar";
import Account from "../AccountView";

export function RouteComponent() {
  const {currentUser} = useAuth()
  if (currentUser) {
    return (
        <>
          <TopBar/>
          <Switch>
            <PrivateRoute exact path="/" component={Account}/>
            <PrivateRoute exact path="/update-profile" component={UpdateProfile}/>
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


