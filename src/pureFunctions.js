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
