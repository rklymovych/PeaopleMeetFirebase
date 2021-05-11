import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from "./context/AuthContext";
import {ThemeProvider} from '@material-ui/core/styles';
import {theme} from './theme/theme'
import {UserContextProvider} from './context/UserContext'
import {Provider} from 'react-redux'
import store from './store/store'

if (typeof window !== 'undefined') {
  window.React = React;
}
window.store = store




ReactDOM.render(
    <Provider store={store}>
      <React.StrictMode>
        <UserContextProvider>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <App/>
            </AuthProvider>
          </ThemeProvider>
        </UserContextProvider>
      </React.StrictMode>
    </Provider>
    ,
    document.getElementById('root')
);

reportWebVitals();