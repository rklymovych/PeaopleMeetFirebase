import {
  GET_CONVERSATIONS,
  IS_LOADED,
  SET_REAL_USERS,
  SET_UNREAD_MESSAGES,
  UPDATE_MESSAGES,
  GET_WROTE_USERS
} from "../../actions/constants";

const handlers = {
  [GET_CONVERSATIONS]: (state, {payload}) => ({...state, conversations: payload}),
  [UPDATE_MESSAGES]: (state, {payload}) => ({
    ...state,
    conversations: [...state.conversations],
    payload

  }),
  [SET_REAL_USERS]: (state, {payload}) => ({...state, realUsers: payload}),
  [IS_LOADED]: (state, {payload}) => ({...state, isLoaded: payload}),
  [SET_UNREAD_MESSAGES]: (state, {payload}) => ({...state, unreadMessages: payload}),
  [GET_WROTE_USERS]: (state,{payload}) =>({...state, wroteUsers: payload}),
  DEFAULT: state => state
}

export const firebaseReducer = (state, action) => {
  const handle = handlers[action.type] || handlers.DEFAULT
  return handle(state, action)
}