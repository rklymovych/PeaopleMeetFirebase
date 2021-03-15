import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from "./context/AuthContext";
import {ThemeProvider} from '@material-ui/core/styles';
import {theme} from './theme/theme'

ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
      <AuthProvider>
        <App/>
      </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
