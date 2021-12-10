import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Grid, makeStyles} from "@material-ui/core";
import Profile from "../../AccountView/Profile";
import ProfileDetails from "../../AccountView/ProfileDetails";
import {ColorHeader} from "./ColorHeader";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '0px',
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3)
  }
}));

function ThemeCustom() {
  const classes = useStyles();
  return (
      <>
        <div className="wrapper-profile">
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
                <ColorHeader />
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
        </div>
      </>
  )
}

export default ThemeCustom;