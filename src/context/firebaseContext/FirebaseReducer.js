import {GET_CONVERSATIONS, SET_REAL_USERS, UPDATE_MESSAGES} from "../../actions/constants";

const handlers = {
  [GET_CONVERSATIONS]: (state, {payload}) => ({...state, conversations: payload}),
  [UPDATE_MESSAGES]: (state, {payload}) => ({
    ...state,
    conversations: [...state.conversations],
    payload

  }),
  [SET_REAL_USERS]: (state, {payload}) => ({...state, realUsers: payload}),
  DEFAULT: state => state
}

export const firebaseReducer = (state, action) => {
  const handle = handlers[action.type] || handlers.DEFAULT
  return handle(state, action)
}