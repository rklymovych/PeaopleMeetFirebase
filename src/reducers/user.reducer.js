import {userConstants} from "../actions/constants";

const initialState = {
  users: [],
  conversations: []
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
        state ={
          ...state,
          conversations: []
        }
        break;
  }

  return state;
}