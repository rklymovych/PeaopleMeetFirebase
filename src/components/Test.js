import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react'
import {GoogleMap, InfoWindow, Marker, useLoadScript} from '@react-google-maps/api';
import {SideNav} from "./SideNav";
import mapStyles from "../components/maps/MapStyles";
import skaters from '../components/maps/skateboarding.svg'
import {formatRelative} from 'date-fns'
import compass from '../assets/2277999_map-compass-compass-svg-hd-png-download.png'
import {auth, db} from "../firebase";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import '@reach/combobox/styles.css'

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
  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
    libraries
  })
  const [markers, setMarkers] = useState([])
  const [selected, setSelected] = useState(null)
  const [location, setLocation] = useState()

  useEffect(() => {
    getCurrentPosition()
    console.log('location', location)
  }, [])


  const getCurrentPosition = async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude)
      setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
    })
  }

  const onMapClick = useCallback((event) => {
    new Date().toISOString()
    setMarkers(current => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date()
      }])
  }, [])

  const mapRef = useRef()
  const onMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [])

  const panTo = useCallback(({lat, lng}) => {
    mapRef.current.panTo({lat, lng})
    mapRef.current.setZoom(14)
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

  console.log('currentUser',auth.currentUser);

  console.log(location)
  return (
      <SideNav>
        <h1>Bears <span role="img" aria-label="tent">😋</span></h1>
        {/*<Search panTo={panTo}/>*/}
        <Locate/>
        {location ? (     <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={18}
            center={{lat: location.lat, lng: location.lng}}
            options={options}
            onClick={onMapClick}
            onLoad={onMapLoad}
        >
          <Marker
              position={{lat: location.lat, lng: location.lng}}
          ></Marker>
          {/*{markers.map(marker => <Marker*/}
          {/*        key={marker.time.toISOString()}*/}
          {/*        position={{lat: marker.lat, lng: marker.lng}}*/}
          {/*        icon={{*/}
          {/*          url: skaters,*/}
          {/*          scaledSize: new window.google.maps.Size(30, 30),*/}
          {/*          origin: new window.google.maps.Point(0, 0),*/}
          {/*          anchor: new window.google.maps.Point(15, 15),*/}
          {/*        }}*/}
          {/*        onClick={() => {*/}
          {/*          setSelected(marker)*/}
          {/*        }}*/}
          {/*    />*/}
          {/*)}*/}
          {selected ? (
              <InfoWindow position={{lat: selected.lat, lng: selected.lng}} onCloseClick={() => setSelected(null)}>
                <div>
                  <h2>Bear Spotted</h2>
                  <p>Spotted {formatRelative(selected.time, new Date())}</p>
                </div>

              </InfoWindow>) : null}
        </GoogleMap>): null}

      </SideNav>
  )
}


// function Search({panTo}) {
//   const {ready, value, suggestions: {status, data}, setValue, clearSuggestions} = usePlacesAutocomplete({
//     requestOptions: {
//       location: {
//         lat: () => 49.423250,
//         lng: () => 26.985693
//       },
//       radius: 200 * 1000
//     }
//   })
//   return (
//       <div className="search">
//         <Combobox onSelect={async (address) => {
//           setValue(address, false)
//           clearSuggestions()
//           try {
//             const results = await getGeocode({address});
//             const {lat, lng} = await getLatLng(results[0])
//             panTo({lat, lng})
//
//           } catch (error) {
//             console.log(error)
//           }
//         }}
//         >
//           <ComboboxInput
//               value={value}
//               onChange={(e) => {
//                 setValue(e.target.value)
//               }}
//               disabled={!ready}
//               placeholder="Enter an Address"
//           />
//           <ComboboxPopover>
//             <ComboboxList>
//               {status === 'OK' && data.map(({id, description}) => (
//                   <ComboboxOption key={id} value={description}/>
//               ))}
//             </ComboboxList>
//           </ComboboxPopover>
//         </Combobox>
//       </div>
//   )
// }