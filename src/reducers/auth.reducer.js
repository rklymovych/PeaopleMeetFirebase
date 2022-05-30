import { authConstant, userConstants } from "../actions/constants";
import { setDataToLocalStorage, setDataToRedux, toggleStatusOnLineRealTime } from '../utils/utils';
import {db} from '../firebase';

const initialState = {
  name: '',
  email: '',
  authenticating: false,
  authenticated: false,
  error: null,
  isOnline: false,
  sex: ''
}


export default (state = initialState, action) => {

  switch (action.type) {

    case `${authConstant.USER_LOGIN}_REQUEST`:
      state = {
        ...state,
        authenticating: true
      }
      break;
    case `${authConstant.USER_LOGIN}_SUCCESS`:
      state = {
        ...state,
        ...action.payload.user,
        authenticated: true,
        authenticating: false,
      }
      break;
    case `${authConstant.USER_LOGIN}_FAILURE`:

      state = {
        ...state,
        authenticated: false,
        authenticating: false,
        error: action.payload.error
      }
      break;
    case `${authConstant.USER_LOGOUT}_REQUEST`:
      break;
    case `${authConstant.USER_LOGOUT}_SUCCESS`:
      state = {
        ...initialState
      }
      break;
    case `${authConstant.USER_LOGOUT}_FAILURE`:
      state = {
        ...state,
        error: action.payload.error
      }
      break;
    case userConstants.GET_STATUS_CURRENT_USER:
      setDataToLocalStorage(action.payload);
      setDataToRedux(action.payload);
      state = {
        ...state,
        ...action.payload
      }
      break;
    case userConstants.SET_DATA_CURRENT_USER:
      state = {
        ...state,
        ...action.payload.values
      }
      break;
    case userConstants.SET_AVATAR_CURRENT_USER:
      state = {
        ...state,
        avatar: action.payload
      }
  }
  return state
}

