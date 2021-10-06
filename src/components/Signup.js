import React, {useRef, useState} from 'react'
import {Card, Button, Form, Alert, Container} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import 'firebase/auth'
import 'firebase/app'
import {useDispatch, useSelector} from "react-redux";
import {signup} from "../actions";

function Signup() {
  const emailRef = useRef()
  const nameRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()

  const {auth} = useSelector(state => state)

  const handleSubmit = (e) => {
    e.preventDefault()
    if(passwordRef.current.value.length < 6){
      return setError('Password should be at least 6 characters')
    }
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }

    try {
      setError('')
      setLoading(true)
      const email = emailRef.current.value // сделать локальный стейт к этому всему
      const password = passwordRef.current.value
      const name = nameRef.current.value
      const user = {email, password, name}
      dispatch(signup(user))
      history.push('/')
    } catch (e) {
      setError('Failed to create an account')
    }
    setLoading(false)

  }

  return (
      <Container
          className='d-flex align-items-center justify-content-center'
          style={{minHeight: '100vh'}}
      >
        <div className="w-100" style={{maxWidth: '400px'}}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Signup</h2>
              {auth?.error && <Alert variant="danger">{auth.error}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required/>
                </Form.Group>

                <Form.Group id="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                      type="text"
                      ref={nameRef}
                      required
                  />
                </Form.Group>

                <Form.Group id="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required/>
                </Form.Group>

                <Form.Group id="password-confirm">
                  <Form.Label>Password Confirmation</Form.Label>
                  <Form.Control type="password" ref={passwordConfirmRef} required/>
                </Form.Group>

                <Button disabled={loading} type="submit" className="w-100">Sign up</Button>

              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Or <Link to='/login'>Sign In</Link>
          </div>
        </div>
      </Container>


  );
}

export default Signup;
