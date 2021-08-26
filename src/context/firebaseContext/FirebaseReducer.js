import {
  GET_CONVERSATIONS,
  IS_LOADED,
  SET_REAL_USERS,
  GET_WROTE_USERS_IDS,
  SET_SELECTED_USER,
  SET_SELECTED_USER_NULL,
  GET_WROTE_USERS
} from "../../actions/constants";

const handlers = {
  [GET_CONVERSATIONS]: (state, {payload}) => ({...state, myConversationWithCurrentUser: payload}),
  [SET_REAL_USERS]: (state, {payload}) => ({...state, realUsers: payload}),
  [IS_LOADED]: (state, {payload}) => ({...state, isLoaded: payload}),
  [GET_WROTE_USERS_IDS]: (state, {payload}) => ({...state, wroteUsersIds: payload}),
  [SET_SELECTED_USER]: (state, {payload}) => ({...state, selectedUserState: payload}),
  [SET_SELECTED_USER_NULL]: (state, {payload}) => ({...state, selectedUserState: payload}),
  [GET_WROTE_USERS]: (state, {payload}) => ({...state, wroteUsers: payload}),
  DEFAULT: state => state
}

export const firebaseReducer = (state, action) => {
  const handle = handlers[action.type] || handlers.DEFAULT
  return handle(state, action)
}