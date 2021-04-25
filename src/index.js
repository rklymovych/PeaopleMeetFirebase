import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme/theme'
import { UserContext } from './context/UserContext'
import { db } from './firebase'
import { useAuth, getUid } from "./context/AuthContext";

if (typeof window !== 'undefined') {
  window.React = React;
}

const getCurrentUserWithId = (user) => {
  return user *2;
}

// const { getUid } = useAuth()
// const getCurrentUserWithId = () => {
//   const getUsers = () => {
//     return db.collection("users").get() // надо ли ретурн???
//       .then((querySnapshot) => {
//         const users = querySnapshot.docs.filter((user => getUid() === user.id)).map((doc) => {
//           return { id: doc.id, ...doc.data() };
//         })
//       });
//   }
//   return users
// }


ReactDOM.render(
  <React.StrictMode>
    <UserContext.Provider value={{
      getCurrentUserWithId
    }}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </UserContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();