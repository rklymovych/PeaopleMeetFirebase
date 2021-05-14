import {unstable_createMuiStrictModeTheme} from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";

export const theme = unstable_createMuiStrictModeTheme({
  palette: {
    primary: {
      main: '#3d5afe',
    },
    secondary: {
      main: green[500],
    },
    error: {
      main: '#f71324',
    },
    white: {
      main: '#fff',
    }
  },
});