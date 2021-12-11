import { unstable_createMuiStrictModeTheme } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import {colorBgGlobal} from '../context/firebaseContext/FirebaseState'
console.log('colorBgGlobal' ,colorBgGlobal);

// todo закончить кастомизацию стилей
export const theme = unstable_createMuiStrictModeTheme({
  palette: {
    primary: {
      main: '#fff',
    },
    secondary: {
      main: green[500],
    },
    error: {
      main: '#f71324',
    },
    white: {
      main: '#fff',
    },
    paddingTopZero: {
      paddingTop: '0!important'
    },
    shadow: {
      boxShadow: '0px 2px 1px -1px rgb(0, 0, 0, .2), 0px 1px 1px 0px rgb(0, 0, 0, 0.14), 0px 1px 3px 0px rgb(0, 0, 0, 0.12)',
    }
  },
});