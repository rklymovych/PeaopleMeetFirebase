import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import './Join.css'
import {database, db} from '../../firebase'

const Join = () => {
  const url = process.env.REACT_APP_REALTIME_DB

  const testAxios = async () => {
    const note = {
      title: 'text test ',
      date: Date.now()
    }
    try {
      const res = await axios.post(`${url}/status.json`, note)

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
      const res = await axios.post(`${url}/test.json`, note)

    } catch (e) {
      console.log(e.message)
    }
  }
  const getRequest = async () => {
    try {
      const res = await axios.get(`${url}/test.json`)

      const key = Object.keys(res.data).map(key => {
        return {
          ...res.data[key],
          id: key
        }

      })
      return key.sort((a, b) => {
        return a.date - b.date
      })
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
      <div className="joinOuterContainer">
        <button onClick={testAxios}>test</button>
        <button onClick={test2Axios}>test2</button>
        <button onClick={getRequest}>get</button>
        <button onClick={deleteLastStatus}>deleteStatus</button>
        <button onClick={putLastStatus}>putLastStatus</button>
      </div>
  )
}
export default Join