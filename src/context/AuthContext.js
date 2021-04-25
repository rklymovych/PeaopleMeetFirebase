import React, { useContext, useState, useEffect } from "react"
import { auth, db } from "../firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}


export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentUserWithId, setCurrentUserWithId] = useState([])




  function getUid() {
    const user = auth.currentUser
    return user ? user.uid : null
  }

  async function signup(email, password, userDate = {}) {
    return auth.createUserWithEmailAndPassword(email, password)
      .then(cred => {
        return db.collection('users').doc(cred?.user?.uid).set({
          id: cred?.user?.uid,
          name: userDate.name,
          isOnline: false,
          description: '',
          sex:'',
          avatar:'',
          email: ''
        })
      })
      .then(() => console.log('success'))
      .catch(error => setError(error.message))
  }


  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)

  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    try {
      return currentUser.updateEmail(email)
    } catch (e) {
      setError(e.message)
    }

  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])


  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    getUid,
    error
  }
  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}