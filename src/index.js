import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from "./context/AuthContext";
import {createMuiTheme, ThemeProvider, unstable_createMuiStrictModeTheme} from '@material-ui/core/styles';
// import {theme} from './theme/theme'
import {UserContextProvider} from './context/UserContext'
import {Provider} from 'react-redux'
import store from './store/store'
import {FirebaseState} from "./context/firebaseContext/FirebaseState";
import green from "@material-ui/core/colors/green";
import {grey} from "@material-ui/core/colors";
import {ThemeWrapper} from "./components/ThemeWrapper";

if (typeof window !== 'undefined') {
  window.React = React;
}
window.store = store


ReactDOM.render(
    // <React.StrictMode>
    <FirebaseState>
      <Provider store={store}>
        <React.StrictMode>
         <ThemeWrapper />
          {/*  <ThemeProvider theme={theme}>*/}
          {/*    <AuthProvider>*/}
          {/*      <App/>*/}
          {/*    </AuthProvider>*/}
          {/*  </ThemeProvider>*/}
          {/*/!*</UserContextProvider>*!/*/}
        </React.StrictMode>
      </Provider>
    </FirebaseState>
    ,
    document.getElementById('root')
);

reportWebVitals();