import React, {useState, useEffect} from 'react'
import {SideNav} from "./SideNav";
import {GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow} from "react-google-maps";
import * as parksData from '../components/maps/skateboard-parks.json'
import skateboarding from '../components/maps/skateboarding.svg'
import mapStyles from '../components/maps/MapStyles'


const Map = () => {
  const [selectedPark, setSelectedPark] = useState(null)
  const [coordinates, setCoordinates]=useState({})

  useEffect(()=>{
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
        setCoordinates({lat: position.coords.latitude, lng: position.coords.longitude})
      });
    } else {
      console.log("Not Available");
    }

  },[])

  return <GoogleMap defaultZoom={18}
                    defaultCenter={{lat: 49.4066884, lng: 26.9544341}}
                    defaultOptions={{styles: mapStyles}}
  >
     <Marker
          position={{
            lat: coordinates.lat,
            lng:  coordinates.lng
          }}
      />

    {/*{parksData.features.map(park => (*/}
    {/*    <Marker*/}
    {/*        key={park.properties.PARK_ID}*/}
    {/*        position={{*/}
    {/*          lat: park.geometry.coordinates[1],*/}
    {/*          lng: park.geometry.coordinates[0]*/}
    {/*        }}*/}
    {/*        onClick={() => {*/}
    {/*          setSelectedPark(park);*/}
    {/*        }}*/}
    {/*        icon={{*/}
    {/*          url: skateboarding,*/}
    {/*          scaledSize: new window.google.maps.Size(25, 25)*/}
    {/*        }}*/}
    {/*    />*/}
    {/*))}*/}
    {selectedPark && (
        <InfoWindow
            position={{
              lat: selectedPark.geometry.coordinates[1],
              lng: selectedPark.geometry.coordinates[0]
            }}
            onCloseClick={() => {
              setSelectedPark(null)
            }}
        >
          <div>
            <h2>{selectedPark.properties.NAME}</h2>
            <p>{selectedPark.properties.DESCRIPTIO}</p>
          </div>
        </InfoWindow>
    )}
  </GoogleMap>
}

const WrappedMap = withScriptjs(withGoogleMap(Map))

export function Test() {
  return (
      <SideNav>
        <div style={{width: '100vw', height: 'calc(100vh - 60px)'}}>
          <WrappedMap
              googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
              loadingElement={<div style={{height: `100%`}}/>}
              containerElement={<div style={{height: `100%`}}/>}
              mapElement={<div style={{height: `100%`}}/>}

          />
        </div>
      </SideNav>

  )
}