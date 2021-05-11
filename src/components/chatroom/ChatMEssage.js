import React from 'react';
import {Avatar} from "@material-ui/core";


export const ChatMessage = (props) => {
  const {user, body, uid, photoURL, createdAt} = props.message;

  return (
      <div>
        <div>
          <Avatar alt="Remy Sharp" src={photoURL || 'https://i.imgur.com/rFbS5ms.png'}/>
        </div>
        <div>
          <p>{user}</p>
          <p>{body}</p>
        </div>
      </div>
  )
}
