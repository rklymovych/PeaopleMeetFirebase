import React, {useCallback, useEffect, useState, useRef} from 'react'
import {GoogleMap, InfoWindow, Marker, useLoadScript} from '@react-google-maps/api';
import mapStyles from "../components/maps/MapStyles";
import compass from '../assets/2277999_map-compass-compass-svg-hd-png-download.png'
import {db, database} from "../firebase";
import {getRealtimeUsers, logout} from "../actions";
import {useDispatch, useSelector} from 'react-redux'
import defUser from '../assets/def-user.jpg'

import '@reach/combobox/styles.css'
import {SideNav} from "./SideNav";

const libraries = ["places"];
const containerStyle = {
  width: '100vw',
  height: 'calc(100vh - 60px)'
};
const options = {
  style: mapStyles,
  disableDefaultUI: true,
  zoomControl: true
}

export const Test = () => {
  const dispatch = useDispatch()
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
    libraries
  })

  const [markers, setMarkers] = useState([])
  const [selected, setSelected] = useState(null)
  const [location, setLocation] = useState()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [checkRealTimeUsers, setCheckRealTimeUsers] = useState()

  const auth = useSelector(state => state.auth)
  let unsubscribe;

  const getCurrentPosition = async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
    })
  }

  useEffect(() => {

    db.collection('users')
        .where('isOnline', '==', true)
        .onSnapshot((querySnapshot) => {
          const users = []
          querySnapshot.forEach((doc) => {
            users.push(doc.data())
          });
          setOnlineUsers(users)
        });
  }, [])

  console.log(onlineUsers)
  // db.collection('users')
  //     .where('isOnline', '==', true)
  //     .onSnapshot((querySnapshot) => {
  //       let users = []
  //       querySnapshot.forEach((doc) => {
  //         users.push(doc.data())
  //       });
  //
  //       setOnlineUsers(users)
  //     });


  // useEffect(() => {
  //   const starCountRef = database.ref('status/');
  //   starCountRef.on('value', (snapshot) => {
  //     const data = snapshot.val();
  //     for (let key in data) {
  //       console.log('tt', key, data[key])
  //       if (data[key].state == 'offline') {
  //         // db.collection('users')
  //         console.log('key', key)
  //         db.collection('users').doc(key)
  //             .update({
  //               isOnline: false,
  //               location: {lat: null, lng: null}
  //             })
  //       }
  //     }
  //   });
  //
  // }, [])

  useEffect(() => {

    unsubscribe = dispatch(getRealtimeUsers(auth.uid))
        .then(unsubscribe => {
          return unsubscribe;
        })
        .catch(error => console.log(error))


  }, [auth.uid])

  useEffect(() => {
    return () => {
      //cleanup
      unsubscribe.then(f => f()).catch(error => console.log(error))
    }
  }, [])
  //
  useEffect(() => {
    getCurrentPosition()
  }, [])


  // const onMapClick = useCallback((event) => {
  //   new Date().toISOString()
  //   setMarkers(current => [
  //     ...current,
  //     {
  //       lat: event.latLng.lat(),
  //       lng: event.latLng.lng(),
  //       time: new Date()
  //     }])
  // }, [])

  const mapRef = useRef()
  const onMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  if (loadError) return 'Error loading maps'
  if (!isLoaded) return 'Loading maps'

  function Locate() {
    return (
        <button className="locate" onClick={getCurrentPosition}>
          <img src={compass} alt={''}/>
        </button>
    )
  }


  return (
      <SideNav>
        <h1>Bears <span role="img" aria-label="tent">😋</span></h1>
        <Locate/>
        {location ? (<GoogleMap
            mapContainerStyle={containerStyle}
            zoom={18}
            center={{lat: location.lat, lng: location.lng}}
            options={options}
            // onClick={onMapClick}
            onLoad={onMapLoad}
        >
          {/* это маркер Я*/}
          {/*<Marker position={{lat: location.lat, lng: location.lng}} icon={{url:  defUser, scaledSize: new window.google.maps.Size(30, 30),anchor: new window.google.maps.Point(15, 15), origin: new window.google.maps.Point(0, 0)}}/>*/}


          {onlineUsers.map((user) => <Marker
              key={user.uid}
              position={{lat: user.location.lat, lng: user.location.lng}}
              icon={{
                url: user.avatar || defUser,
                scaledSize: new window.google.maps.Size(30, 30),
                anchor: new window.google.maps.Point(15, 15),
                origin: new window.google.maps.Point(0, 0)
              }}
              onClick={() => {
                setSelected(user)
              }}
          >

          </Marker>)}

          {selected ? (
              <InfoWindow position={{lat: selected.location.lat, lng: selected.location.lng}}
                          onCloseClick={() => setSelected(null)}>
                <div>
                  <h2>{selected.name}</h2>
                  <p>{selected.description}</p>
                </div>

              </InfoWindow>) : null}
        </GoogleMap>) : null}
      </SideNav>
  )
}