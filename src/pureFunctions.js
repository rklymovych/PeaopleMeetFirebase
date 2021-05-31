import axios from "axios";
import {database, db} from "./firebase";

export const getRequest = async () => {
  const url = process.env.REACT_APP_REALTIME_DB
  try {
    const res = await axios.get(`${url}/status.json`)

    const key = Object.keys(res.data).map(key => {
      return {
        ...res.data[key],
        id: key
      }

    })
    console.log(key)
    return key.sort((a, b) => {
      return a.date - b.date
    })
  } catch (e) {
    console.log(e.message)
  }
}

export const getRealtimeConversationsPure = async ({uid_1, uid_2}) => {
  await db.collection('conversations')
      .where('user_uid_1', 'in', [uid_1, uid_2])
      .orderBy('createdAt', 'asc')
      .onSnapshot((querySnapshot) => {

        const conversations = []

        querySnapshot.forEach(doc => {

          if ((doc.data().user_uid_1 == uid_1 && doc.data().user_uid_2 == uid_2)
              ||
              (doc.data().user_uid_1 == uid_2 && doc.data().user_uid_2 == uid_1)) {
            conversations.push(doc.data())
          }
        })
        console.log('conversations', conversations)
        return conversations
      })
}