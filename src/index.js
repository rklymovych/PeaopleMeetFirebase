import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from "./context/AuthContext";
import {ThemeProvider} from '@material-ui/core/styles';
import {theme} from './theme/theme'
import {UserContextProvider} from './context/UserContext'

if (typeof window !== 'undefined') {
  window.React = React;
}

ReactDOM.render(
    // <React.StrictMode>
      <React.Fragment>
      <UserContextProvider>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <App/>
          </AuthProvider>
        </ThemeProvider>
      </UserContextProvider>
    </React.Fragment>,
    document.getElementById('root')
);

reportWebVitals();