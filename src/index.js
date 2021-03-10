import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {AuthProvider} from "./context/AuthContext";
import {BrowserRouter as Router} from "react-router-dom";

ReactDOM.render(
    <React.StrictMode>
      <AuthProvider>
        <App/>
      </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
