import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';
import {useSelector} from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '0px',
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3)
  },
  userPageWrapper: theme.userPageWrapper
}));

const Account = () => {
  const classes = useStyles();
  const auth = useSelector(state => state.auth)

  return (
      <>
        <div className={classes.userPageWrapper}>
          <Container maxWidth="lg">
            <Grid
                container
                spacing={3}
                className={classes.root}
            >
              <Grid
                  item
                  lg={4}
                  md={6}
                  xs={12}
              >
                <Profile auth={auth} />
              </Grid>
              <Grid
                  item
                  lg={8}
                  md={6}
                  xs={12}
              >
                <ProfileDetails auth={auth} />
              </Grid>
            </Grid>
          </Container>
        </div>
      </>
  );
};

export default Account;
