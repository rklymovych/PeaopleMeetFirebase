import {userConstants} from "../actions/constants";

const initialState = {
  users: [],
  conversations: [],
  loading: false,
  isDarkMode: false
}


export default (state = initialState, action) => {

  switch (action.type) {

    case `${userConstants.GET_REALTIME_USERS}_REQUEST`:
      break;
    case `${userConstants.GET_REALTIME_USERS}_SUCCESS`:
      state = {
        ...state,
        users: action.payload.users
      }
      break;
    case userConstants.GET_REALTIME_MESSAGES:
      state = {
        ...state,
        conversations: action.payload.conversations
      }
      break;
    case `${userConstants.GET_REALTIME_MESSAGES}_FAILURE`:
      state = {
        ...state,
        conversations: []
      }
      break;
    case 'SWITCH_DARK_MODE':
      state = {
        ...state,
        isDarkMode: action.payload
      }
      break;
    case 'GET_REALTIME_MESSAGES_REQUEST':
      state = {
        ...state,
        loading:  action.payload
      }
  }

  return state;
}