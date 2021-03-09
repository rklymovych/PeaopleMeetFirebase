import React, {useState} from 'react'
import {Route, Redirect} from 'react-router-dom'
import {Card, Button, Alert} from 'react-bootstrap'
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

export default function PrivateRoute({component: Component, ...rest}) {
  const {currentUser} = useAuth()
  console.log('rest', rest)
  return (
      <Route
          {...rest}
          render={props => {
           return  currentUser ? <Component {...props}/> : <Redirect to='/login'/>
          }}
      >
      </Route>
  )
}