import React, {useState} from "react"

export const UserContext = React.createContext({users: []})
export const UserContextProvider = ({children}) => {
  const [users1, setUsers1] = useState([])
  const value = {users1: users1, setUsers1: setUsers1}
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}





