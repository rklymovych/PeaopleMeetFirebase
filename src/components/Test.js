import React, {useCallback, useEffect, useState, useRef} from 'react'
import {GoogleMap, InfoWindow, Marker, useLoadScript} from '@react-google-maps/api';
import mapStyles from "../components/maps/MapStyles";
import compass from '../assets/2277999_map-compass-compass-svg-hd-png-download.png'
import {db} from "../firebase";
import {getRealtimeUsers} from "../actions";
import {useDispatch, useSelector} from 'react-redux'
import defUser from '../assets/def-user.jpg'

import '@reach/combobox/styles.css'
import {SideNav} from "./SideNav";
import {Card, CardActionArea, CardActions, CardContent, CardMedia} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

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
  const [onlineCurrentUser, setOnlineCurrentUSer] = useState(JSON.parse(localStorage.getItem('user' )))
  const [checkRealTimeUsers, setCheckRealTimeUsers] = useState()

  const authFromState = useSelector(state => state.auth)
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

    unsubscribe = dispatch(getRealtimeUsers(authFromState.uid))
        .then(unsubscribe => {
          return unsubscribe;
        })
        .catch(error => console.log(error))


  }, [authFromState.uid])

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


  const onMapClick = useCallback((event) => {
    setSelected(null)
    // new Date().toISOString()
    // setMarkers(current => [
    //   ...current,
    //   {
    //     lat: event.latLng.lat(),
    //     lng: event.latLng.lng(),
    //     time: new Date()
    //   }])
  }, [])

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
        <h1><span role="img" aria-label="tent">😋</span></h1>
        <Locate/>
        {location ? (<GoogleMap
            mapContainerStyle={containerStyle}
            zoom={18}
            center={{lat: location.lat, lng: location.lng}}
            options={options}
            onClick={onMapClick}
            onLoad={onMapLoad}
        >
          {/* это маркер Я*/}
          {/*<Marker position={{lat: location.lat, lng: location.lng}} icon={{url:  defUser, scaledSize: new window.google.maps.Size(30, 30),anchor: new window.google.maps.Point(15, 15), origin: new window.google.maps.Point(0, 0)}}/>*/}


          {onlineCurrentUser.isOnline === true && onlineUsers.map(user => {
            return <Marker
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

            </Marker>
          })
          }


          {selected ? (
              <InfoWindow position={{lat: selected.location.lat, lng: selected.location.lng}}
                          onCloseClick={() => setSelected(null)}>
                {/*<div>*/}
                {/*  <h2>{selected.name}</h2>*/}
                {/*  <p>{selected.description}</p>*/}
                {/*</div>*/}
                <Card
                    // className={classes.root}
                >
                  <CardActionArea>
                    <CardMedia
                        style={{height: '200px', backgroundSize: 'contain'}}
                        // className={classes.media}
                        image={selected.avatar || defUser}
                        title="Contemplative Reptile"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {selected.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {selected.age}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {selected.sex}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {selected.description}
                      </Typography>

                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button size="small" color="primary" disabled={selected.uid === authFromState.uid}>
                      {selected.uid === authFromState.uid ? 'That\'s like people see your account' : 'Write'}
                    </Button>


                  </CardActions>
                </Card>

              </InfoWindow>) : null}
        </GoogleMap>) : null}
      </SideNav>
  )
}