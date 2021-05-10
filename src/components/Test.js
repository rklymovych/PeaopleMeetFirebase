import React, {useContext} from 'react'
import {SideNav} from "./SideNav";
import {GoogleMap, withScriptjs, withGoogleMap, Marker} from "react-google-maps";
// import * as park

const Map = () => {
  return <GoogleMap defaultZoom={18} defaultCenter={{lat:49.425644, lng: 26.982202}}

  >
    </GoogleMap>
}

const WrappedMap = withScriptjs(withGoogleMap(Map))
console.log('eky', process.env.REACT_APP_GOOGLE_KEY)
export function Test() {
  return (
      <SideNav>
        <div style={{width: '100vw', height: '100vh'}}>
        <WrappedMap googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}

        />
        </div>
      </SideNav>

  )
}