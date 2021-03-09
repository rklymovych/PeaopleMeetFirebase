import React from 'react'
import Signup from "./Signup";
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container} from "react-bootstrap";
import {AuthProvider, useAuth} from "../context/AuthContext";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
// import {Dashboard} from "./Dashboard";
import Dashboard from "../DashboardLayout/index";
import {Login} from "./Login";
import PrivateRoute from "./PrivateRoute";
import {ForgotPassword} from "./ForgotPassword";
import {UpdateProfile} from "./UpdateProfile";
import Account from "../views/account/AccountView";
import Profile from "../views/account/AccountView/index";


function App() {
  const {currentUser} = useAuth()
  // console.log(currentUser)
  return (

      <Container
          className='d-flex align-items-center justify-content-center'
          style={{minHeight: '100vh'}}
      >
        <div className="w-100" style={{maxWidth: '400px'}}>
          <Router>
            <AuthProvider>
              {/*{currentUser && <Dashboard/>}*/}
              {/* делать правильно роуты!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}

              <Switch>
                {/*<PrivateRoute exact path='/' component={Dashboard}/>*/}
                <PrivateRoute exact path='/' component={Dashboard}/>
                <PrivateRoute exact path='/update-profile' component={UpdateProfile}/>
                <PrivateRoute path='/profile' component={Profile}/>

                <Route path='/signup' component={Signup}/>
                <Route path='/login' component={Login}/>
                <Route path="/profile" component={Account}/>
              </Switch>
            </AuthProvider>
          </Router>
        </div>
      </Container>

  )


}

export default App;
