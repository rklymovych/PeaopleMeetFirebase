import React, {useContext, useState, useRef, useEffect} from 'react';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';
import {auth, db, database} from '../../firebase'
import {useHistory} from "react-router-dom";
import Map, {Marker, NavigationControl} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {FirebaseContext} from "../../context/firebaseContext/firebaseContext";
import {getCurrentPosition} from "../../utils/utils";
import defUser from "../../assets/def-user.jpg";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  flex: {
    maxWidth: '50%',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  map: {
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 77px)',
  },
  marker: {
    height: '69px',
    width: '47px',
    backgroundSize: 'contain',
    cursor: 'pointer',
    backgroundImage: "url('https://firebasestorage.googleapis.com/v0/b/radio-aba5d.appspot.com/o/users%2F9wiLPYpbUnaDrYKqCJH8QiscUfl1%2F16627332905446232530498618881303.jpg?alt=media&token=6098b4e2-6320-4fa0-9bd6-fbf1dceb7f65')"

  }
}));

const MapTiler = () => {
  const classes = useStyles();
  const mapContainer = useRef();
  const map = useRef(null);

  const API_KEY = process.env.REACT_APP_MAPTILER_KEY
  const storageUser = JSON.parse(localStorage.getItem('user'))
  const isOnline = storageUser?.isOnline
  const [location, setLocation] = useState()

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
  useEffect(() => {
    const unsubscribe = getOnlineUsersChecked();

    return unsubscribe;
  }, []);

  useEffect(() => {
    getCurrentPosition(position => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    })
  }, []);


  // useEffect(() => {
  //   console.log(97, location, realUsers)
  //   // if (map.current) return; //stops map from intializing more than once
  //   map.current = new maplibregl.Map({
  //     container: mapContainer.current,
  //     style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`,
  //     center: location && [location.lng, location.lat],
  //     zoom: zoom
  //   });
  //   map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
  //
  // }, [location]);

  // useEffect(() => {
  //   // new maplibregl.Marker().remove();
  //   console.log(95, realUsers)
  //   let marker = new maplibregl.Marker({color: "red"})
  //   realUsers.map(user=>{
  //     marker.remove();
  //   })
  //   realUsers.map((user) => {
  //
  //
  //
  //         marker.setLngLat([user.location.lng, user.location.lat])
  //         marker.addTo(map.current);
  //
  //
  //     //
  //
  //   })
  // }, [realUsers])
  const click = () => {
    console.log('cliiiiick')
  }
  console.log(113, location);
  var airportIcon = document.createElement('div');
  airportIcon.classList.add("airport");
  return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              {/*<div ref={mapContainer} className={classes.map}/>*/}

              <Map mapLib={maplibregl}
                   initialViewState={{
                     longitude: 26.9871,
                     latitude: 49.4230,
                     zoom: 15,
                     style: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`
                   }}

                   style={{width: "100%", height: " calc(100vh - 77px)"}}
                   // style: 'https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=StDXOYvHiyTitUiEoKeR',

              mapStyle="https://api.maptiler.com/maps/streets/style.json?key=StDXOYvHiyTitUiEoKeR"
              >
                <NavigationControl position="top-left"/>
                {realUsers && realUsers.map((user) => {
                  console.log(user.avatar)
                  return <Marker key={user.uid} longitude={user.location.lng} latitude={user.location.lat}
                                 className={classes.marker} style={{color: 'red'}} />
                })}

              </Map>


            </Paper>
          </Grid>
        </Grid>
      </div>
  );
}
export default MapTiler