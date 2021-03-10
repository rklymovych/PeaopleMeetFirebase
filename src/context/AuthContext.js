import React, {useContext, useState, useEffect} from "react"
import {auth} from "../firebase"
import firebase from "firebase/app"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}


export function AuthProvider({children}) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  async function signup(email, password, dataUser = null) {
    const sign = auth.createUserWithEmailAndPassword(email, password)
    const uid = await getUid()
    const database = firebase.database().ref(`/user/${uid}/info`).set(dataUser)
    return {sign, database}
  }

  function getUid() {
    const user = auth.currentUser
    return user ? user.uid : null
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
    return currentUser.updateEmail(email)
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
    getUid
  }
  return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
  )
}