import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function getUid() {
    const user = auth.currentUser
    return user ? user.uid : null
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