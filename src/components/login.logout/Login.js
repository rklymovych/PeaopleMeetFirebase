import React, {useRef, useState, useEffect} from 'react'
import {Card, Button, Form, Alert, Container} from "react-bootstrap";

import {Link, useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {signin} from "../../actions";
import {useSelector} from 'react-redux'
import {db} from "../../firebase";
import {useAuth} from "../../context/AuthContext";

export function Login() {
  const {getUid, myAccount} = useAuth()
  const emailRef = useRef()
  const passwordRef = useRef()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()

  const {auth} = useSelector(state => state)

  function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')
      setLoading(true)
      const email = emailRef.current.value
      const password = passwordRef.current.value
      // await login(emailRef.current.value, passwordRef.current.value)
      dispatch(signin({email, password}))
      history.push('/')
    } catch (e) {
      setError('Failed to log in')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (getUid()) {
      myAccount()
          .update({
            location: {lat: null, lng: null},
            isOnline: false
          })
    }
  }, [getUid()])
  return (
      <Container
          className='d-flex align-items-center justify-content-center'
          style={{minHeight: '100vh'}}
      >
        <div className="w-100" style={{maxWidth: '400px'}}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Log In</h2>
              {auth?.error && <Alert variant="danger">{auth.error}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required/>
                </Form.Group>
                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required/>
                </Form.Group>
                <Button disabled={loading} type="submit" className="w-100">Log in</Button>
              </Form>
              <div className="w-100 text-center mt-3">
                <Link to='/forgot-password'>Forgot Password</Link>
              </div>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Or <Link to="/signup">Sign Up</Link>
          </div>

        </div>
      </Container>
  );
}

export default Login
