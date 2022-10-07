import React, {useContext, useEffect, useState} from 'react'
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import {makeStyles} from "@material-ui/core/styles";
import {Icon} from "leaflet";
import {FirebaseContext} from "../../context/firebaseContext/firebaseContext";
import {Card, CardActions, CardContent, CardMedia, Drawer, Grid} from "@material-ui/core";
import defUser from "../../assets/def-user.jpg";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {ChatPage} from "../chatroom";
import chatBackground from "../../assets/chatBachground.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: '0px',
    paddingBottom: '0px'
  },
  leafletMap: {
    height: '100vh'
  },
  icon: {
    borderRadius: '50%',
  },
  padding: {
    padding: '7px 0 3px'
  },
  paddingForDescription: {
    padding: 0
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
  }
}));


const Leaflet = () => {
  const history = useHistory();

  const [chatStarted, setChatStarted] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)

  const storageUser = JSON.parse(localStorage.getItem('user'))
  const isOnline = storageUser?.isOnline
  const [location, setLocation] = useState();
  const authFromState = useSelector(state => state.auth)
  const classes = useStyles();
  const [selectedUser, setSelectedUser] = useState(null);
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

  const getCurrentPositionForLocalPurpose = async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
    })
  }

  useEffect(() => {
    const unsubscribe = getOnlineUsersChecked();
    getCurrentPositionForLocalPurpose()
    return unsubscribe;
  }, []);

  // const openDrawerHandler = () => {
  //   removeIdFromWroteUsers(selectedUser, wroteUsersIds)
  //   makeReadMessages(selectedUser.uid)
  //   history.push(`/map/chat/${selectedUser.uid}`)
  //   setOpenDrawer(!openDrawer)
  //   setChatStarted(prev => !prev)
  // }
  const justifyCenter = (truly) => {
    if (truly) return {justifyContent: 'center'}
    return {justifyContent: 'flex-end'}
  }

  const RenderDistance = ({user}) => {
    return (
        <>
          {distance && authFromState.uid !== user.uid
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

  const openDrawerHandler = () => {
    removeIdFromWroteUsers(selectedUser, wroteUsersIds)
    makeReadMessages(selectedUser.uid)
    history.push(`/map-leaflet/chat/${selectedUser.uid}`)
    setOpenDrawer(!openDrawer)
    setChatStarted(prev => !prev)
  }

  useEffect(() => {
    if (Object.keys(selectedUserState).length !== 0) {
      setSelectedUser(selectedUserState)
      setOpenDrawer(true)
      setChatStarted(true)
    }
  }, [selectedUserState])

  return (
      <div>
      {location ? (
          <MapContainer center={[location?.lat, location?.lng]} zoom={15} scrollWheelZoom={true}
                        style={{height: 'calc(100vh - 60px)'}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {isOnline && realUsers && realUsers.map((user) => {

              const icon = new Icon({
                iconUrl: user.avatar || defUser,
                iconSize: [55, 55],
              })

              return <Marker key={user.uid} position={[user.location.lat, user.location.lng]} icon={icon} className={classes.icon}
                             eventHandlers={{
                               click: () => {
                                 getDistanceToTarget({lat: location?.lat, lng: location?.lng}, {
                                   lat: user.location.lat,
                                   lng: user.location.lng
                                 })
                                 setSelectedUser(user)
                               },
                             }}>
                <Popup>
                  <Card style={{borderRadius: '12px'}}>
                      <CardMedia
                          // className={classes.cardMedia}
                          style={{
                            height: '200px',
                            backgroundSize: 'cover',
                          }}
                          // className={classes.media}
                          image={user.avatar || defUser}
                          // title="Contemplative Reptile"
                      />
                      <CardContent className={classes.root}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {user?.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.padding}>
                          Age - {user?.age}
                        </Typography>
                        <Divider/>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.padding}>
                          Sex - {user?.sex}
                        </Typography>
                        <Divider/>
                        <RenderDistance user={user} />
                        <div className={classes.padding}>
                          <Typography variant="body2" color="textSecondary" component="p"
                                      className={classes.paddingForDescription}>
                            Description
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p">
                            {user?.description}
                          </Typography>
                        </div>
                        <Divider/>

                      </CardContent>
                      <CardActions

                          style={justifyCenter(user.uid === authFromState.uid)}
                      >
                        <Button
                            onClick={openDrawerHandler}
                            size="small"
                            color="primary"
                            disabled={user.uid === authFromState.uid}
                        >

                          {user.uid === authFromState.uid ? 'That\'s like people see your account' : 'Write'}
                        </Button>
                      </CardActions>

                  </Card>

                </Popup>

              </Marker>


            })}

          </MapContainer>
      ) : 'Waiting for get geolocation'}

        <Drawer
            anchor='bottom'
            open={openDrawer}
            onClose={() => {
              setOpenDrawer(false)
              setChatStarted(false)
              makeSelectedUserNull()
              history.push('/map-leaflet')
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
      </div>
  )

}

export default Leaflet;