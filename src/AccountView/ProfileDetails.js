import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {useFormik} from 'formik';
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
import {UpdateProfile} from "../components/login.logout";
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import {useHistory} from "react-router-dom";
import {validationSchema} from "../validation";
import {useDispatch} from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {},
  changeEmail: {},
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: 'white',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    paddingBottom: '10px',
    borderRadius: '5px',
    top: '50%',
    left: `50%`,
    transform: 'translate(-50%, -50%)',
  },
  activeButtons: theme.palette.activeButtons
}));

const ProfileDetails = ({className, auth, ...rest}) => {
  const dispatch = useDispatch()
  const {currentUser, getUid, error, myAccount} = useAuth()

  const history = useHistory()
  const classes = useStyles();
  const [snackbar, setSnackbar] = useState(false)
  const [open, setOpen] = useState(false);
  const [userAge, setUserAge] = useState([])
  const [values, setValues] = useState({
    name: '',
    description: '',
    age: '',
    sex: '',
    email: '',
    location: {lat: null, lng: null},
    isOnline: false,
  });

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

  // useEffect(() => {
  //   // todo лишнее обращение на бекенд... нужно брать с ауз
  //   let unsubscribe
  //   unsubscribe = myAccount()
  //     .onSnapshot((doc) => {
  //       doc?.exists && setValues({
  //         ...values,
  //         name: doc.data().name,
  //         description: doc.data().description,
  //         age: doc.data().age,
  //         sex: doc.data().sex,
  //         location: {lat: doc.data().location.lat, lng: doc.data().location.lng},
  //         isOnline: doc.data().isOnline
  //       })
  //     })
  //
  //   return unsubscribe;
  // }, []);

  useEffect(()=>{
      setValues({
        name: auth.name,
        description: auth.description,
        age: auth.age,
        sex: auth.sex,
        email: auth.email,
        location: auth.location,
        isOnline: auth.isOnline,
      })
  },[auth]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const _updateDateHandler = () => {
    let data = myAccount()

    if (!values.age || !values.description || !values.sex || !values.name || !values.email) return
    data.set(values, {merge: true})
    dispatch({type: 'SET_DATA_CURRENT_USER', payload: {values}})
    const loggedInUSer = {
      name: values.name,
      email: values.email,
      uid: getUid(),
      isOnline: values.isOnline,
      location: {lat: values.location.lat, lng: values.location.lng}
    }
    localStorage.setItem('user', JSON.stringify(loggedInUSer))
    history.push('/map')
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
                  value={values.name}
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
                  value={values.age ? values.age : ''}
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
                  value={values.sex ? values.sex : ''}
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
                  value={values.description ? values.description : ''}
                  variant="outlined"
                  onChange={handleChange}
                />
              </Grid>


            </Grid>
          </CardContent>
          <Divider/>
          <Box
            display="flex"
            justifyContent="flex-end"
            p={2}
          >
            <Button
              className={classes.activeButtons}
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
}
  ;

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
