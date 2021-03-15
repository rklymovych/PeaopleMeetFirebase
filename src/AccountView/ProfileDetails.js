import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles, Tooltip, Modal
} from '@material-ui/core';
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { UpdateProfile } from "../components/UpdateProfile";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


const useStyles = makeStyles(() => ({
  root: {},
  changeEmail: {},
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    paddingBottom: '10px',
    borderRadius: '5px',
    top: '50%',
    left: `50%`,
    transform: 'translate(-50%, -50%)',
  },
}));

const ProfileDetails = ({ className, ...rest }) => {
  const { currentUser, getUid } = useAuth()
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(false)
  const [values, setValues] = useState({
    name: '',
    description: '',
    email: currentUser.email
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    const unsubscribe = db.collection('users').doc(getUid())
      .onSnapshot((doc) => {
        doc?.exists && setValues({ ...values, name: doc.data().name, description: doc.data().description })
      })
      
    return unsubscribe;
  }, []);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const updateDateHandler = () => {
    let age = db.collection('users').doc(getUid())
    age.set(values, { merge: true })
  }

  const onlineHandler = () => {
    setOnline(!online)
    db.collection('users').doc(getUid())
      .set({
        isOnline: !online
      }, { merge: true })
  }

  return (
    <div style={{ position: 'relative', zIndex: 123 }}>

      <form
        autoComplete="off"
        noValidate
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Card>
          <CardHeader
            subheader="The information can be edited"
            title="Profile"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              {/*<Grid container spacing={3} style={{display: 'flex'}}>*/}
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name}
                  variant="outlined"
                />
              </Grid>

              <Grid
                item
                md={6}
                xs={12}
              >
                <Tooltip title='Click on change email?'>
                  <TextField
                    className={classes.changeEmail}
                    fullWidth
                    label="Email Address"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                    variant="outlined"
                    disabled
                    onClick={handleOpen}
                  />
                </Tooltip>

              </Grid>
              <Grid
                item
                md={12}
                xs={12}
              >

                <TextField
                  fullWidth
                  name="description"
                  id="outlined-multiline-static"
                  label="Type something about you"
                  multiline
                  rows={4}
                  value={values.description}
                  variant="outlined"
                  onChange={handleChange}
                />
              </Grid>


            </Grid>
          </CardContent>
          <Divider />
          <Box
            display="flex"
            justifyContent="space-between"
            p={2}
          >
            <FormControlLabel
              control={
                <Switch
                  // checked={state.checkedB}
                  onChange={onlineHandler}
                  name="isonline"
                  color="primary"
                />
              }
              label="Online"
            />
            <Button
              color="primary"
              variant="contained"
              onClick={updateDateHandler}
            >
              Save details
              </Button>
          </Box>
        </Card>

      </form>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <UpdateProfile />
        </div>
      </Modal>
    </div>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
