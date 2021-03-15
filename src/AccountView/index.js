import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';


const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '60px',
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  }
}));

const Account = () => {
  const classes = useStyles();

  return (
      <div className="wrapper-profile">
        {/*<Page*/}
        {/*    className={classes.root}*/}
        {/*    title="Account"*/}
        {/*>*/}
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
              <Profile/>
            </Grid>
            <Grid
                item
                lg={8}
                md={6}
                xs={12}
            >
              <ProfileDetails/>
            </Grid>
          </Grid>
        </Container>
        {/*</Page>*/}
      </div>
  );
};

export default Account;
