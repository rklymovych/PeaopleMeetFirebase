import { auth, db, database } from '../firebase'

export const getCurrentPosition = (successCb) => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      if (typeof successCb === "function") {
        successCb(position);
      }
    })
  }
}

export const setDataToLocalStorage = (data) => {
  const { isOnline, location } = data;
  const storageData = JSON.parse(localStorage.getItem('user'))
  localStorage.setItem('user', JSON.stringify({
    ...storageData,
    isOnline: isOnline,
    location: { lat: location.lat, lng: location.lng }
  }))
}

export const setDataToRedux = (data) => {
  const { isOnline, location } = data;
  const id = auth.currentUser.uid;
  const myAcc = db.collection('users').doc(id);
  myAcc.update({
    location: {
      lat: location.lat,
      lng: location.lng,
    },
    isOnline: isOnline
  })
}

export const toggleStatusOnLineRealTime = (data) => {
  const { isOnline, location } = data;
  const id = auth.currentUser.uid;
  const myAcc = database.ref('/status/' + id);
  myAcc.update({
    visible: isOnline
  })
}