import React, {useCallback, useEffect, useState, useRef, useContext} from 'react'
import {GoogleMap, InfoWindow, Marker, useLoadScript} from '@react-google-maps/api';
import mapStyles from "./MapStyles";
import {useSelector} from 'react-redux'
import defUser from '../../assets/def-user.jpg'
import chatBackground from '../../assets/chatBachground.jpg'

import '@reach/combobox/styles.css'
import {Card, CardActionArea, CardActions, CardContent, CardMedia, Drawer, Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {ChatPage} from "../chatroom";
import {FirebaseContext} from "../../context/firebaseContext/firebaseContext";
import Loader from "../loader/Loader";
import {useHistory} from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import {getCurrentPosition} from "../../utils/utils";

const useStyles = makeStyles((theme) => ({
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
  padding: {
    padding: '7px 0 3px'
  },
  paddingForDescription: {
    padding: 0
  },
  switchBase: theme.palette.switchBase,
  checked: theme.palette.checked,
  track: theme.palette.track,
}))

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

const Map = () => {
  const history = useHistory()
  const {
    distance,
    getDistanceToTarget,
    makeReadMessages,
    wroteUsersIds,
    removeIdFromWroteUsers,
    realUsers,
    getOnlineUsersChecked,
    selectedUserState,
    makeSelectedUserNull
  } = useContext(FirebaseContext)
  const classes = useStyles();
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
    libraries
  })

  const [chatStarted, setChatStarted] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [location, setLocation] = useState(getCurrentPosition())
  const [openDrawer, setOpenDrawer] = useState(false)

  const authFromState = useSelector(state => state.auth)
  const storageUser = JSON.parse(localStorage.getItem('user'))
  const isOnline = storageUser?.isOnline

  const getCurrentPositionForLocalPurpose = async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
    })
  }
  useEffect(() => {
    if (Object.keys(selectedUserState).length !== 0) {
      setSelectedUser(selectedUserState)
      setOpenDrawer(true)
      setChatStarted(true)
    }
  }, [selectedUserState])

  useEffect(() => {
    const unsubscribe = getOnlineUsersChecked();
    getCurrentPositionForLocalPurpose()
    return unsubscribe;
  }, [])


  const onMapClick = useCallback((_) => {
    setSelectedUser(null)
  }, [])

  const mapRef = useRef()
  const onMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  if (loadError) return 'Error loading maps'
  if (!isLoaded) return <div className="loader-wrapper-map-page"><Loader/></div>

  function Locate() {
    return (
        <button
            className="locate"
            onClick={getCurrentPositionForLocalPurpose}>
          <LocationSearchingIcon fontSize="large"/>
        </button>
    )
  }

  const openDrawerHandler = () => {
    removeIdFromWroteUsers(selectedUser, wroteUsersIds)
    makeReadMessages(selectedUser.uid)
    history.push(`/map/chat/${selectedUser.uid}`)
    setOpenDrawer(!openDrawer)
    setChatStarted(prev => !prev)
  }

  const justifyCenter = (truly) => {
    if (truly) return {justifyContent: 'center'}
    return {justifyContent: 'flex-end'}
  }

  const MapHeader = () => {
    return <div className="headerMap"><Locate/></div>
  }

  const RenderDistance = () => {
    return (
        <>
          {distance && authFromState.uid !== selectedUser.uid
              ?
              <>
                <Typography variant="body2" color="textSecondary" component="p" className={classes.padding}>
                  Distance - {distance} m
                </Typography>
                <Divider/>
              </>
              : ''
          }
        </>
    )
  }

  return (
      <>
        <MapHeader/>

        {location ? (<GoogleMap
            mapContainerStyle={containerStyle}
            zoom={18}
            center={{lat: location.lat, lng: location.lng}}
            options={options}
            onClick={onMapClick}
            onLoad={onMapLoad}
        >
          {/* это маркер Я*/}
          {/*<Marker position={{lat: location.lat, lng: location.lng}}
          icon={{url:  defUser, scaledSize: new window.google.maps.Size(30, 30),anchor: new window.google.maps.Point(15, 15),
           origin: new window.google.maps.Point(0, 0)}}/>*/}


          {isOnline && realUsers.map(user => {

            return <Marker
                // className={classes.markerClass}
                key={user.uid}
                position={{lat: user.location.lat, lng: user.location.lng}}
                icon={{
                  url: user.avatar || defUser,
                  scaledSize: new window.google.maps.Size(30, 30),
                  anchor: new window.google.maps.Point(15, 15),
                  origin: new window.google.maps.Point(0, 0)
                }}
                onClick={() => {
                  getDistanceToTarget({lat: location.lat, lng: location.lng}, {
                    lat: user.location.lat,
                    lng: user.location.lng
                  })
                  setSelectedUser(user)
                }}
            >
            </Marker>
          })
          }

          {selectedUser && (
              <InfoWindow
                  className={classes.root}
                  position={
                    {
                      lat: selectedUser.location.lat,
                      lng: selectedUser.location.lng
                    }
                  }
                  onCloseClick={() => setSelectedUser(null)}
              >
                <Card>
                  <CardActionArea>
                    <CardMedia
                        // className={classes.cardMedia}
                        style={{
                          height: '200px',
                          backgroundSize: 'contain',
                        }}
                        // className={classes.media}
                        image={selectedUser.avatar || defUser}
                        // title="Contemplative Reptile"
                    />
                    <CardContent className={classes.root}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {selectedUser?.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p" className={classes.padding}>
                        Age - {selectedUser?.age}
                      </Typography>
                      <Divider/>
                      <Typography variant="body2" color="textSecondary" component="p" className={classes.padding}>
                        Sex - {selectedUser?.sex}
                      </Typography>
                      <Divider/>
                      <RenderDistance />
                      <div className={classes.padding}>
                        <Typography variant="body2" color="textSecondary" component="p"
                                    className={classes.paddingForDescription}>
                          Description
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          {selectedUser?.description}
                        </Typography>
                      </div>
                      <Divider/>

                    </CardContent>
                    <CardActions
                        style={justifyCenter(selectedUser.uid === authFromState.uid)}
                    >
                      <Button
                          onClick={openDrawerHandler}
                          size="small"
                          color="primary"
                          disabled={selectedUser.uid === authFromState.uid}
                      >
                        {selectedUser.uid === authFromState.uid ? 'That\'s like people see your account' : 'Write'}
                      </Button>
                    </CardActions>
                  </CardActionArea>
                </Card>

              </InfoWindow>)}
        </GoogleMap>) : 'Turn on geolocation on browser'}
        <Drawer
            anchor='bottom'
            open={openDrawer}
            onClose={() => {
              setOpenDrawer(false)
              setChatStarted(false)
              makeSelectedUserNull()
              history.push('/map')
            }}
        >
          <Grid container>
            <Grid item className={classes.drawer} xs={12}>
              <ChatPage
                  selected={selectedUser}
                  chatStarted={chatStarted}
              />
            </Grid>
          </Grid>
        </Drawer>
      </>
  )
}

export default Map