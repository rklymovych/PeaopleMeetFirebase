import React, {useContext} from 'react'
import {SideNav} from "./SideNav";
import {UserContext} from '../context/UserContext'
export function Test() {
  const {getCurrentUserWithId} = useContext(UserContext)
  console.log(getCurrentUserWithId(123));
  return (
      <SideNav>
        <div>TEst</div>
      </SideNav>

  )
}