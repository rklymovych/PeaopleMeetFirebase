import React, { useState } from 'react';
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
  makeStyles
} from '@material-ui/core';
import {useAuth} from "../context/AuthContext";
import {db} from "../firebase";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  }
];

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, ...rest }) => {
  const {currentUser, getUid} = useAuth()
  const classes = useStyles();

  const [values, setValues] = useState({
    name: '',
    text: '',
    email: currentUser.email
  });

  const handleChange = (event) => {
    console.log(event.target.value)
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };
  console.log(values.name)
  const updateDateHandler =()=>{
    let age = db.collection('users').doc(getUid())
    age.set(values, { merge: true })
  }





  return (
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
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify the first name"
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
              <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.email}
                  variant="outlined"
              />

            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextareaAutosize
                  name="text"
                  // fullWidth
                  aria-label="minimum height"
                  rowsMin={2}
                  rowsMax={12}
                  onChange={handleChange}
                  placeholder="Minimum 3 rows"
              />
            </Grid>
            {/*<Grid*/}
            {/*  item*/}
            {/*  md={6}*/}
            {/*  xs={12}*/}
            {/*>*/}
            {/*  <TextField*/}
            {/*    fullWidth*/}
            {/*    label="Phone Number"*/}
            {/*    name="phone"*/}
            {/*    onChange={handleChange}*/}
            {/*    type="number"*/}
            {/*    value={values.phone}*/}
            {/*    variant="outlined"*/}
            {/*  />*/}
            {/*</Grid>*/}
            {/*<Grid*/}
            {/*  item*/}
            {/*  md={6}*/}
            {/*  xs={12}*/}
            {/*>*/}
            {/*  <TextField*/}
            {/*    fullWidth*/}
            {/*    label="Country"*/}
            {/*    name="country"*/}
            {/*    onChange={handleChange}*/}
            {/*    required*/}
            {/*    value={values.country}*/}
            {/*    variant="outlined"*/}
            {/*  />*/}
            {/*</Grid>*/}
            {/*<Grid*/}
            {/*  item*/}
            {/*  md={6}*/}
            {/*  xs={12}*/}
            {/*>*/}
            {/*  <TextField*/}
            {/*    fullWidth*/}
            {/*    label="Select State"*/}
            {/*    name="state"*/}
            {/*    onChange={handleChange}*/}
            {/*    required*/}
            {/*    select*/}
            {/*    SelectProps={{ native: true }}*/}
            {/*    value={values.state}*/}
            {/*    variant="outlined"*/}
            {/*  >*/}
            {/*    {states.map((option) => (*/}
            {/*      <option*/}
            {/*        key={option.value}*/}
            {/*        value={option.value}*/}
            {/*      >*/}
            {/*        {option.label}*/}
            {/*      </option>*/}
            {/*    ))}*/}
            {/*  </TextField>*/}
            {/*</Grid>*/}
          </Grid>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
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
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
