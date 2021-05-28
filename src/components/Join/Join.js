import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import {getRequest} from "../../pureFunctions";

const Join = ({children}) => {
  const url = process.env.REACT_APP_REALTIME_DB


  const testAxios = async () => {
    const note = {
      title: 'text test ',
      date: Date.now()
    }
    try {
      await axios.post(`${url}/status.json`, note)

    } catch (e) {
      console.log(e.message)
    }
  }
  const test2Axios = async () => {
    const note = {
      title: 'text test ',
      date: Date.now()
    }
    try {
      await axios.post(`${url}/test.json`, note)

    } catch (e) {
      console.log(e.message)
    }
  }

  const deleteLastStatus = async () => {
    const a = await getRequest()
    console.log(a[0].id)
    try {
      await axios.delete(`${url}/test/${a[0].id}.json`)
      //
      // const key = Object.keys(res.data).map(key => {
      //   return {
      //     ...res.data[key],
      //     id: key
      //   }


    } catch (e) {
      console.log(e.message)
    }
  }
  const putLastStatus = async () => {
    const a = await getRequest()
    console.log(a)
    const note123 = {
      title: 'put text123 123 ',
      date: Date.now()
    }
    try {
      await axios.put(`${url}/test/${a[0].id}.json`, note123)
      //
      // const key = Object.keys(res.data).map(key => {
      //   return {
      //     ...res.data[key],
      //     id: key
      //   }


    } catch (e) {
      console.log(e.message)
    }
  }


  return (
      <div>
       <button onClick={testAxios}>testAxios</button>
       <button onClick={putLastStatus}>putLastStatus</button>
       <button onClick={deleteLastStatus}>deleteLastStatus</button>
       <button onClick={test2Axios}>test2Axios</button>
       <button onClick={getRequest}>getRequest</button>
      </div>
  );
}
export default Join