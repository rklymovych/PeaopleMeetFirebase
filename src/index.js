import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux'
import store from './store/store'
import {FirebaseState} from "./context/firebaseContext/FirebaseState";
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
        </React.StrictMode>
      </Provider>
    </FirebaseState>
    ,
    document.getElementById('root')
);

reportWebVitals();