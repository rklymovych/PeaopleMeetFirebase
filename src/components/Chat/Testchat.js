import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import queryString from 'query-string'
import io from 'socket.io-client'
// import './Chat.css'

let socket;

const TestChat = ({location}) => {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const ENDPOINT = 'localhost:5000'


  useEffect(() => {
    const {name, room} = queryString.parse(location.search)

    socket = io(ENDPOINT , { transports: ['websocket', 'polling', 'flashsocket'] });

    setName(name)
    setRoom(room)

    console.log(socket)
    socket.emit('join', {name, room})
  }, [ENDPOINT, location.search])


  return (
      <div className="joinOuterContainer">
        Chat
      </div>
  )
}
export default TestChat