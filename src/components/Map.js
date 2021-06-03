import React, {useCallback, useEffect, useState, useRef, useContext} from 'react'
import {GoogleMap, InfoWindow, Marker, useLoadScript} from '@react-google-maps/api';
import mapStyles from "../components/maps/MapStyles";
import compass from '../assets/2277999_map-compass-compass-svg-hd-png-download.png'
import {db, database} from "../firebase";
import {getRealtimeUsers} from "../actions";
import {useDispatch, useSelector} from 'react-redux'
import defUser from '../assets/def-user.jpg'
import chatBackground from '../assets/chatBachground.jpg'

import '@reach/combobox/styles.css'
import {Card, CardActionArea, CardActions, CardContent, CardMedia, Drawer, Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {ChatPage} from "./chatroom/ChatPage";
import axios from "axios";
import {FirebaseContext} from "../context/firebaseContext/firebaseContext";
import Loader from "./loader/Loader";

const useStyles = makeStyles({
  root: {
    paddingTop: '0px',
    paddingBottom: '0px'
  },
  drawer: {
    height: '50vh',
    padding: '0.5rem',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      opacity: '0.3',
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      backgroundImage: `url(${chatBackground})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }
  },
})


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

export const Map = () => {
  const dispatch = useDispatch()
  const [markers, setMarkers] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const onlineCurrentUser = JSON.parse(localStorage.getItem('user'))
  const [getRealTimeUsers, setRealTimeUsers] = useState([])
  const {realUsers, getOnlineUsersChecked} = useContext(FirebaseContext)
  const classes = useStyles();
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
    libraries
  })
  const [chatStarted, setChatStarted] = useState(false)
  const [selected, setSelected] = useState(null)
  const [location, setLocation] = useState()
  const [openDrawer, setOpenDrawer] = useState(false)

  const authFromState = useSelector(state => state.auth)

  const getCurrentPosition = async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
    })
  }

  const getRequest = async () => {
    const url = process.env.REACT_APP_REALTIME_DB
    try {
      const res = await axios.get(`${url}/status.json`)

      const key = Object.keys(res.data).map(key => {
        return {
          ...res.data[key],
          id: key
        }
      })
      console.log('getRequest axios', key)
      return key.sort((a, b) => {
        return a.date - b.date
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    getOnlineUsersChecked();
  }, [])

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
  if (!isLoaded) return <div className="loader-wrapper-map-page"><Loader/></div>

  function Locate() {
    return (
        <button className="locate" onClick={getCurrentPosition}>
          <img src={compass} alt={''}/>
        </button>
    )
  }

  const openDrawerHandler = () => {
    setOpenDrawer(!openDrawer)
    setChatStarted(!chatStarted)
  }


  return (
      <>
        <h1 className="headerMap"><span
            onClick={getRequest}
            role="img" aria-label="tent">😋</span></h1>
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


          {realUsers && realUsers.map(user => {

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
              <InfoWindow
                  className={classes.root}
                  position={
                    {
                      lat: selected.location.lat,
                      lng: selected.location.lng
                    }
                  }
                  onCloseClick={() => setSelected(null)}
              >
                <Card>
                  <CardActionArea>
                    <CardMedia
                        style={{
                          height: '190px',
                          backgroundSize: 'contain',
                        }}
                        // className={classes.media}
                        image={selected.avatar || defUser}
                        title="Contemplative Reptile"
                    />
                    <CardContent className={classes.root}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {selected?.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {selected?.age}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {selected?.sex}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {selected?.description}
                      </Typography>

                    </CardContent>
                  </CardActionArea>
                  <CardActions style={{marginBottom: '10px'}}>
                    <Button
                        onClick={openDrawerHandler}
                        size="small"
                        color="primary"
                        disabled={selected.uid === authFromState.uid}
                    >
                      {selected.uid === authFromState.uid ? 'That\'s like people see your account' : 'Write'}
                    </Button>
                  </CardActions>
                </Card>

              </InfoWindow>) : null}
        </GoogleMap>) : null}
        <Drawer
            anchor='bottom'
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
        >
          <Grid container>
            <Grid item className={classes.drawer} xs={12}>
              <ChatPage selected={selected}/>
            </Grid>
          </Grid>
        </Drawer>
      </>
  )
}