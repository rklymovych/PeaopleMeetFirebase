import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {FormikHelpers, useFormik} from 'formik';
import * as Yup from "yup";
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
  makeStyles, Tooltip, Modal, MenuItem
} from '@material-ui/core';
import {useAuth} from "../context/AuthContext";
import {db} from "../firebase";
import {UpdateProfile} from "../components/UpdateProfile";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import {useHistory} from "react-router-dom";
import {validationSchema} from "../validation";


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
  error: {
    border: '1px solid red',
    borderRadius: '5px'
  }
}));

const ProfileDetails = ({className, ...rest}) => {
  const {currentUser, getUid, error} = useAuth()
  const history = useHistory()
  const classes = useStyles();
  const [snackbar, setSnackbar] = useState(false)
  const [open, setOpen] = useState(false);


  const [userAge, setUserAge] = useState([])
  const [values, setValues] = useState({
    name: '',
    description: '',
    email: currentUser.email,
    age: '',
    sex: '',
    isOnline: false,
  });
  const [online, setOnline] = useState(values.isOnline)

  useEffect(() => {
    let age = []
    for (let i = 18; i <= 90; i++) {
      age.push(i)
    }
    setUserAge(age)
  }, [])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleCloseSnackbar = (event, reason) => {
    console.log(reason)
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(false);
  };

  useEffect(() => {
    if (error !== '') {
      setSnackbar(true)
    }
  }, [error])

  useEffect(() => {
    const unsubscribe = db.collection('users').doc(getUid())
        .onSnapshot((doc) => {
          doc?.exists && setValues({
            ...values,
            name: doc.data().name,
            description: doc.data().description,
            age: doc.data().age,
            sex: doc.data().sex,
            isOnline: doc.data().isOnline
          })
        })

    return unsubscribe;
  }, []);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const _updateDateHandler = () => {
    let data = db.collection('users').doc(getUid())
    if (!values.age || !values.description || !values.sex || !values.name || !values.email) return
    data.set(values,{ merge: true })
    history.push('/test')
  }

  const formik = useFormik({
    initialValues: {
      age: values.age || '',
      sex: values.sex || '',
      name: values.name || '',
      description: values.description || '',
    },
    validationSchema,
    onSubmit: _updateDateHandler,
    enableReinitialize: true,
  })


  // const onlineHandler = () => {
  //   setOnline(!online)
  //   db.collection('users').doc(getUid())
  //       .set({
  //         isOnline: !values.isOnline
  //       }, {merge: true})
  // }

  return (
      <div style={{position: 'relative', zIndex: 123}}>

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
            <Divider/>
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
                      error={!!formik.errors.name && formik.touched.name}
                      fullWidth
                      label="Name"
                      name="name"
                      value={formik.values.name}
                      onChange={handleChange}
                      required
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
                    md={6}
                    xs={12}
                >
                  <TextField
                      fullWidth
                      label="Age"
                      select
                      name="age"
                      onChange={handleChange}
                      required
                      value={formik.values.age ? formik.values.age : ''}
                      variant="outlined"
                      error={!!formik.errors.age && formik.touched.age}
                  >
                    {currentUser && userAge?.map(age => {
                      return (
                          <MenuItem key={age} value={age}>
                            {age}
                          </MenuItem>
                      )
                    })}
                  </TextField>
                </Grid>

                <Grid
                    item
                    md={6}
                    xs={12}
                >
                  <TextField
                      fullWidth
                      select
                      label="Sex"
                      name="sex"
                      required
                      onChange={handleChange}
                      value={formik.values.sex ? formik.values.sex : ""}
                      variant="outlined"
                      error={!!formik.errors.sex && formik.touched.sex}
                  >
                    {['female', 'male'].map(sex => {
                      return (
                          <MenuItem key={sex} value={sex}>
                            {sex}
                          </MenuItem>
                      )
                    })}
                  </TextField>
                </Grid>
                <Grid
                    item
                    md={12}
                    xs={12}
                >

                  <TextField
                      error={!!formik.errors.description && formik.touched.description}
                      fullWidth
                      name="description"
                      id="outlined-multiline-static"
                      label="Type something about you"
                      multiline
                      rows={4}
                      required
                      value={formik.values.description ? formik.values.description : '' }
                      variant="outlined"
                      onChange={handleChange}
                  />
                </Grid>


              </Grid>
            </CardContent>
            <Divider/>
            <Box
                display="flex"
                justifyContent="space-between"
                p={2}
            >
              <FormControlLabel
                  control={
                    <Switch
                        checked={values.isOnline}
                        // onChange={onlineHandler}
                        name="isonline"
                        color="primary"
                    />
                  }
                  label="Online"
              />
              <Button
                  color="primary"
                  variant="contained"
                  onClick={formik.handleSubmit}
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
            <UpdateProfile/>
          </div>
        </Modal>
        <Snackbar open={snackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>
        {/*<Alert severity="error">This is an error alert — check it out!</Alert>*/}
      </div>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
