import React, { useEffect, useContext } from 'react'
import clsx from "clsx";
import { Box, Card, CardContent, Input, makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { FirebaseContext } from "../../context/firebaseContext/firebaseContext";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  },
  center: {
    textAlign: 'center'
  },
  inputWidth: {
    width: 50
  },
  boxContainer: {
    display: 'flex',
    flexDirection: 'inherit',
    alignItems: 'baseline',
  },
  color: {
    // color: colorBg
  }
}));

export const ColorHeader = () => {
  const classes = useStyles()
  const { testVar, colorText, colorBg, changeColorHandlerState } = useContext(FirebaseContext)

  const changeColorHandler = (e) => {
    changeColorHandlerState(e.target.value)
  }

  useEffect(() => {

    localStorage.setItem('color', JSON.stringify({ colorText, colorBg }))
  }, [colorBg])




  return (
    <Card>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
        className={classes.boxContainer}
        style={{ background: colorBg }}
      >
        <Typography
          // color={colorBg}
          gutterBottom
          variant="h6"
          style={{ color: colorText }}
        // className={classes.center}
        >
          Change Header Color
        </Typography>
        <Box p={1}>
          <input type="color" text="Color Text" className={classes.inputWidth} value={colorBg}
            onChange={changeColorHandler} />
        </Box>

      </Box>
    </Card>
  )
}