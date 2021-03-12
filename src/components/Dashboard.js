import React, {useState} from 'react'
import {Card, Button, Alert} from 'react-bootstrap'
import {Link, useHistory} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {Grid, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    marginTop: '60px',
    padding: '10px'
  }
}))


export function Dashboard() {
  const classes = useStyles();
  const [error, setError] = useState('')
  const {currentUser, logout} = useAuth()
  const history = useHistory()

  async function handleLogout() {
    setError('')

    try {
      await logout()
      history.push('/login')
    } catch (e) {

    }
  }

  return (
      <Grid container spacing={4}
            className={classes.root}
      >
        <Grid item xs={12} sm={4} >
          <Card>
            <Card.Body>
              <h2 className='text-center mb-4'> Profile </h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <strong>Email: </strong>{currentUser.email}
              <Link to="update-profile" className="btn btn-primary w-100 mt-3">Update Profile</Link>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>Log Out</Button>
          </div>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Card>
            <Card.Body>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            {/*<Button variant="link" onClick={handleLogout}>Log Out</Button>*/}
          </div>
        </Grid>

      </Grid>
  )
}


