import React, {useEffect, useState} from 'react'
import clsx from "clsx";
import {Box, Card, CardContent, Input, makeStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import getContrastRatio from 'get-contrast-ratio';

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
  const classes = useStyles();
  let storageTextColor = JSON.parse(localStorage.getItem('color'))
  let storageBgColor = JSON.parse(localStorage.getItem('color'))

  const [colorText, setColorText] = useState(storageTextColor.colorText || '#000')
  const [colorBg, setColorBg] = useState(storageBgColor.colorBg || '#fff')

  useEffect(() => {
    const indexOfColorBg = getContrastRatio(colorBg, '#fff') // from 1  to 21
    if (indexOfColorBg) {
      if (indexOfColorBg > 3.7) {
        setColorText('#fff')
      } else {
        setColorText('#000')
      }
    }
    localStorage.setItem('color', JSON.stringify({colorText, colorBg}))

  }, [colorBg])


  return (
      <Card>
        <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            p={2}
            className={classes.boxContainer}
            style={{background: colorBg}}
        >
          <Typography
              // color={colorBg}
              gutterBottom
              variant="h6"
              style={{color: colorText}}
              // className={classes.center}
          >
            Change Header Color
          </Typography>
          <Box p={1}>
            <input type="color" text="Color Text" className={classes.inputWidth} value={colorBg}
                   onChange={(e) => setColorBg(e.target.value)}/>
          </Box>

        </Box>
      </Card>
  )
}